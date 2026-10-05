import React, { Suspense, lazy } from 'react';
import { Terminal } from 'lucide-react';
import { DemoFrame } from './demos/DemoFrame';
import { LazyMount, DemoSkeleton } from './demos/LazyMount';

// Each demo is loaded only when its card comes near the screen
const InterviewDemo = lazy(() => import('./demos/InterviewDemo'));
const NotesDemo = lazy(() => import('./demos/NotesDemo'));
const ChatDemo = lazy(() => import('./demos/ChatDemo'));

type MockupType = 'interview' | 'notes' | 'chat' | 'generic';

interface ProjectMockupProps {
  type: MockupType;
  title: string;
  technologies?: string[];
  onOpenModal?: () => void;
}

const URL_LABELS: Record<MockupType, string> = {
  interview: 'ai-mock-interview (demo)',
  notes: 'notesgen-ai (demo)',
  chat: 'vibe-chat (demo)',
  generic: 'project-overview',
};

export const ProjectMockup: React.FC<ProjectMockupProps> = ({
  type,
  title,
  technologies = [],
  onOpenModal,
}) => {
  return (
    <DemoFrame
      urlLabel={URL_LABELS[type]}
      onOpenModal={onOpenModal}
      interactive={type !== 'generic'}
    >
      {type === 'interview' && (
        <LazyMount>
          <Suspense fallback={<DemoSkeleton />}>
            <InterviewDemo />
          </Suspense>
        </LazyMount>
      )}

      {type === 'notes' && (
        <LazyMount>
          <Suspense fallback={<DemoSkeleton />}>
            <NotesDemo />
          </Suspense>
        </LazyMount>
      )}

      {type === 'chat' && (
        <LazyMount>
          <Suspense fallback={<DemoSkeleton />}>
            <ChatDemo />
          </Suspense>
        </LazyMount>
      )}

      {/* For projects without a demo yet: shows the real tech stack */}
      {type === 'generic' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-200">{title}</div>
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