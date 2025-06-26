import React from 'react';
import { Clock, Package, CheckCircle, Truck } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  order: Order;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const getStatusIcon = (status: Order['status'], isActive: boolean) => {
    const iconClass = `h-6 w-6 ${isActive ? 'text-green-600' : 'text-gray-400'}`;
    
    switch (status) {
      case 'pending':
        return <Clock className={iconClass} />;
      case 'preparing':
        return <Package className={iconClass} />;
      case 'ready':
        return <Truck className={iconClass} />;
      case 'completed':
        return <CheckCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'preparing':
        return 'Preparing Order';
      case 'ready':
        return 'Ready for Pickup';
      case 'completed':
        return 'Order Completed';
      default:
        return 'Unknown Status';
    }
  };

  const statuses: Order['status'][] = ['pending', 'preparing', 'ready', 'completed'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Order Status - {order.id}
      </h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        <div 
          className="absolute left-6 top-8 w-0.5 bg-green-600 transition-all duration-500"
          style={{ height: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
        ></div>

        {/* Status Steps */}
        <div className="space-y-6">
          {statuses.map((status, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={status} className="relative flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                  isActive 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-600' 
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}>
                  {getStatusIcon(status, isActive)}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className={`font-medium ${
                    isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {getStatusText(status)}
                  </h4>
                  {isCurrent && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Current Status
                    </p>
                  )}
                  {status === 'ready' && isActive && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pickup by {order.pickupTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                {isCurrent && (
                  <div className="ml-4">
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            {order.status === 'ready' 
              ? 'Ready for pickup!' 
              : `Estimated pickup time: ${order.pickupTime.toLocaleTimeString()}`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;