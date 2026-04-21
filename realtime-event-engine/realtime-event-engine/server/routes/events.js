/**
 * Event Routes
 * GET    /api/events
 * POST   /api/events
 * GET    /api/events/:id
 * PUT    /api/events/:id
 * DELETE /api/events/:id
 */

const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// All event routes require authentication
router.use(protect);

router.get('/', getEvents);
router.post('/', createEvent);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
