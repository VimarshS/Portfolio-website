
import React, { Suspense, lazy, useState } from 'react';
import {
  Terminal,
  Send,
  Sparkles,
  Bot,
  CheckCircle2,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
} from 'lucide-react';
import { DemoFrame } from './demos/DemoFrame';

import { LazyMount, DemoSkeleton } from './demos/LazyMount';

// Loaded only when the card comes near the screen
const ChatDemo = lazy(() => import('./demos/ChatDemo'));

interface ProjectMockupProps {
  type: 'interview' | 'notes' | 'chat' | 'generic';
  title: string;
  technologies?: string[];
  onOpenModal?: () => void;
}

export const ProjectMockup: React.FC<ProjectMockupProps> = ({
  type,
  title,
  technologies = [],
  onOpenModal,
}) => {
  // States for interactive simulations
  const [copied, setCopied] = useState(false);

  // AI Interview State
  const [selectedRole, setSelectedRole] = useState<
    'Frontend Engineer' | 'Full Stack Developer' | 'Backend Systems'
  >('Full Stack Developer');
  const [isRecording, setIsRecording] = useState(false);

  // NotesGen AI State
  const [activeTab, setActiveTab] = useState<'summary' | 'keypoints'>(
    'summary'
  );

  // Chat State
  // const [messages, setMessages] = useState([
  //   {
  //     id: 1,
  //     sender: 'Alex',
  //     text: 'Has the WebSocket connection re-established?',
  //     time: '10:42 AM',
  //     isSelf: false,
  //   },
  //   {
  //     id: 2,
  //     sender: 'Vimarsh (You)',
  //     text: 'Yes! Full-duplex Socket connection active with MongoDB persistence.',
  //     time: '10:43 AM',
  //     isSelf: true,
  //   },
  //   {
  //     id: 3,
  //     sender: 'Alex',
  //     text: 'Awesome, image attachments via Cloudinary are loading instantly.',
  //     time: '10:44 AM',
  //     isSelf: false,
  //   },
  // ]);
  // const [inputMsg, setInputMsg] = useState('');

  // const handleSendChat = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!inputMsg.trim()) return;

  //   const newMsg = {
  //     id: Date.now(),
  //     sender: 'Vimarsh (You)',
  //     text: inputMsg,
  //     time: 'Just now',
  //     isSelf: true,
  //   };

  //   setMessages((prev) => [...prev, newMsg]);
  //   setInputMsg('');
  // };

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const urlLabel =
    type === 'interview'
      ? 'ai-mock-interview.vimarsh.dev'
      : type === 'notes'
      ? 'notes-gen-ai-puce.vercel.app'
      : type === 'chat'
      ? 'vibe-chat (demo)'
      : 'project-overview';

  return (
    <DemoFrame urlLabel={urlLabel} onOpenModal={onOpenModal} interactive={type === 'chat'}>
      {type === 'interview' && (
        <div className="space-y-4">
          {/* Header / Role Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-200">
                  Gemini Technical Evaluator
                </div>
                <div className="text-[11px] text-neutral-400">
                  Session ID: #AI-INT-8942 · Active
                </div>
              </div>
            </div>

            {/* Role selection tab */}
            <div className="flex items-center gap-1 bg-neutral-900/80 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
              {(
                [
                  'Frontend Engineer',
                  'Full Stack Developer',
                  'Backend Systems',
                ] as const
              ).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedRole === role
                      ? 'bg-neutral-800 text-white font-medium shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {role === 'Frontend Engineer'
                    ? 'Frontend'
                    : role === 'Full Stack Developer'
                    ? 'Full Stack'
                    : 'Backend'}
                </button>
              ))}
            </div>
          </div>

          {/* Generated AI Question */}
          <div className="p-3.5 rounded-lg bg-neutral-900/90 border border-neutral-800/90 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-indigo-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Generated Interview Question
              </span>
              <span className="text-neutral-400 font-mono text-[10px]">
                Supabase · Gemini 1.5
              </span>
            </div>
            <p className="text-xs text-neutral-200 leading-relaxed font-sans">
              {selectedRole === 'Full Stack Developer' &&
                '"Explain how you design a resilient REST API with JWT authentication. How do you mitigate token replay attacks and maintain database session consistency?"'}
              {selectedRole === 'Frontend Engineer' &&
                '"How does the React 19 fiber reconciliation engine handle asynchronous state updates and avoid unnecessary re-renders in deep component trees?"'}
              {selectedRole === 'Backend Systems' &&
                '"Compare PostgreSQL relational indexing with MongoDB document collections for high-concurrency read vs write workloads."'}
            </p>
          </div>

          {/* Simulated Candidate Input & Voice Pacing */}
          <div className="flex items-center gap-3 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/60">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800'
              }`}
            >
              {isRecording ? (
                <Mic className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <MicOff className="w-3.5 h-3.5" />
              )}
              <span className="text-[11px] font-medium">
                {isRecording ? 'Listening...' : 'Voice Input'}
              </span>
            </button>

            <div className="flex-1 flex items-center gap-1 h-6 px-2 bg-neutral-900/60 rounded border border-neutral-800/40">
              <span className="w-1 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-3.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:450ms]" />
              <span className="w-1 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:200ms]" />
              <span className="text-[11px] text-neutral-400 ml-2 font-mono truncate">
                {isRecording
                  ? 'Analyzing candidate answer audio...'
                  : 'Answer recorded: 1m 24s'}
              </span>
            </div>
          </div>

          {/* AI Evaluation Output Pill */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
              <div className="flex items-center justify-between text-emerald-400 font-medium text-[11px] mb-1">
                <span>Technical Score</span>
                <span className="font-mono font-semibold">92%</span>
              </div>
              <div className="text-[11px] text-neutral-400 leading-snug">
                Accurate explanation of JWT stateless claims and payload signing.
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-800/30">
              <div className="flex items-center justify-between text-indigo-400 font-medium text-[11px] mb-1">
                <span>Gemini Feedback</span>
                <span className="font-mono text-[10px]">Real-time</span>
              </div>
              <div className="text-[11px] text-neutral-400 leading-snug">
                Good structural clarity. Consider adding refresh token rotation detail.
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'notes' && (
        <div className="space-y-4">
          {/* View Tab Buttons */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-200">
                  NotesGen AI Synthesizer
                </div>
                <div className="text-[11px] text-neutral-400">
                  Node / Express · OpenAI Ingestion
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-neutral-900/80 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('keypoints')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'keypoints'
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Key Concepts
              </button>
            </div>
          </div>

          {/* Content Preview Box */}
          <div className="p-3.5 rounded-lg bg-neutral-900/90 border border-neutral-800/90 font-mono text-[11px] leading-relaxed text-neutral-300">
            {activeTab === 'summary' ? (
              <div className="space-y-2">
                <div className="text-amber-400 font-sans font-medium flex items-center justify-between text-xs">
                  <span>
                    Synthesized Notes: Operating Systems - Virtual Memory
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span className="font-mono text-[10px]">
                      {copied ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </div>
                <p className="text-neutral-300 font-sans text-xs">
                  Virtual memory abstracts physical RAM through demand paging,
                  translating virtual addresses into physical frames via Page
                  Tables and the Translation Lookaside Buffer (TLB).
                </p>
                <div className="text-[11px] text-neutral-400 font-sans pt-1 border-t border-neutral-800">
                  • Page faults trigger OS trap handlers to swap victim pages to disk.
                  <br />
                  • Replacement policies (LRU, Clock algorithm) prevent thrashing
                  under memory pressure.
                </div>
              </div>
            ) : (
              <div className="space-y-2 font-sans">
                <div className="text-amber-400 font-medium text-xs">
                  Extracted Semantic Key Concepts:
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-mono font-bold">•</span>
                    <span>
                      <strong>Paging:</strong> Fixed-size memory allocation
                      preventing external fragmentation.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-mono font-bold">•</span>
                    <span>
                      <strong>TLB Hit Ratio:</strong> High-speed hardware cache
                      minimizing memory access latency.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-mono font-bold">•</span>
                    <span>
                      <strong>Working Set Model:</strong> Principle of locality
                      keeping hot pages resident in RAM.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Raw Ingestion Stats */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/60 font-mono">
            <span>Source: 1,840 Words</span>
            <span className="text-emerald-400">Compressed: 78% Reduction</span>
            <span>MongoDB Saved</span>
          </div>
        </div>
      )}

              {type === 'chat' && (
          <LazyMount>
            <Suspense fallback={<DemoSkeleton />}>
              <ChatDemo />
            </Suspense>
          </LazyMount>
        )}

      {type === 'generic' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-200">
              {title}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono hover:border-indigo-500/50 hover:text-white transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Open the case study for architecture, features and learnings →
            </button>
          )}
        </div>
      )}
    </DemoFrame>
  );
};