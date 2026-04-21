/**
 * useEvents Hook
 * Manages event state, API calls, and Socket.IO real-time sync
 */

import { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import socket from '../utils/socket';
import { useNotifications } from '../context/NotificationContext';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const { addNotification } = useNotifications();

  // Fetch all events from REST API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/events');
      setEvents(data.events);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new event
  const createEvent = useCallback(async (eventData) => {
    try {
      const { data } = await API.post('/events', eventData);
      // Socket.IO will broadcast and update the list automatically
      return { success: true, event: data.event };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create event';
      return { success: false, message: msg };
    }
  }, []);

  // Update an event
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      const { data } = await API.put(`/events/${id}`, eventData);
      return { success: true, event: data.event };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update event';
      return { success: false, message: msg };
    }
  }, []);

  // Delete an event
  const deleteEvent = useCallback(async (id) => {
    try {
      await API.delete(`/events/${id}`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete event';
      return { success: false, message: msg };
    }
  }, []);

  // Set up Socket.IO listeners for real-time updates
  useEffect(() => {
    fetchEvents();

    // New event created by any user
    socket.on('eventCreated', (newEvent) => {
      setEvents((prev) => [newEvent, ...prev]);
    });

    // Event updated by any user
    socket.on('eventUpdated', (updatedEvent) => {
      setEvents((prev) =>
        prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
      );
    });

    // Event deleted by any user
    socket.on('eventDeleted', ({ _id }) => {
      setEvents((prev) => prev.filter((e) => e._id !== _id));
    });

    // Real-time notification from server
    socket.on('notification', ({ type, message }) => {
      addNotification(type, message);
    });

    // Connected user count
    socket.on('userCount', (count) => {
      setUserCount(count);
    });

    return () => {
      socket.off('eventCreated');
      socket.off('eventUpdated');
      socket.off('eventDeleted');
      socket.off('notification');
      socket.off('userCount');
    };
  }, [fetchEvents, addNotification]);

  return {
    events,
    loading,
    error,
    userCount,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

export default useEvents;
