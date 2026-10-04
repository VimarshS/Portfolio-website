import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCheck,
  Clock,
  MessageCircle,
  Search,
  Send,
  Wifi,
  WifiOff,
} from 'lucide-react';

type Status = 'sending' | 'delivered' | 'failed';

interface Contact {
  id: string;
  name: string;
  online: boolean; // starting presence
  tone: string; // avatar colours
}

interface ChatMessage {
  id: number;
  mine: boolean;
  text: string;
  time: string;
  status?: Status;
}

// All people in this demo are made up
const CONTACTS: Contact[] = [
  { id: 'aarav', name: 'Aarav Mehta', online: true, tone: 'bg-violet-500/25 text-violet-200' },
  { id: 'priya', name: 'Priya Nair', online: true, tone: 'bg-fuchsia-500/25 text-fuchsia-200' },
  { id: 'rohan', name: 'Rohan Gupta', online: false, tone: 'bg-sky-500/25 text-sky-200' },
  { id: 'sneha', name: 'Sneha Rao', online: false, tone: 'bg-emerald-500/25 text-emerald-200' },
  { id: 'kabir', name: 'Kabir Sethi', online: true, tone: 'bg-amber-500/25 text-amber-200' },
];

const SEED: Record<string, ChatMessage[]> = {
  aarav: [
    { id: 1, mine: false, text: 'Did the WebSocket connection come back up?', time: '10:42' },
    { id: 2, mine: true, text: 'Yes! Messages are saved to MongoDB as they go out.', time: '10:43', status: 'delivered' },
    { id: 3, mine: false, text: 'Nice, image uploads through Cloudinary feel instant too.', time: '10:44' },
  ],
  priya: [{ id: 4, mine: false, text: 'Standup in five minutes?', time: '09:15' }],
  rohan: [],
  sneha: [],
  kabir: [],
};

