import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { SalonFormData } from '../pages/SalonRegistrationPage';
import PhoneSelect, { PhoneValue } from '@/modules/common/PhoneSelect';

interface PersonalInfoProps {
  formData: SalonFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handlePhoneChange: (phone: PhoneValue) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const SalonRegistrationPersonalInfo: React.FC<PersonalInfoProps> = ({
  formData,
  handleInputChange,
  handlePhoneChange,
  showPassword,
  setShowPassword,
}) => (
  <div className="space-y-2">
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Full Name *
      </label>
      <input
        type="text"
        name="displayName"
        value={formData.displayName}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
        placeholder="Your full name"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Email Address *
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
        placeholder="your@email.com"
      />
    </div>
    <PhoneSelect
      value={formData.phone}
      onChange={handlePhoneChange}
      label="Phone Number"
      required
    />
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Password *
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
          placeholder="Create a password"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <EyeIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  </div>
);

export default SalonRegistrationPersonalInfo;