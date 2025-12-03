import React from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl z-50 animate-slide-in flex items-center space-x-3 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    <span> {message} </span>
    <button onClick={onClose} className="text-white hover:text-gray-200">
      <X size={16} />
    </button>
  </div>
);

export default Toast;
