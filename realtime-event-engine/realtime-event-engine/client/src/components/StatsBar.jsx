/**
 * StatsBar Component
 * Shows summary stats: total events, by type, connected users
 */

import React from 'react';

const StatCard = ({ label, value, color }) => (
  <div className="card flex-1 min-w-[120px]">
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className={`text-xs font-medium mt-0.5 ${color}`}>{label}</p>
  </div>
);

const StatsBar = ({ events, userCount }) => {
  const active = events.filter((e) => e.status === 'active').length;
  const critical = events.filter((e) => e.priority === 'critical').length;
  const alerts = events.filter((e) => e.type === 'alert').length;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <StatCard label="Total Events" value={events.length} color="text-gray-400" />
      <StatCard label="Active" value={active} color="text-green-400" />
      <StatCard label="Critical" value={critical} color="text-red-400" />
      <StatCard label="Alerts" value={alerts} color="text-amber-400" />
      <StatCard label="Live Users" value={userCount} color="text-cyan-400" />
    </div>
  );
};

export default StatsBar;
