/**
 * Events Controller
 * Full CRUD for events + Socket.IO broadcasting
 */

const Event = require('../models/Event');

// GET /api/events - Fetch all events (newest first)
const getEvents = async (req, res) => {
  try {
    const { type, status, priority, limit = 50 } = req.query;

    // Build dynamic filter
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const events = await Event.find(filter)
      .populate('createdBy', 'username email') // Include creator info
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ events, total: events.length });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// POST /api/events - Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, type, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Event title is required' });
    }

    const event = await Event.create({
      title,
      description,
      type: type || 'notification',
      priority: priority || 'medium',
      createdBy: req.user._id,
    });

    // Populate creator info before broadcasting
    await event.populate('createdBy', 'username email');

    // 🔴 Emit real-time event to ALL connected clients
    req.io.emit('eventCreated', event);

    // Also emit a notification
    req.io.emit('notification', {
      type: 'success',
      message: `New event created: "${event.title}" by ${req.user.username}`,
      eventId: event._id,
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// PUT /api/events/:id - Update an event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, priority, status } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only creator or admin can update
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Apply updates
    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (type) event.type = type;
    if (priority) event.priority = priority;
    if (status) event.status = status;

    await event.save();
    await event.populate('createdBy', 'username email');

    // 🔴 Broadcast update to all clients
    req.io.emit('eventUpdated', event);

    req.io.emit('notification', {
      type: 'info',
      message: `Event updated: "${event.title}"`,
      eventId: event._id,
    });

    res.json({ message: 'Event updated', event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

// DELETE /api/events/:id - Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only creator or admin can delete
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    const eventTitle = event.title;
    await event.deleteOne();

    // 🔴 Broadcast deletion to all clients
    req.io.emit('eventDeleted', { _id: id });

    req.io.emit('notification', {
      type: 'warning',
      message: `Event deleted: "${eventTitle}"`,
      eventId: id,
    });

    res.json({ message: 'Event deleted', id });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

// GET /api/events/:id - Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'username email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent, getEventById };
