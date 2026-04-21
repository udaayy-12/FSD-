/**
 * EventCard Component
 * Displays a single event with inline edit/delete controls
 */

import React, { useState } from 'react';

// Color maps for type and priority badges
const TYPE_COLORS = {
  notification: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  message: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  update: 'bg-green-500/10 text-green-400 border-green-500/20',
  alert: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  system: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const TYPE_ICONS = {
  notification: '🔔',
  message: '💬',
  update: '🔄',
  alert: '⚠️',
  system: '⚙️',
};

const PRIORITY_COLORS = {
  low: 'bg-gray-500/10 text-gray-400',
  medium: 'bg-blue-500/10 text-blue-400',
  high: 'bg-orange-500/10 text-orange-400',
  critical: 'bg-red-500/10 text-red-400',
};

const STATUS_COLORS = {
  active: 'text-green-400',
  resolved: 'text-gray-500',
  archived: 'text-gray-600',
};

const EventCard = ({ event, currentUser, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: event.title,
    description: event.description,
    priority: event.priority,
    status: event.status,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const isOwner = currentUser?._id === event.createdBy?._id;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const result = await onUpdate(event._id, editForm);
    if (!result.success) setError(result.message);
    else setEditing(false);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    setDeleting(true);
    await onDelete(event._id);
    setDeleting(false);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className={`card border-gray-700/50 animate-fade-in transition-all duration-200 ${deleting ? 'opacity-50' : ''}`}>
      {editing ? (
        /* Edit Mode */
        <div className="space-y-3">
          <input
            className="input-field text-sm"
            value={editForm.title}
            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Event title"
          />
          <textarea
            className="input-field text-sm resize-none"
            rows={2}
            value={editForm.description}
            onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <select
              className="input-field text-sm"
              value={editForm.priority}
              onChange={(e) => setEditForm((p) => ({ ...p, priority: e.target.value }))}
            >
              {['low', 'medium', 'high', 'critical'].map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            <select
              className="input-field text-sm"
              value={editForm.status}
              onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
            >
              {['active', 'resolved', 'archived'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-1.5">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-1.5">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div className="text-xl leading-none mt-0.5 shrink-0">{TYPE_ICONS[event.type]}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className={`font-semibold text-sm truncate ${STATUS_COLORS[event.status] === 'text-gray-600' ? 'line-through text-gray-600' : 'text-white'}`}>
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{event.description}</p>
                )}
              </div>

              {/* Actions (only owner) */}
              {isOwner && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`badge-notification border ${TYPE_COLORS[event.type]}`}>
                {event.type}
              </span>
              <span className={`badge-notification ${PRIORITY_COLORS[event.priority]}`}>
                {event.priority}
              </span>
              <span className={`text-xs font-medium ${STATUS_COLORS[event.status]}`}>
                ● {event.status}
              </span>
              <span className="text-gray-600 text-xs ml-auto">
                {event.createdBy?.username} · {timeAgo(event.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
