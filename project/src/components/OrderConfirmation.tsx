import React from 'react';
import { CheckCircle, Clock, X } from 'lucide-react';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
          
          <p className="text-gray-600 mb-6">
            Your order has been placed. You can collect it in 30 minutes.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Estimated pickup time: 30 minutes</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Continue Shopping
            </button>
            
            <p className="text-sm text-gray-500">
              You'll receive a notification when your order is ready for pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;