'use client';

import { useState } from 'react';
import { MessageCircle, Search, Phone, Video, ArrowLeft, Send, Smile, Image as ImageIcon, MoreHorizontal } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  {
    id: 'c1', name: 'Selena Martinez', handle: 'selena_creates', avatar: '47',
    lastMsg: 'Thanks for the collab! 🔥', time: '2m', unread: 2, isOnline: true,
  },
  {
    id: 'c2', name: 'Kevin Osei', handle: 'codewithkev', avatar: '12',
    lastMsg: 'Check out this new algorithm...', time: '15m', unread: 0, isOnline: true,
  },
  {
    id: 'c3', name: 'Jake Thornton', handle: 'jakethephoto', avatar: '8',
    lastMsg: 'Beautiful shot man! What lens?', time: '1h', unread: 1, isOnline: false,
  },
  {
    id: 'c4', name: 'Nadia Wright', handle: 'nadia.eats', avatar: '23',
    lastMsg: 'The recipe is in my latest post 🍝', time: '3h', unread: 0, isOnline: false,
  },
  {
    id: 'c5', name: 'Marcus Reid', handle: 'marcus.fit', avatar: '11',
    lastMsg: 'Day 47 done 💪', time: '5h', unread: 0, isOnline: true,
  },
  {
    id: 'c6', name: 'Amara Diallo', handle: 'amara.glow', avatar: '45',
    lastMsg: 'Loved your skincare routine!', time: '1d', unread: 0, isOnline: false,
  },
];

const MOCK_MESSAGES: Record<string, { id: string; from: 'me' | 'other'; text: string; time: string }[]> = {
  c1: [
    { id: 'm1', from: 'other', text: 'Hey! I loved your latest post ✨', time: '10:32 AM' },
    { id: 'm2', from: 'me',    text: 'Thanks so much! Really appreciate it 😊', time: '10:33 AM' },
    { id: 'm3', from: 'other', text: 'Would you be up for a collab next month?', time: '10:35 AM' },
    { id: 'm4', from: 'me',    text: 'Absolutely! Let\'s talk details 🙌', time: '10:36 AM' },
    { id: 'm5', from: 'other', text: 'Thanks for the collab! 🔥', time: '10:40 AM' },
  ],
};

export default function MessagesPage() {
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping] = useState(false);

  const convo = MOCK_CONVERSATIONS.find(c => c.id === selectedConvo);
  const messages = selectedConvo ? MOCK_MESSAGES[selectedConvo] ?? [] : [];

  return (
    <div className="flex h-screen" style={{ background: 'var(--background)' }}>

      {/* Conversation List */}
      <div
        className={`flex flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] shrink-0`}
        style={{ borderRight: '1px solid var(--divider)' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Messages</h1>
            <button className="p-2 rounded-full transition-colors" style={{ color: 'var(--primary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,126,164,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <MessageCircle size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full h-9 pl-9 pr-4 rounded-full text-[14px] outline-none transition-all"
              style={{ background: 'var(--divider)', color: 'var(--text)' }}
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {MOCK_CONVERSATIONS.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedConvo(c.id)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{
                borderBottom: '1px solid var(--divider)',
                background: selectedConvo === c.id ? 'rgba(10,126,164,0.06)' : '',
              }}
              onMouseEnter={e => { if (selectedConvo !== c.id) e.currentTarget.style.background = 'var(--divider)'; }}
              onMouseLeave={e => { if (selectedConvo !== c.id) e.currentTarget.style.background = ''; }}
            >
              {/* Avatar + online indicator */}
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/40?img=${c.avatar}`} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
                {c.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: 'var(--apple-green)' }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-bold truncate" style={{ color: 'var(--text)', fontWeight: c.unread > 0 ? 700 : 500 }}>{c.name}</p>
                  <span className="text-[12px] shrink-0 ml-2" style={{ color: c.unread > 0 ? 'var(--primary)' : 'var(--text-secondary)' }}>{c.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[13px] truncate" style={{ color: c.unread > 0 ? 'var(--text)' : 'var(--text-secondary)', fontWeight: c.unread > 0 ? 600 : 400 }}>{c.lastMsg}</p>
                  {c.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white ml-2" style={{ background: 'var(--primary)' }}>
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      {selectedConvo && convo ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Chat Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ borderBottom: '1px solid var(--divider)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
          >
            <button onClick={() => setSelectedConvo(null)} className="md:hidden p-1 rounded-full" style={{ color: 'var(--primary)' }}>
              <ArrowLeft size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.pravatar.cc/40?img=${convo.avatar}`} alt={convo.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px]" style={{ color: 'var(--text)' }}>{convo.name}</p>
              <p className="text-[12px]" style={{ color: convo.isOnline ? 'var(--apple-green)' : 'var(--text-secondary)' }}>
                {convo.isOnline ? '● Online' : 'Offline'}
              </p>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-full transition-colors" style={{ color: 'var(--primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,126,164,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <Phone size={18} />
              </button>
              <button className="p-2 rounded-full transition-colors" style={{ color: 'var(--primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,126,164,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <Video size={18} />
              </button>
              <button className="p-2 rounded-full transition-colors" style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--divider)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[70%]">
                  <div
                    className="px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed"
                    style={m.from === 'me'
                      ? { background: 'var(--gradient-primary)', color: 'white', borderBottomRightRadius: '6px' }
                      : { background: 'var(--divider)', color: 'var(--text)', borderBottomLeftRadius: '6px' }
                    }
                  >
                    {m.text}
                  </div>
                  <p className={`text-[11px] mt-1 ${m.from === 'me' ? 'text-right' : 'text-left'}`} style={{ color: 'var(--text-secondary)' }}>{m.time}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2.5 rounded-2xl text-[14px]" style={{ background: 'var(--divider)', color: 'var(--text-secondary)', borderBottomLeftRadius: '6px' }}>
                  <span className="animate-pulse">●●● is typing</span>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="px-4 py-3 shrink-0 flex items-center gap-2" style={{ borderTop: '1px solid var(--divider)' }}>
            <button className="p-2 rounded-full" style={{ color: 'var(--primary)' }}>
              <ImageIcon size={20} />
            </button>
            <div className="flex-1 flex items-center rounded-full px-4 min-h-[44px]" style={{ background: 'var(--divider)' }}>
              <input
                type="text"
                placeholder="Send a message..."
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[14px]"
                style={{ color: 'var(--text)' }}
              />
              <button className="ml-2" style={{ color: 'var(--text-secondary)' }}>
                <Smile size={18} />
              </button>
            </div>
            <button
              className="p-2.5 rounded-full text-white transition-all active:scale-95"
              style={{ background: inputMsg.trim() ? 'var(--gradient-primary)' : 'var(--border)' }}
              disabled={!inputMsg.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--divider)' }}>
            <MessageCircle size={36} style={{ color: 'var(--primary)' }} />
          </div>
          <p className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>Your Messages</p>
          <p className="text-[14px] mt-1">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}
