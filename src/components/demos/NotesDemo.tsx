import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Coins, Download, Sparkles, Star, Zap } from 'lucide-react';
import { buildMarkdown, findTopic, NoteOptions, TOPICS, TopicNotes } from './notesData';

const START_CREDITS = 560;
const COST = 10;
const STEPS = [
  'Reading your topic...',
  'Structuring sub topics...',
  'Ranking by exam priority...',
];

interface Result {
  notes: TopicNotes;
  level: string;
  exam: string;
  options: NoteOptions;
}

const Stars: React.FC<{ count: number }> = ({ count }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`Priority ${count} of 3`}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
    ))}
  </span>
);

const Switch: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
  icon: React.ReactNode;
}> = ({ checked, onChange, label, icon }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left"
  >
    <span
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-indigo-500' : 'bg-neutral-700'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4' : ''
        }`}
      />
    </span>
    <span className="flex items-center gap-2 text-xs text-neutral-300">
      {icon}
      {label}
    </span>
  </button>
);

const inputClass =
  'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-base sm:text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-indigo-400/70 transition-colors';

const NotesDemo: React.FC = () => {
  const [tab, setTab] = useState<'generate' | 'notes'>('generate');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('');
  const [exam, setExam] = useState('');
  const [options, setOptions] = useState<NoteOptions>({ examMode: false, diagram: false, charts: false });
  const [credits, setCredits] = useState(START_CREDITS);
  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [view, setView] = useState<'full' | 'quick'>('full');

  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Start every screen at the top
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab, view]);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const toggle = (key: keyof NoteOptions) => setOptions((o) => ({ ...o, [key]: !o[key] }));

  const handleGenerate = () => {
    if (generating) return;

    const text = topic.trim();
    if (!text) {
      setError('Enter a topic first.');
      return;
    }
    if (credits < COST) {
      setError('No credits left in this demo. Press Reset to start again.');
      return;
    }
    const notes = findTopic(text);
    if (!notes) {
      setError('This demo knows three sample topics. Pick one of the suggestions below.');
      return;
    }

    setError('');
    setGenerating(true);
    setStepIndex(0);

    // The options are copied now, so changing a switch later does not change these notes
    const snapshot: Result = { notes, level: level.trim(), exam: exam.trim(), options: { ...options } };

    later(700, () => setStepIndex(1));
    later(1400, () => setStepIndex(2));
    later(2100, () => {
      setCredits((c) => c - COST);
      setResult(snapshot);
      setView('full');
      setTab('notes');
      setGenerating(false);
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const markdown = buildMarkdown(result.notes, {
      level: result.level,
      exam: result.exam,
      ...result.options,
    });
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notesgen-${result.notes.key}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="@container">
      <div className="flex h-[380px] flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0b13]">
        {/* Top bar: brand, tabs, credits */}
        <div className="flex items-center gap-2 border-b border-neutral-800/80 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            NotesGen<span className="text-indigo-400">.AI</span>
          </span>

          <nav className="ml-2 flex items-center gap-1" aria-label="Demo sections">
            <button
              type="button"
              onClick={() => setTab('generate')}
              aria-current={tab === 'generate'}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                tab === 'generate' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Generate
            </button>
            <button
              type="button"
              onClick={() => result && setTab('notes')}
              disabled={!result}
              aria-current={tab === 'notes'}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                tab === 'notes' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Notes
            </button>
          </nav>

          <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold text-indigo-200">
            <Coins className="w-3 h-3" />
            {credits} cr
          </span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
          {/* ---------- Generate form ---------- */}
          {tab === 'generate' && (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
            >
              <div className="space-y-1.5">
                <label htmlFor="nd-topic" className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Topic *
                </label>
                <input
                  id="nd-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Photosynthesis, World War II, Calculus..."
                  className={inputClass}
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-neutral-500">Try:</span>
                  {TOPICS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        setTopic(t.title);
                        setError('');
                      }}
                      className="rounded-full border border-indigo-500/30 px-2 py-0.5 text-[10px] text-indigo-200 hover:bg-indigo-500/15 transition-colors"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label htmlFor="nd-level" className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Class / Level
                  </label>
                  <input
                    id="nd-level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    maxLength={30}
                    placeholder="e.g. Class 10"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="nd-exam" className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Exam Type
                  </label>
                  <input
                    id="nd-exam"
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    maxLength={30}
                    placeholder="e.g. CBSE, JEE"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Options
                </div>
                <Switch
                  checked={options.examMode}
                  onChange={() => toggle('examMode')}
                  label="Exam Revision Mode"
                  icon={<Zap className="w-3 h-3 text-amber-400" />}
                />
                <Switch
                  checked={options.diagram}
                  onChange={() => toggle('diagram')}
                  label="Include Diagram"
                  icon={<ArrowRight className="w-3 h-3 text-neutral-400" />}
                />
                <Switch
                  checked={options.charts}
                  onChange={() => toggle('charts')}
                  label="Include Charts"
                  icon={<span className="inline-block w-3 text-center text-[10px] text-neutral-400">%</span>}
                />
              </div>

              {error && (
                <p role="alert" className="text-[11px] text-rose-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={generating}
                className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-indigo-500 py-2.5 text-xs font-semibold text-white hover:bg-indigo-400 disabled:cursor-wait disabled:hover:bg-indigo-500 transition-colors"
              >
                {generating ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span>{STEPS[stepIndex]}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Notes</span>
                    <span className="text-[10px] font-normal text-indigo-100/80">({COST} credits)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ---------- Notes ---------- */}
          {tab === 'notes' && result && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{result.notes.title}</h3>
                  <p className="text-[11px] text-neutral-500">
                    {[result.level, result.exam].filter(Boolean).join(' · ') || 'Full structured notes'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setView(view === 'full' ? 'quick' : 'full')}
                    aria-pressed={view === 'quick'}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${
                      view === 'quick'
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                        : 'border-neutral-700 text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    Quick Revision
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    title="Downloads these notes as a Markdown file"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-indigo-400 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>

              {/* Quick view: only the headings, grouped by priority */}
              {view === 'quick' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Sub topics · Priority
                  </div>
                  {result.notes.groups.map((g) => (
                    <div key={g.priority} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                        <Stars count={g.priority} />
                        Priority
                      </div>
                      <ul className="space-y-1">
                        {g.points.map((p) => (
                          <li key={p} className="flex gap-2 text-[11px] leading-relaxed text-neutral-300">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-500" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Full notes */}
              {view === 'full' && (
                <div className="space-y-3">
                  <div className="border-l-2 border-indigo-400 pl-2 text-xs font-semibold text-indigo-200">
                    Sub Topics
                  </div>

                  {result.notes.groups.map((g) => (
                    <div key={g.priority} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                        <Stars count={g.priority} />
                        Priority
                      </span>
                      <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">{g.idea}</p>
                      <ul className="mt-2 space-y-1.5">
                        {g.points.map((p) => (
                          <li key={p} className="flex gap-2 text-xs leading-relaxed text-neutral-200">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      {result.options.examMode && (
                        <p className="mt-2.5 flex gap-2 rounded-md bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100">
                          <Zap className="mt-0.5 w-3 h-3 shrink-0 text-amber-400" />
                          <span>{g.tip}</span>
                        </p>
                      )}
                    </div>
                  ))}

                  {result.options.diagram && (
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="mb-2 text-xs font-semibold text-indigo-200">Concept flow</div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {result.notes.flow.map((step, i) => (
                          <React.Fragment key={step}>
                            <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-[11px] text-indigo-100">
                              {step}
                            </span>
                            {i < result.notes.flow.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-neutral-500" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.options.charts && (
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="mb-2 text-xs font-semibold text-indigo-200">Exam weightage</div>
                      <div className="space-y-2">
                        {result.notes.groups.map((g) => (
                          <div key={g.priority} className="flex items-center gap-2 text-[11px] text-neutral-300">
                            <span className="w-16 shrink-0">Priority {g.priority}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                                style={{ width: `${g.weight}%` }}
                              />
                            </div>
                            <span className="w-8 shrink-0 text-right text-neutral-400">{g.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.options.examMode && (
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="mb-2 text-xs font-semibold text-indigo-200">Likely questions</div>
                      <ol className="list-decimal space-y-1.5 pl-4 text-[11px] leading-relaxed text-neutral-300">
                        {result.notes.questions.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesDemo;