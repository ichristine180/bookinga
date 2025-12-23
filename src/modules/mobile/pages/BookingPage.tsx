import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { Salon, Service, Staff } from "../../../types";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/16/solid";
import {
  format,
  addDays,
  addMonths,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  endOfMonth,
  isToday,
  isTomorrow,
  parseISO,
  getMonth,
} from "date-fns";
import PhoneSelect, { PhoneValue } from "@/modules/common/PhoneSelect";
import { countries } from "@/config/countries";
import {
  initiatePaypackCheckout,
  storePendingBooking,
  storePaypackSession,
  BOOKING_FEE,
  PendingBooking,
} from "@/services/paypackService";

const MobileBookingPage: React.FC = () => {
  const { salonId, serviceId } = useParams<{
    salonId: string;
    serviceId: string;
  }>();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const rwanda = countries.find((c) => c.code === "RW") || countries[0];

  const [salon, setSalon] = useState<Salon | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  const [currentViewMonth, setCurrentViewMonth] = useState<Date>(new Date());
  const [showCalendarView, setShowCalendarView] = useState<boolean>(false);

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    phone: { country: rwanda, localNumber: "" } as PhoneValue,
    email: "",
  });

  const isAuthenticated = currentUser && userProfile;

  const quickAccessDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return date;
  });

  const getCalendarDates = (viewMonth: Date) => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const dates = [];

    for (
      let date = new Date(monthStart);
      date <= monthEnd;
      date.setDate(date.getDate() + 1)
    ) {
      if (!isBefore(date, startOfDay(new Date()))) {
        dates.push(new Date(date));
      }
    }

    return dates;
  };

  const isWithinBookingWindow = (date: Date) => {
    const oneYearFromNow = addMonths(new Date(), 12);
    return (
      !isBefore(date, startOfDay(new Date())) && !isAfter(date, oneYearFromNow)
    );
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!salonId || !serviceId) {
        setLoading(false);
        return;
      }

      try {
        const salonDoc = await getDoc(doc(db, "salons", salonId));
        if (salonDoc.exists()) {
          const salonData = {
            id: salonDoc.id,
            ...salonDoc.data(),
            createdAt: salonDoc.data().createdAt?.toDate(),
            updatedAt: salonDoc.data().updatedAt?.toDate(),
            subscription: {
              ...salonDoc.data().subscription,
              expiresAt: salonDoc.data().subscription?.expiresAt?.toDate(),
            },
          } as Salon;
          setSalon(salonData);
        }

        const serviceDoc = await getDoc(doc(db, "services", serviceId));
        if (serviceDoc.exists()) {
          const serviceData = {
            id: serviceDoc.id,
            ...serviceDoc.data(),
            createdAt: serviceDoc.data().createdAt?.toDate(),
            updatedAt: serviceDoc.data().updatedAt?.toDate(),
          } as Service;
          setService(serviceData);
        }

        const staffQuery = query(
          collection(db, "staff"),
          where("salonId", "==", salonId),
          where("isActive", "==", true)
        );
        const staffSnapshot = await getDocs(staffQuery);
        const staffData = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Staff[];

        setStaff(staffData);

        if (staffData.length > 0) {
          setSelectedStaff(staffData[0].id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [salonId, serviceId]);

  const getAvailableTimeSlots = () => {
    if (!salon || !selectedDate) return [];

    const dayName = format(selectedDate, "EEEE").toLowerCase();
    const workingHours = salon.workingHours[dayName];

    if (!workingHours || workingHours.closed) {
      return [];
    }

    const slots = [];
    const openTime = parseISO(`2000-01-01T${workingHours.open}:00`);
    const closeTime = parseISO(`2000-01-01T${workingHours.close}:00`);
    const serviceDuration = service?.duration || 60;

    const currentTime = openTime;

    while (isBefore(currentTime, closeTime)) {
      const serviceEndTime = addDays(currentTime, 0);
      serviceEndTime.setMinutes(serviceEndTime.getMinutes() + serviceDuration);

      if (
        isBefore(serviceEndTime, closeTime) ||
        serviceEndTime.getTime() === closeTime.getTime()
      ) {
        const timeString = format(currentTime, "HH:mm");

        if (isToday(selectedDate)) {
          const now = new Date();
          const slotDateTime = new Date(selectedDate);
          const [hours, minutes] = timeString.split(":").map(Number);
          slotDateTime.setHours(hours, minutes, 0, 0);

          if (isAfter(slotDateTime, now)) {
            slots.push(timeString);
          }
        } else {
          slots.push(timeString);
        }
      }

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  const formatDateForDisplay = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  const isDayAvailable = (date: Date) => {
    if (!salon) return false;
    if (!isWithinBookingWindow(date)) return false;

    const dayName = format(date, "EEEE").toLowerCase();
    const workingHours = salon.workingHours[dayName];

    return workingHours && !workingHours.closed;
  };

  const goToPreviousMonth = () => {
    const prevMonth = addMonths(currentViewMonth, -1);

    if (!isBefore(prevMonth, startOfMonth(new Date()))) {
      setCurrentViewMonth(prevMonth);
    }
  };

  const goToNextMonth = () => {
    const nextMonth = addMonths(currentViewMonth, 1);
    const maxMonth = addMonths(new Date(), 12);

    if (!isAfter(nextMonth, maxMonth)) {
      setCurrentViewMonth(nextMonth);
    }
  };

  const canGoToPreviousMonth = () => {
    const prevMonth = addMonths(currentViewMonth, -1);
    return !isBefore(prevMonth, startOfMonth(new Date()));
  };

  const canGoToNextMonth = () => {
    const nextMonth = addMonths(currentViewMonth, 1);
    const maxMonth = addMonths(new Date(), 12);
    return !isAfter(nextMonth, maxMonth);
  };

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (phone: PhoneValue) => {
    setGuestInfo((prev) => ({
      ...prev,
      phone,
    }));
  };

  const validateGuestInfo = () => {
    if (!guestInfo.name.trim()) {
      alert("Please enter your name");
      return false;
    }

    if (!guestInfo.phone.localNumber.trim()) {
      alert("Please enter your phone number");
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!salon || !service || !selectedDate || !selectedTime) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!selectedStaff && staff.length > 0) {
      alert("Please select a staff member.");
      return;
    }

    if (!isAuthenticated && !validateGuestInfo()) {
      return;
    }

    setBooking(true);

    try {
      const customerId = isAuthenticated
        ? currentUser!.uid
        : `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      const customerName = isAuthenticated
        ? currentUser!.displayName || userProfile!.displayName
        : guestInfo.name;

      const customerPhone = isAuthenticated
        ? userProfile!.phone
        : `${
            guestInfo.phone.country.dialCode
          }${guestInfo.phone.localNumber.replace(/\D/g, "")}`;

      const customerEmail = isAuthenticated
        ? currentUser!.email || ""
        : guestInfo.email;

      // Prepare pending booking data
      const pendingBooking: PendingBooking = {
        salonId: salon.id,
        serviceId: service.id,
        staffId: selectedStaff || (staff.length > 0 ? staff[0].id : ""),
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        duration: service.duration,
        totalAmount: service.price,
        currency: service.currency,
        specialInstructions,
        customerId,
        customerName: customerName || "",
        customerPhone: customerPhone || "",
        customerEmail,
        isGuest: !isAuthenticated,
        guestInfo: !isAuthenticated
          ? {
              name: guestInfo.name,
              phone: customerPhone || "",
              email: guestInfo.email,
            }
          : undefined,
        salonOwnerId: salon.ownerId,
        serviceName: service.name,
      };

      // Store pending booking before redirecting to payment
      storePendingBooking(pendingBooking);

      // Initiate Paypack checkout
      const checkoutResponse = await initiatePaypackCheckout(
        service.name,
        BOOKING_FEE,
        customerEmail || "guest@bookinga.rw"
      );

      // Store session ID for verification
      storePaypackSession(checkoutResponse.session_id);

      // Redirect to Paypack payment page
      window.location.href = checkoutResponse.payment_link;
    } catch (error) {
      console.error("Error initiating payment:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate payment. Please try again.";
      alert(errorMessage);
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!salon || !service) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
          Booking Not Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          The service or salon you're trying to book is not available.
        </p>
        <button
          onClick={() => navigate("/salons")}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Browse Salons
        </button>
      </div>
    );
  }

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="space-y-6 pb-32">
        {}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
            Book Appointment
          </h1>
          <div className="w-9 h-9"></div>
        </div>

        {}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg mr-4 overflow-hidden">
              {service.images && service.images.length > 0 ? (
                <img
                  src={service.images[0]}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
                {service.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {salon.name}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{service.duration / 60} hrs</span>
                </div>
                <div className="flex items-center text-primary-500 font-bold">
                  <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                  <span className="text-lg">{service.price}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {service.description}
          </p>
        </div>

        {}
        {!isAuthenticated && (
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Your Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={guestInfo.name}
                  onChange={handleGuestInfoChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <PhoneSelect
                value={guestInfo.phone}
                onChange={handlePhoneChange}
                label="Phone Number"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={guestInfo.email}
                  onChange={handleGuestInfoChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email (optional)"
                />
              </div>
            </div>
          </div>
        )}

        {}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Select Date
            </h3>
            <button
              onClick={() => setShowCalendarView(!showCalendarView)}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              {showCalendarView ? "Quick Select" : "Calendar View"}
            </button>
          </div>

          {!showCalendarView ? (
            <div className="grid grid-cols-2 gap-3">
              {quickAccessDates.map((date) => {
                const isAvailable = isDayAvailable(date);
                const isSelected =
                  format(date, "yyyy-MM-dd") ===
                  format(selectedDate, "yyyy-MM-dd");

                return (
                  <button
                    key={format(date, "yyyy-MM-dd")}
                    onClick={() => isAvailable && setSelectedDate(date)}
                    disabled={!isAvailable}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      !isAvailable
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : isSelected
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {formatDateForDisplay(date)}
                    </div>
                    <div className="text-xs mt-1">{format(date, "MMM d")}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {}
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  disabled={!canGoToPreviousMonth()}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
                  {format(currentViewMonth, "MMMM yyyy")}
                </h4>
                <button
                  onClick={goToNextMonth}
                  disabled={!canGoToNextMonth()}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
              </div>

              {}
              <div className="grid grid-cols-7 gap-2">
                {}
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}

                {}
                {Array.from(
                  { length: startOfMonth(currentViewMonth).getDay() },
                  (_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  )
                )}

                {}
                {getCalendarDates(currentViewMonth).map((date) => {
                  const isAvailable = isDayAvailable(date);
                  const isSelected =
                    format(date, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd");
                  const isCurrentMonth =
                    getMonth(date) === getMonth(currentViewMonth);

                  return (
                    <button
                      key={format(date, "yyyy-MM-dd")}
                      onClick={() => isAvailable && setSelectedDate(date)}
                      disabled={!isAvailable}
                      className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                        !isCurrentMonth
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : !isAvailable
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {format(date, "d")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {}
          {selectedDate && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Working Hours:</strong>{" "}
                {(() => {
                  const dayName = format(selectedDate, "EEEE").toLowerCase();
                  const workingHours = salon.workingHours[dayName];
                  if (!workingHours || workingHours.closed) {
                    return "Closed";
                  }
                  return `${workingHours.open} - ${workingHours.close}`;
                })()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          )}
        </div>

        {}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            Select Time
          </h3>

          {availableTimeSlots.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {selectedDate && !isDayAvailable(selectedDate)
                  ? "Salon is closed on this day"
                  : "No available time slots for this date"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableTimeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedTime === time
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {}
        {staff.length > 0 && (
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Select Staff Member
            </h3>
            <div className="space-y-3">
              {staff.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedStaff(member.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                    selectedStaff === member.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-text">
                        {member.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.specialties.join(", ") || "General services"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">
            Special Instructions (Optional)
          </h3>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests or preferences..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {}
        {!isAuthenticated && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
              Want to track your bookings?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Create an account to manage all your appointments, get reminders,
              and enjoy exclusive benefits.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Create Account →
            </button>
          </div>
        )}
      </div>

      {}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border shadow-lg">
        <button
          onClick={handleBooking}
          disabled={
            booking ||
            !selectedDate ||
            !selectedTime ||
            availableTimeSlots.length === 0 ||
            (!isAuthenticated &&
              (!guestInfo.name || !guestInfo.phone.localNumber))
          }
          className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {booking
            ? "Processing..."
            : `Pay & Book - RWF ${BOOKING_FEE.toLocaleString()}`}
        </button>

        {!isAuthenticated && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            You'll receive SMS confirmations and reminders
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileBookingPage;
