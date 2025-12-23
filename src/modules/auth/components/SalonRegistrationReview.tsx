import React from 'react';
import { SalonFormData } from '../pages/SalonRegistrationPage';

interface ReviewProps {
  formData: SalonFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const SalonRegistrationReview: React.FC<ReviewProps> = ({ formData, handleInputChange }) => (
  <div className="space-y-3 text-sm">
    <div>
      <h3 className="font-semibold mb-2">Personal Info</h3>
      <div className="space-y-1">
        <div><span className="font-medium">Name:</span> {formData.displayName}</div>
        <div><span className="font-medium">Email:</span> {formData.email}</div>
        <div><span className="font-medium">Phone:</span> {formData.phone.country.dialCode} {formData.phone.localNumber}</div>
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Salon Details</h3>
      <div className="space-y-1">
        <div><span className="font-medium">Name:</span> {formData.salonName}</div>
        <div><span className="font-medium">Type:</span> {formData.businessType}</div>
        <div><span className="font-medium">Capacity:</span> {formData.capacity}</div>
        <div><span className="font-medium">Description:</span> {formData.description}</div>
        {formData.tinNumber && <div><span className="font-medium">TIN:</span> {formData.tinNumber}</div>}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Location</h3>
      <div className="space-y-1">
        <div>{formData.city}, {formData.province}, {formData.country}</div>
        {formData.website && <div><span className="font-medium">Website:</span> {formData.website}</div>}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Services</h3>
      <div className="space-y-2">
        {formData.services.map((service, idx) => (
          <div key={idx} className="border p-2 rounded bg-gray-50 dark:bg-dark-bg">
            <div className="font-medium">{service.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {service.category} • {service.price} {service.currency} • {service.duration}h
            </div>
            <div className="text-xs mt-1">{service.description}</div>
          </div>
        ))}
      </div>
    </div>

    <label className="flex items-start text-xs">
      <input
        type="checkbox"
        name="agreeToTerms"
        checked={formData.agreeToTerms}
        onChange={handleInputChange}
        className="mr-2 h-3 w-3 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
      />
      <span className="text-gray-700 dark:text-gray-300">
        I agree to the{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500 underline">Terms</a>
        {' '}and{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500 underline">Privacy Policy</a>
      </span>
    </label>
  </div>
);

export default SalonRegistrationReview;