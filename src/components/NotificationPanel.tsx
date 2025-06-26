import React from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  const { user } = useAuth();

  if (!isOpen) return null;

  const userNotifications = notifications.filter(n => n.userId === user?.id || n.userId === 'admin');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    const opacity = read ? 'bg-opacity-50' : 'bg-opacity-100';
    switch (type) {
      case 'success':
        return `bg-green-50 dark:bg-green-900/20 ${opacity}`;
      case 'warning':
        return `bg-yellow-50 dark:bg-yellow-900/20 ${opacity}`;
      case 'error':
        return `bg-red-50 dark:bg-red-900/20 ${opacity}`;
      default:
        return `bg-blue-50 dark:bg-blue-900/20 ${opacity}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:w-96">
      <div className="absolute inset-0 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl lg:relative lg:h-auto lg:max-h-96 lg:rounded-lg lg:border border-gray-200 dark:border-gray-700 lg:mt-2">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {userNotifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">
                {userNotifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {userNotifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-80">
          {userNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    getBgColor(notification.type, notification.read)
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="ml-2 p-1 hover:bg-white dark:hover:bg-gray-600 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;