// Canned answers, used one after another
const REPLIES: Record<string, string[]> = {
  aarav: ['Got it, merging the PR now.', 'Sounds good! I will test it on my side.', 'Ship it.'],
  priya: ['Perfect, see you there.', 'Let me check and get back to you.', 'Thanks for the update!'],
  sneha: ['Hey! Just saw this.', 'Give me a minute.', 'Sounds good to me.'],
  kabir: ['On it.', 'Can we sync after lunch?', 'Looks great to me.'],
};

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const Avatar: React.FC<{
  contact: Contact;
  online: boolean;
  size?: 'sm' | 'md';
  showPresence?: boolean;
}> = ({ contact, online, size = 'md', showPresence = true }) => {
  const initials = contact.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="relative shrink-0">
      <div
        className={`${
          size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'
        } rounded-full flex items-center justify-center font-semibold ${contact.tone}`}
      >
        {initials}
      </div>
      {showPresence && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0b0b10] transition-colors ${
            online ? 'bg-emerald-400' : 'bg-neutral-600'
          }`}
        />
      )}
    </div>
  );
};

const initialPresence = (): Record<string, boolean> =>
  Object.fromEntries(CONTACTS.map((c) => [c.id, c.online]));

const ChatDemo: React.FC = () => {
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(SEED);
  const [activeId, setActiveId] = useState('aarav');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  // On narrow cards only one pane fits: the chat list or the open chat
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const [unread, setUnread] = useState<Record<string, number>>({ priya: 1 });
  const [typingId, setTypingId] = useState<string | null>(null);
  const [networkOn, setNetworkOn] = useState(true);
  const [presence, setPresence] = useState<Record<string, boolean>>(initialPresence);

  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const nextId = useRef(100);
  const replyCount = useRef<Record<string, number>>({});
  const replyPending = useRef<Set<string>>(new Set());

  // Timers run later, so they read the newest values from refs
  const networkRef = useRef(true);
  const presenceRef = useRef<Record<string, boolean>>(initialPresence());
  const viewingRef = useRef<string | null>('aarav');

  const active = CONTACTS.find((c) => c.id === activeId) ?? CONTACTS[0];
  const activeOnline = presence[active.id];
  const messages = conversations[activeId] ?? [];
  const visibleContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const firstName = active.name.split(' ')[0];

  // Which chat is on screen right now (used to decide if a reply is "unread")
  useEffect(() => {
    viewingRef.current = mobileView === 'chat' ? activeId : null;
  }, [activeId, mobileView]);

  // Scroll only the message box, never the whole page
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, activeId, mobileView, typingId]);

  // Presence changes by itself every few seconds, like users coming and going
  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = { ...presenceRef.current, sneha: !presenceRef.current.sneha };
      presenceRef.current = next;
      setPresence(next);
    }, 9000);
    return () => window.clearInterval(interval);
  }, []);

  // Stop pending timers when the demo is closed or reset
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const later = (ms: number, fn: () => void) => {
    const timer = window.setTimeout(fn, ms);
    timers.current.push(timer);
  };

  const openChat = (id: string) => {
    setActiveId(id);
    setMobileView('chat');
    setUnread((prev) => ({ ...prev, [id]: 0 }));
  };

  const toggleNetwork = () => {
    const next = !networkOn;
    networkRef.current = next;
    setNetworkOn(next);
  };

  const setStatus = (contactId: string, id: number, status: Status) => {
    setConversations((prev) => ({
      ...prev,
      [contactId]: (prev[contactId] ?? []).map((m) => (m.id === id ? { ...m, status } : m)),
    }));
  };

  const addIncoming = (contactId: string, text: string) => {
    const message: ChatMessage = { id: nextId.current++, mine: false, text, time: nowTime() };
    setConversations((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] ?? []), message],
    }));
    if (viewingRef.current !== contactId) {
      setUnread((prev) => ({ ...prev, [contactId]: (prev[contactId] ?? 0) + 1 }));
    }
  };

  // An online person starts typing, then answers
  const scheduleReply = (contactId: string) => {
    const pool = REPLIES[contactId];
    if (!pool || !presenceRef.current[contactId]) return;
    if (replyPending.current.has(contactId)) return;
    replyPending.current.add(contactId);

    later(600, () => setTypingId(contactId));
    later(2300, () => {
      const count = replyCount.current[contactId] ?? 0;
      replyCount.current[contactId] = count + 1;
      setTypingId((current) => (current === contactId ? null : current));
      addIncoming(contactId, pool[count % pool.length]);
      replyPending.current.delete(contactId);
    });
  };

  // The "server" answers: delivered if the network works, failed if it does not
  const deliver = (contactId: string, id: number) => {
    const delay = networkRef.current ? 700 : 1500;
    later(delay, () => {
      if (networkRef.current) {
        setStatus(contactId, id, 'delivered');
        scheduleReply(contactId);
      } else {
        setStatus(contactId, id, 'failed');
      }
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const id = nextId.current++;
    const message: ChatMessage = { id, mine: true, text, time: nowTime(), status: 'sending' };

    // Optimistic UI: the bubble appears at once, before the "server" answers
    setConversations((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), message],
    }));
    setDraft('');
    deliver(activeId, id);
  };

  const handleRetry = (id: number) => {
    setStatus(activeId, id, 'sending');
    deliver(activeId, id);
  };

  const lastIsMine = messages.length > 0 && messages[messages.length - 1].mine;

  return (
    <div className="@container">
      <div className="flex h-[340px] rounded-xl overflow-hidden border border-neutral-800 bg-[#0b0b10]">
        {/* Sidebar: brand, search, people */}
        <aside
          className={`${
            mobileView === 'list' ? 'flex' : 'hidden'
          } @lg:flex w-full @lg:w-[40%] shrink-0 flex-col border-r border-neutral-800/80 bg-gradient-to-b from-[#14112a] to-[#0b0b10]`}
        >
          <div className="flex items-center gap-2 px-3 pt-3 pb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Vibe</span>
          </div>

          <div className="px-3 pb-2">
            <label className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 focus-within:border-violet-400/60 transition-colors">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user..."
                aria-label="Search users"
                className="w-full min-w-0 bg-transparent text-base sm:text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
              />
            </label>
          </div>

          <ul className="flex-1 overflow-y-auto px-1.5 pb-2 space-y-0.5">
            {visibleContacts.map((c) => {
              const online = presence[c.id];
              const count = unread[c.id] ?? 0;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => openChat(c.id)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors ${
                      c.id === activeId ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <Avatar contact={c} online={online} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-neutral-100">
                        {c.name}
                      </span>
                      <span
                        className={`block text-[11px] ${
                          typingId === c.id
                            ? 'text-violet-300'
                            : online
                            ? 'text-emerald-400'
                            : 'text-neutral-500'
                        }`}
                      >
                        {typingId === c.id ? 'typing...' : online ? 'Online' : 'Offline'}
                      </span>
                    </span>
                    {count > 0 && (
                      <span
                        className="min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-white text-[10px] font-semibold flex items-center justify-center"
                        aria-label={`${count} unread`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            {visibleContacts.length === 0 && (
              <li className="px-3 py-6 text-center text-xs text-neutral-500">No users found</li>
            )}
          </ul>
        </aside>

        {/* Chat pane */}
        <section
          className={`${
            mobileView === 'chat' ? 'flex' : 'hidden'
          } @lg:flex min-w-0 flex-1 flex-col`}
        >
          <header className="flex items-center gap-2.5 px-3 py-2.5 border-b border-neutral-800/80">
            <button
              type="button"
              onClick={() => setMobileView('list')}
              aria-label="Back to chats"
              className="@lg:hidden p-1 -ml-1 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Avatar contact={active} online={activeOnline} />
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-white">{active.name}</div>
              <div
                className={`text-[11px] ${
                  typingId === active.id
                    ? 'text-violet-300'
                    : activeOnline
                    ? 'text-emerald-400'
                    : 'text-neutral-500'
                }`}
              >
                {typingId === active.id ? 'typing...' : activeOnline ? 'Online' : 'Offline'}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleNetwork}
              aria-pressed={!networkOn}
              title="Simulate a network failure"
              className={`ml-auto shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                networkOn
                  ? 'border-neutral-700 text-neutral-300 hover:border-neutral-600'
                  : 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              }`}
            >
              {networkOn ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="hidden @md:inline">{networkOn ? 'Network on' : 'Network off'}</span>
            </button>
          </header>

          {!networkOn && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300">
              <WifiOff className="w-3 h-3 shrink-0" />
              <span>Connection lost. New messages will fail until you switch it back on.</span>
            </div>
          )}

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
          >
            {messages.length === 0 && (
              <p className="pt-10 text-center text-xs text-neutral-500">
                No messages yet. Say hi to {firstName}!
              </p>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex items-end gap-2 ${m.mine ? 'flex-row-reverse' : ''}`}>
                {!m.mine && (
                  <Avatar contact={active} online={activeOnline} size="sm" showPresence={false} />
                )}
                <div className={`max-w-[75%] flex flex-col ${m.mine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-xs leading-relaxed wrap-break-word ${
                      m.mine
                        ? m.status === 'failed'
                          ? 'rounded-br-sm bg-rose-500/15 border border-rose-500/40 text-rose-100'
                          : 'rounded-br-sm bg-gradient-to-br from-purple-500 to-violet-600 text-white'
                        : 'rounded-bl-sm bg-white/10 border border-white/10 text-neutral-100'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-neutral-500">
                    <span>{m.time}</span>
                    {m.mine && m.status === 'sending' && (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Sending...</span>
                      </>
                    )}
                    {m.mine && m.status === 'delivered' && (
                      <CheckCheck className="w-3 h-3 text-violet-400" aria-label="Delivered" />
                    )}
                    {m.mine && m.status === 'failed' && (
                      <>
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        <span className="text-rose-300">Not sent</span>
                        <button
                          type="button"
                          onClick={() => handleRetry(m.id)}
                          className="text-violet-300 underline underline-offset-2 hover:text-violet-200"
                        >
                          Retry
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typingId === active.id && (
              <div className="flex items-end gap-2">
                <Avatar contact={active} online={activeOnline} size="sm" showPresence={false} />
                <div
                  className="px-3 py-2.5 rounded-2xl rounded-bl-sm bg-white/10 border border-white/10 flex items-center gap-1"
                  aria-label={`${firstName} is typing`}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-neutral-400 motion-safe:animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!activeOnline && lastIsMine && (
              <p className="text-center text-[11px] text-neutral-500">
                {firstName} is offline. They will see your message when they are back.
              </p>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 py-2.5 border-t border-neutral-800/80"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={200}
              placeholder="Send a message"
              aria-label="Message"
              className="flex-1 min-w-0 rounded-full bg-white/5 border border-white/10 px-3.5 py-2 text-base sm:text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-violet-400/60 transition-colors"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 text-white flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ChatDemo;