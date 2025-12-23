import React from 'react';
import { SalonFormData } from '../pages/SalonRegistrationPage';

interface ServicesProps {
  formData: SalonFormData;
  serviceCategories: string[];
  handleServiceChange: (index: number, field: string, value: string | number) => void;
  addService: () => void;
  removeService: (index: number) => void;
}

const SalonRegistrationServices: React.FC<ServicesProps> = ({
  formData,
  serviceCategories,
  handleServiceChange,
  removeService,
}) => (
  <div className="space-y-4">
    {formData.services.map((service, idx) => (
      <div key={idx} className="border p-4 rounded-lg bg-gray-50 dark:bg-dark-bg relative">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-800 dark:text-dark-text">Service {idx + 1}</h4>
          {formData.services.length > 1 && (
            <button
              type="button"
              onClick={() => removeService(idx)}
              className="text-red-500 hover:underline text-xs"
            >
              Remove
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              value={service.name}
              onChange={e => handleServiceChange(idx, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
              placeholder="Service name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
            <select
              value={service.category}
              onChange={e => handleServiceChange(idx, 'category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
            >
              {serviceCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
            <input
              type="number"
              value={service.price}
              onChange={e => handleServiceChange(idx, 'price', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
              placeholder="Price"
              min={0}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (hours) *</label>
            <input
              type="number"
              value={service.duration}
              onChange={e => handleServiceChange(idx, 'duration', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
              placeholder="Duration in hours"
              min={0.5}
              step={0.5}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Currency *</label>
            <input
              type="text"
              value={service.currency}
              onChange={e => handleServiceChange(idx, 'currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
              placeholder="Currency (e.g. RWF)"
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
          <textarea
            value={service.description}
            onChange={e => handleServiceChange(idx, 'description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base"
            placeholder="Service description"
            rows={2}
          />
        </div>
      </div>
    ))}

  </div>
);

export default SalonRegistrationServices;