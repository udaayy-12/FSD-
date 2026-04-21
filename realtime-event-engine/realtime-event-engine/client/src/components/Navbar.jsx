/**
 * Navbar Component
 * Top navigation with live status, user info, and logout
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ user, userCount, onCreateClick }) => {
  const { logout } = useAuth();

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-mono text-sm font-semibold text-white tracking-wide hidden sm:block">
            EventSync
          </span>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700/50 rounded-full px-3 py-1.5">
          <span className="live-dot" />
          <span className="text-xs text-gray-400 font-mono">
            {userCount} {userCount === 1 ? 'user' : 'users'} live
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateClick}
            className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Event</span>
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold text-xs">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-gray-300 hidden md:block">{user?.username}</span>
          </div>

          <button
            onClick={logout}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-gray-800"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
