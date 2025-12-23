import React from 'react';
import { SalonFormData } from '../pages/SalonRegistrationPage';

interface SalonDetailsProps {
  formData: SalonFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  businessTypes: { value: string; label: string }[];
}

const SalonRegistrationSalonDetails: React.FC<SalonDetailsProps> = ({
  formData,
  handleInputChange,
  businessTypes,
}) => (
  <div className="space-y-2">
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Salon Name *
      </label>
      <input
        type="text"
        name="salonName"
        value={formData.salonName}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
        placeholder="Salon name"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description *
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
        placeholder="Describe your salon"
        rows={3}
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Business Type *
      </label>
      <select
        name="businessType"
        value={formData.businessType}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
      >
        {businessTypes.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Capacity *
      </label>
      <input
        type="number"
        name="capacity"
        value={formData.capacity}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
        min={1}
        placeholder="Number of clients you can serve at once"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        TIN Number
      </label>
      <input
        type="text"
        name="tinNumber"
        value={formData.tinNumber}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
        placeholder="TIN number (optional)"
      />
    </div>
  </div>
);

export default SalonRegistrationSalonDetails;