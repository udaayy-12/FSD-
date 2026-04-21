/**
 * NotificationToasts Component
 * Renders real-time toast notifications in the corner of the screen
 */

import React from 'react';
import { useNotifications } from '../context/NotificationContext';

const TOAST_STYLES = {
  success: {
    bg: 'bg-green-500/10 border-green-500/30',
    text: 'text-green-400',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-400',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    text: 'text-red-400',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const NotificationToasts = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((notif) => {
        const style = TOAST_STYLES[notif.type] || TOAST_STYLES.info;
        return (
          <div
            key={notif.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg animate-slide-in ${style.bg}`}
          >
            <span className={style.text}>{style.icon}</span>
            <p className={`text-sm flex-1 ${style.text}`}>{notif.message}</p>
            <button
              onClick={() => removeNotification(notif.id)}
              className={`${style.text} opacity-60 hover:opacity-100 transition-opacity shrink-0`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToasts;
