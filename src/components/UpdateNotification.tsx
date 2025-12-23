import { useState, useEffect } from 'react';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UpdateNotificationProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateNotification({ onUpdate, onDismiss }: UpdateNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleUpdate = () => {
    onUpdate();
    setShow(false);
  };

  const handleDismiss = () => {
    onDismiss();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ArrowPathIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              App Update Available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              A new version is available with the latest features and improvements.
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleUpdate}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Now
              </button>
              <button
                onClick={handleDismiss}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Later
              </button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}