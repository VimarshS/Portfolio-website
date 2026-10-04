import React, { useState } from 'react';
import { Maximize2, RotateCcw } from 'lucide-react';

interface DemoFrameProps {
  urlLabel: string;
  onOpenModal?: () => void;
  /** true = a real working demo: shows the badge and a Reset button */
  interactive?: boolean;
  badge?: string;
  children: React.ReactNode;
}

export const DemoFrame: React.FC<DemoFrameProps> = ({
  urlLabel,
  onOpenModal,
  interactive = false,
  badge = 'Interactive demo · simulated data',
  children,
}) => {
  // Changing this key rebuilds the demo from zero, so Reset needs no extra code
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="relative group rounded-xl border border-neutral-800 bg-[#0a0a0c] overflow-hidden shadow-2xl transition-all duration-300 hover:border-neutral-700/80">
      {/* Browser Chrome Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#111114] border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-neutral-500 font-mono text-[11px] ml-2 hidden sm:inline">
            {urlLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
              title="Expand Case Study Architecture"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Deep Dive</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas. Real demos must allow text selection and typing, so no select-none */}
      <div
        className={`p-4 sm:p-5 min-h-[300px] flex flex-col justify-between bg-gradient-to-b from-[#0a0a0c] via-[#09090b] to-[#070709] ${
          interactive ? '' : 'select-none'
        }`}
      >
        <React.Fragment key={resetKey}>{children}</React.Fragment>
      </div>

      {/* Footer strip, only for real demos */}
      {interactive && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#0d0d10] border-t border-neutral-800 text-[11px] font-mono text-neutral-500">
          <span>{badge}</span>
          <button
            onClick={() => setResetKey((k) => k + 1)}
            className="inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors"
            title="Reset demo"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </div>
  );
};