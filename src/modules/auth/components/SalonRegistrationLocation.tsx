import React from 'react';
import { SalonFormData } from '../pages/SalonRegistrationPage';

const rwandaProvinces = [
  {
    name: 'Kigali City',
    cities: ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge']
  },
  {
    name: 'Eastern Province',
    cities: ['Rwamagana', 'Kayonza', 'Ngoma', 'Kirehe', 'Gatsibo', 'Nyagatare', 'Bugesera']
  },
  {
    name: 'Northern Province',
    cities: ['Musanze', 'Burera', 'Gicumbi', 'Rulindo', 'Gakenke']
  },
  {
    name: 'Western Province',
    cities: ['Rubavu', 'Rutsiro', 'Nyabihu', 'Ngororero', 'Karongi']
  },
  {
    name: 'Southern Province',
    cities: ['Huye', 'Muhanga', 'Kamonyi', 'Karongi', 'Ruhango', 'Nyanza', 'Gisagara', 'Nyaruguru']
  }
];

interface LocationProps {
  formData: SalonFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const SalonRegistrationLocation: React.FC<LocationProps> = ({
  formData,
  handleInputChange,
}) => {
  const selectedProvince = rwandaProvinces.find(p => p.name === formData.province);
  const availableCities = selectedProvince ? selectedProvince.cities : [];

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Province *
        </label>
        <select
          name="province"
          value={formData.province}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
        >
          <option value="">Select a province</option>
          {rwandaProvinces.map((province) => (
            <option key={province.name} value={province.name}>{province.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          City *
        </label>
        <select
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
          disabled={!formData.province}
        >
          <option value="">Select a city</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Country *
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
          placeholder="Country"
          readOnly
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Website
        </label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
          placeholder="Website (optional)"
        />
      </div>
    </div>
  );
};

export default SalonRegistrationLocation;