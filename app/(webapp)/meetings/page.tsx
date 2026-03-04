'use client';

import { Video, Link, Users, Clock, Plus } from 'lucide-react';
import { useState } from 'react';

export default function MeetingsPage() {
  const [meetingId, setMeetingId] = useState('');

  const UPCOMING = [
    { id: 'm1', title: 'Creator Collab — Season Recap',   host: 'Selena Martinez', time: 'Today, 3:00 PM', participants: 12, avatar: '47' },
    { id: 'm2', title: 'Tech Talk: AI in Social Media',   host: 'Kevin Osei',      time: 'Tomorrow, 6:00 PM', participants: 34, avatar: '12' },
    { id: 'm3', title: 'Fitness Challenge Kickoff',       host: 'Marcus Reid',     time: 'Jun 20, 8:00 AM', participants: 89, avatar: '11' },
  ];

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#4CAF50,#0a7ea4)' }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="flex items-center gap-3 relative z-10">
          <Video className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-[20px] font-bold text-white" style={{ fontSize: '20px' }}>Meetings</h1>
            <p className="text-white/80 text-[12px]">Video calls & live sessions</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="py-4 rounded-2xl font-bold text-white text-[14px] flex flex-col items-center gap-2 transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg,#4CAF50,#0a7ea4)' }}>
            <Plus className="w-6 h-6" />
            New Meeting
          </button>
          <button className="py-4 rounded-2xl font-bold text-[14px] flex flex-col items-center gap-2 transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
            <Link className="w-6 h-6" style={{ color: '#4CAF50' }} />
            Join by Link
          </button>
        </div>

        {/* Join by ID */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-[14px] font-bold mb-3" style={{ color: 'var(--text)' }}>Join meeting by ID</p>
          <div className="flex gap-2">
            <input
              value={meetingId}
              onChange={e => setMeetingId(e.target.value)}
              placeholder="Enter meeting ID..."
              className="flex-1 h-11 px-4 rounded-full text-[14px] outline-none"
              style={{ background: 'var(--divider)', color: 'var(--text)' }}
            />
            <button
              className="px-5 h-11 rounded-full font-bold text-white text-[14px] transition-all"
              style={{ background: meetingId.trim() ? 'linear-gradient(135deg,#4CAF50,#0a7ea4)' : 'var(--border)' }}
              disabled={!meetingId.trim()}
            >
              Join
            </button>
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <h2 className="text-[16px] font-bold mb-3" style={{ color: 'var(--text)', fontSize: '16px' }}>Upcoming Meetings</h2>
          <div className="space-y-3">
            {UPCOMING.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/44?img=${m.avatar}`} alt={m.host} className="w-11 h-11 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] truncate" style={{ color: 'var(--text)' }}>{m.title}</p>
                  <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>Hosted by {m.host}</p>
                  <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.time}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.participants} joining</span>
                  </div>
                </div>
                <button className="shrink-0 px-4 py-2 rounded-full text-[12px] font-bold text-white" style={{ background: '#4CAF50' }}>
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
