import React, { useState, useCallback, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../../../hooks/useNotifications";
import {
  useAppointmentsData,
  useAppointmentStats,
  useCustomerInfo,
  type AppointmentFilters,
} from "../hooks/useAppoitmentsData";
import { Appointment } from "../../../types";
import { sendSms } from "../../../services/smsService";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  TrashIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { format } from "date-fns";

const AdminAppointmentsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { createNotification } = useNotifications();

  const [filters, setFilters] = useState<AppointmentFilters>({
    dateFilter: "all",
    statusFilter: "pending",
    showDeleted: false,
  });

  const [showStats, setShowStats] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(
    null
  );
  const [rejectionComment, setRejectionComment] = useState("");

  const [actionStates, setActionStates] = useState<{
    deleting: string | null;
    restoring: string | null;
    sendingSms: string | null;
  }>({
    deleting: null,
    restoring: null,
    sendingSms: null,
  });

  const { appointments, services, customers, loading, error, refresh } =
    useAppointmentsData(userProfile?.salonId, filters);

  const stats = useAppointmentStats(appointments);
  const getCustomerInfo = useCustomerInfo(customers);

  const getServiceName = useCallback(
    (serviceId: string) => {
      const service = services.find((s) => s.id === serviceId);
      return service?.name || "Unknown Service";
    },
    [services]
  );

  const filteredAppointments = useMemo(() => {
    if (filters.showDeleted) {
      return appointments.filter((apt) => apt.deleted);
    }

    return appointments.filter((apt) => {
      if (apt.deleted) return false;
      return (
        filters.statusFilter === "all" || apt.status === filters.statusFilter
      );
    });
  }, [appointments, filters.statusFilter, filters.showDeleted]);

  const getStatusColor = useCallback(
    (status: Appointment["status"], deleted?: boolean) => {
      if (deleted) {
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      }

      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "confirmed":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
        case "in_progress":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
        case "completed":
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        case "cancelled":
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      }
    },
    []
  );

  const updateAppointmentStatus = useCallback(
    async (
      appointmentId: string,
      status: Appointment["status"],
      comment?: string
    ) => {
      try {
        setActionStates((prev) => ({ ...prev, sendingSms: appointmentId }));

        const updateData: any = {
          status,
          updatedAt: new Date(),
        };

        if (comment) {
          updateData.rejectionComment = comment;
          updateData.rejectionDate = new Date();
        }

        await updateDoc(doc(db, "appointments", appointmentId), updateData);

        const appointment = appointments.find(
          (apt) => apt.id === appointmentId
        );
        if (appointment) {
          if (appointment.customerId) {
            await createNotification(
              appointment.customerId,
              status === "confirmed"
                ? "booking_confirmed"
                : "booking_cancelled",
              `Appointment ${status}`,
              status === "confirmed"
                ? `Your appointment has been confirmed. Date: ${format(
                    new Date(appointment.date || ""),
                    "MMM dd, yyyy"
                  )} at ${appointment.time || "N/A"}`
                : `Your appointment has been ${status}. ${
                    comment ? `Reason: ${comment}` : ""
                  } Date: ${format(
                    new Date(appointment.date || ""),
                    "MMM dd, yyyy"
                  )} at ${appointment.time || "N/A"}`
            );
          }

          const customerInfo = getCustomerInfo(
            appointment.customerId,
            appointment
          );
          const customerPhone = customerInfo.phone;

          if (customerPhone) {
            const serviceName = getServiceName(appointment.serviceId);
            const appointmentDate = format(
              new Date(appointment.date || ""),
              "MMM dd, yyyy"
            );
            const appointmentTime = appointment.time || "N/A";

            let smsMessage = "";
            if (status === "confirmed") {
              smsMessage = `Hi ${customerInfo.name}, your appointment for ${serviceName} on ${appointmentDate} at ${appointmentTime} has been CONFIRMED. Thank you for choosing Bookinga!`;
            } else if (status === "cancelled") {
              //smsMessage = `Hi ${customerInfo.name}, your appointment for ${serviceName} on ${appointmentDate} at ${appointmentTime} has been CANCELLED.${comment ? ` Reason: ${comment}` : ''} Please contact us to reschedule.`;
            }

            if (smsMessage) {
              try {
                await sendSms(customerPhone, smsMessage);
              } catch (smsError) {
                console.error("Failed to send SMS:", smsError);
              }
            }
          }
        }

        await refresh();
      } catch (error) {
        console.error("Error updating appointment:", error);
      } finally {
        setActionStates((prev) => ({ ...prev, sendingSms: null }));
      }
    },
    [appointments, getCustomerInfo, getServiceName, createNotification, refresh]
  );

  const deleteAppointment = useCallback(
    async (appointmentId: string) => {
      if (
        !confirm(
          "Are you sure you want to delete this appointment? This action can be undone later."
        )
      ) {
        return;
      }

      try {
        setActionStates((prev) => ({ ...prev, deleting: appointmentId }));

        await updateDoc(doc(db, "appointments", appointmentId), {
          deleted: true,
          deletedAt: new Date(),
          deletedBy: userProfile?.uid || "admin",
          updatedAt: new Date(),
        });

        const appointment = appointments.find(
          (apt) => apt.id === appointmentId
        );
        if (appointment?.customerId) {
          await createNotification(
            appointment.customerId,
            "booking_cancelled",
            "Appointment Deleted",
            `Your appointment scheduled for ${format(
              new Date(appointment.date || ""),
              "MMM dd, yyyy"
            )} at ${appointment.time || "N/A"} has been removed.`
          );
        }

        await refresh();
      } catch (error) {
        console.error("Error deleting appointment:", error);
        alert("Failed to delete appointment. Please try again.");
      } finally {
        setActionStates((prev) => ({ ...prev, deleting: null }));
      }
    },
    [appointments, userProfile?.uid, createNotification, refresh]
  );

  const restoreAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        setActionStates((prev) => ({ ...prev, restoring: appointmentId }));

        await updateDoc(doc(db, "appointments", appointmentId), {
          deleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedAt: new Date(),
        });

        await refresh();
      } catch (error) {
        console.error("Error restoring appointment:", error);
        alert("Failed to restore appointment. Please try again.");
      } finally {
        setActionStates((prev) => ({ ...prev, restoring: null }));
      }
    },
    [refresh]
  );

  const toggleCardExpansion = useCallback((appointmentId: string) => {
    setExpandedCard((prev) => (prev === appointmentId ? null : appointmentId));
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Partial<AppointmentFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const handleRejectAppointment = useCallback((appointmentId: string) => {
    setShowRejectionModal(appointmentId);
    setRejectionComment("");
  }, []);

  const confirmRejectAppointment = useCallback(async () => {
    if (showRejectionModal && rejectionComment.trim()) {
      await updateAppointmentStatus(
        showRejectionModal,
        "cancelled",
        rejectionComment.trim()
      );
      setShowRejectionModal(null);
      setRejectionComment("");
    }
  }, [showRejectionModal, rejectionComment, updateAppointmentStatus]);

  const cancelRejectModal = useCallback(() => {
    setShowRejectionModal(null);
    setRejectionComment("");
  }, []);

  const filterOptions = useMemo(
    () => [
      { key: "all", label: "All", color: "bg-gray-500", count: stats.total },
      {
        key: "pending",
        label: "Pending",
        color: "bg-yellow-500",
        count: stats.pending,
      },
      {
        key: "confirmed",
        label: "Confirmed",
        color: "bg-blue-500",
        count: stats.confirmed,
      },
      {
        key: "completed",
        label: "Completed",
        color: "bg-green-500",
        count: stats.completed,
      },
      {
        key: "cancelled",
        label: "Cancelled",
        color: "bg-red-500",
        count: stats.cancelled,
      },
    ],
    [stats]
  );

  const statsData = useMemo(
    () => [
      {
        label: "Total",
        count: filteredAppointments.length,
        color: "bg-blue-500",
        icon: CalendarIcon,
      },
      {
        label: "Pending",
        count: filteredAppointments.filter(
          (a) => a.status === "pending" && !a.deleted
        ).length,
        color: "bg-yellow-500",
        icon: ClockIcon,
      },
      {
        label: "Confirmed",
        count: filteredAppointments.filter(
          (a) => a.status === "confirmed" && !a.deleted
        ).length,
        color: "bg-green-500",
        icon: CheckIcon,
      },
      {
        label: "Completed",
        count: filteredAppointments.filter(
          (a) => a.status === "completed" && !a.deleted
        ).length,
        color: "bg-purple-500",
        icon: UserIcon,
      },
    ],
    [filteredAppointments]
  );

  const AppointmentsSkeleton = () => (
    <div className="p-4 space-y-4 pb-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const AppointmentsError = () => (
    <div className="p-4">
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">Failed to load appointments</div>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const AppointmentsEmpty = () => (
    <div className="p-4">
      <div className="text-center py-16">
        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
          No{" "}
          {filters.showDeleted
            ? "deleted"
            : filters.statusFilter === "all"
            ? ""
            : filters.statusFilter}{" "}
          appointments
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm px-4">
          {filters.showDeleted
            ? "No deleted appointments found."
            : "No appointments match your current filters."}
        </p>
      </div>
    </div>
  );

  const AppointmentsList = () => {
    if (error) return <AppointmentsError />;
    if (loading) return <AppointmentsSkeleton />;
    if (filteredAppointments.length === 0) return <AppointmentsEmpty />;

    return (
      <div className="p-4 space-y-4 pb-6">
        {filteredAppointments.map((appointment: Appointment) => {
          const customerInfo = getCustomerInfo(
            appointment.customerId,
            appointment
          );
          const isExpanded = expandedCard === appointment.id;

          return (
            <div
              key={appointment.id}
              className={`bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden ${
                appointment.deleted ? "opacity-75" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate">
                          {getServiceName(appointment.serviceId)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {customerInfo.name}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCardExpansion(appointment.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-transform duration-200"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </span>
                        <span>
                          {format(new Date(appointment.date || ""), "MMM dd")}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          appointment.status,
                          appointment.deleted
                        )}`}
                      >
                        {appointment.deleted
                          ? "Deleted"
                          : appointment.status?.charAt(0).toUpperCase() +
                            appointment.status?.slice(1).replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-dark-bg">
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-dark-text">
                      Customer Details
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{customerInfo.name}</span>
                      </div>
                      {customerInfo.phone && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <a
                            href={`tel:${customerInfo.phone}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {customerInfo.phone}
                          </a>
                        </div>
                      )}
                      {customerInfo.email && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <a
                            href={`mailto:${customerInfo.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                          >
                            {customerInfo.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-dark-text">
                      Appointment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        <span>{appointment.duration} min</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                        <span>
                          {appointment.currency} {appointment.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!filters.showDeleted && !appointment.deleted && (
                    <div className="space-y-2">
                      {appointment.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "confirmed"
                              )
                            }
                            disabled={
                              actionStates.sendingSms === appointment.id
                            }
                            className="flex-1 py-2 px-3 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                          >
                            <CheckIcon className="w-4 h-4 inline mr-1" />
                            {actionStates.sendingSms === appointment.id
                              ? "Confirming..."
                              : "Confirm"}
                          </button>
                          <button
                            onClick={() =>
                              handleRejectAppointment(appointment.id)
                            }
                            className="flex-1 py-2 px-3 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                          >
                            <XMarkIcon className="w-4 h-4 inline mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                      {appointment.status === "confirmed" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "in_progress"
                              )
                            }
                            className="flex-1 py-2 px-3 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                          >
                            Start Service
                          </button>
                          <button
                            onClick={() =>
                              handleRejectAppointment(appointment.id)
                            }
                            className="flex-1 py-2 px-3 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {appointment.status === "in_progress" && (
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "completed")
                          }
                          className="w-full py-2 px-3 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          <CheckIcon className="w-4 h-4 inline mr-1" />
                          Mark Complete
                        </button>
                      )}
                      {appointment.status === "cancelled" && (
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          disabled={actionStates.deleting === appointment.id}
                          className="w-full py-2 px-3 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                        >
                          <TrashIcon className="w-4 h-4 inline mr-1" />
                          {actionStates.deleting === appointment.id
                            ? "Deleting..."
                            : "Delete Permanently"}
                        </button>
                      )}
                    </div>
                  )}

                  {filters.showDeleted && (
                    <button
                      onClick={() => restoreAppointment(appointment.id)}
                      disabled={actionStates.restoring === appointment.id}
                      className="w-full py-2 px-3 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                    >
                      <ArrowPathIcon className="w-4 h-4 inline mr-1" />
                      {actionStates.restoring === appointment.id
                        ? "Restoring..."
                        : "Restore Appointment"}
                    </button>
                  )}

                  {appointment.deleted && appointment.deletedAt && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded p-2">
                      Deleted on{" "}
                      {format(appointment.deletedAt, "MMM dd, yyyy HH:mm")}
                      {appointment.deletedBy && ` by ${appointment.deletedBy}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
      <div className="bg-white sticky top-0 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border p-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800 dark:text-dark-text">
              {filters.showDeleted ? "Deleted Appointments" : "Appointments"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAppointments.length}{" "}
              {filters.statusFilter === "all" ? "total" : filters.statusFilter}{" "}
              appointments
            </p>
          </div>
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {showStats ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="space-y-3">
          {!filters.showDeleted && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {filterOptions.map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() =>
                    handleFilterChange({
                      statusFilter: filterOption.key as any,
                    })
                  }
                  className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200 ${
                    filters.statusFilter === filterOption.key
                      ? `${filterOption.color} text-white border-transparent shadow-sm`
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-dark-card dark:text-gray-300 dark:border-dark-border dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{filterOption.label}</span>
                  {filterOption.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        filters.statusFilter === filterOption.key
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {filterOption.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                handleFilterChange({ showDeleted: !filters.showDeleted })
              }
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                filters.showDeleted
                  ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-dark-card dark:text-gray-300 dark:border-dark-border dark:hover:bg-gray-700"
              }`}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {filters.showDeleted ? "Show Active" : "Show Deleted"}
              {stats.deleted > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    filters.showDeleted
                      ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {stats.deleted}
                </span>
              )}
            </button>
          </div>
        </div>

        {showStats && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3"
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${stat.color} text-white mr-3`}
                  >
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                      {stat.count}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AppointmentsList />

      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
              Reject Appointment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting this appointment. This will
              be sent to the customer via SMS.
            </p>
            <textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              placeholder="Enter reason for rejection (max 200 characters)..."
              maxLength={200}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {rejectionComment.length}/200 characters
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={cancelRejectModal}
                className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectAppointment}
                disabled={
                  !rejectionComment.trim() ||
                  actionStates.sendingSms === showRejectionModal
                }
                className="flex-1 py-2 px-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionStates.sendingSms === showRejectionModal
                  ? "Rejecting..."
                  : "Reject & Send SMS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;
