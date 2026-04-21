/**
 * DashboardPage
 * Main authenticated view: live event list, create form, stats
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useEvents from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import StatsBar from '../components/StatsBar';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const { user } = useAuth();
  const { events, loading, error, userCount, createEvent, updateEvent, deleteEvent } = useEvents();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');

  // Filter events by type
  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  const filterOptions = ['all', 'notification', 'message', 'update', 'alert', 'system'];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar user={user} userCount={userCount} onCreateClick={() => setShowCreate(true)} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <StatsBar events={events} userCount={userCount} />

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mt-6 mb-4 overflow-x-auto pb-1">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && (
                <span className="ml-1.5 text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">
                  {events.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Event list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="w-8 h-8 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 text-sm">Loading events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No events yet</p>
            <p className="text-gray-600 text-sm">Create the first event to get started</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-2">
              Create Event
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                currentUser={user}
                onUpdate={updateEvent}
                onDelete={deleteEvent}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create event modal */}
      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onCreate={createEvent}
        />
      )}
    </div>
  );
};

export default DashboardPage;
