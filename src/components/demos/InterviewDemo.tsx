import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, Braces, Check, Clock, History as HistoryIcon, Sparkles, X } from 'lucide-react';
import {
  evaluateAnswer,
  Feedback,
  formatTime,
  countWords,
  Level,
  LEVELS,
  MIN_WORDS,
  pacingNote,
  QUESTIONS,
  Role,
  ROLES,
} from './interviewData';

const EVAL_STEPS = [
  'Reading your answer...',
  'Checking the key concepts...',
  'Building structured feedback...',
];

interface HistoryItem {
  id: number;
  role: Role;
  level: Level;
  question: string;
  score: number;
  seconds: number;
}

const ratingStyle = {
  Strong: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  Good: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
  'Needs work': 'text-rose-300 border-rose-500/40 bg-rose-500/10',
} as const;

const Segmented: React.FC<{
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ label, options, value, onChange, disabled }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</span>
    <div className="flex items-center gap-0.5 rounded-lg border border-neutral-800 bg-neutral-900/80 p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`rounded-md px-2 py-1 text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === option
              ? 'bg-neutral-700 font-medium text-white'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const InterviewDemo: React.FC = () => {
  const [qIndex, setQIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<'answering' | 'evaluating' | 'feedback'>('answering');
  const [evalStep, setEvalStep] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [fbView, setFbView] = useState<'summary' | 'json'>('summary');
  const [tab, setTab] = useState<'interview' | 'history'>('interview');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');

  const timers = useRef<number[]>([]);
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const q = QUESTIONS[qIndex];
  const words = countWords(answer);

  // The question appears a few letters at a time, like a streamed AI reply
  useEffect(() => {
    const full = QUESTIONS[qIndex].text;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(full.length);
      return;
    }

    let count = 0;
    setShown(0);
    const interval = window.setInterval(() => {
      count = Math.min(full.length, count + 2);
      setShown(count);
      if (count >= full.length) window.clearInterval(interval);
    }, 18);
    return () => window.clearInterval(interval);
  }, [qIndex]);

  // Answer timer
  useEffect(() => {
    if (startedAt === null || phase !== 'answering') return;
    const interval = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [startedAt, phase]);

  // Stop pending timers when the demo is closed or reset
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Each screen starts at the top
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab, phase, qIndex, fbView]);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const resetAttempt = () => {
    setAnswer('');
    setPhase('answering');
    setFeedback(null);
    setFbView('summary');
    setStartedAt(null);
    setElapsed(0);
    setError('');
  };

  const goTo = (index: number) => {
    if (index < 0) return;
    setQIndex(index);
    resetAttempt();
  };

  const selectRole = (role: string) =>
    goTo(QUESTIONS.findIndex((item) => item.role === role && item.level === q.level));
  const selectLevel = (level: string) =>
    goTo(QUESTIONS.findIndex((item) => item.role === q.role && item.level === level));

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    if (startedAt === null && value.trim()) setStartedAt(Date.now());
  };

  const handleSample = () => {
    setAnswer(q.sample);
    if (startedAt === null) setStartedAt(Date.now());
    setError('');
  };

  const handleSubmit = () => {
    if (phase !== 'answering') return;
    if (words < MIN_WORDS) {
      setError(`Write at least ${MIN_WORDS} words so there is something to review.`);
      return;
    }

    setError('');
    const seconds = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
    const submitted = answer;
    const asked = q;

    setPhase('evaluating');
    setEvalStep(0);
    later(500, () => setEvalStep(1));
    later(1000, () => setEvalStep(2));
    later(1500, () => {
      const result = evaluateAnswer(asked, submitted, seconds);
      setFeedback(result);
      setPhase('feedback');
      setHistory((prev) => [
        {
          id: nextId.current++,
          role: asked.role,
          level: asked.level,
          question: asked.text,
          score: result.score,
          seconds,
        },
        ...prev,
      ]);
    });
  };

  const jsonView = feedback
    ? JSON.stringify(
        {
          question_id: q.id,
          role: q.role,
          level: q.level,
          score: feedback.score,
          rating: feedback.rating,
          strengths: feedback.strengths,
          gaps: feedback.gaps,
          next_step: feedback.next_step,
          answer_seconds: feedback.answer_seconds,
        },
        null,
        2
      )
    : '';

  return (
    <div className="@container">
      <div className="flex h-[420px] flex-col overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0b11]">
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-neutral-800/80 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <span className="rounded-md bg-indigo-500/15 p-1 text-indigo-400">
              <Bot className="w-3.5 h-3.5" />
            </span>
            AI Mock Interview
          </span>

          <nav className="ml-1 flex items-center gap-1" aria-label="Demo sections">
            <button
              type="button"
              onClick={() => setTab('interview')}
              aria-current={tab === 'interview'}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                tab === 'interview' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Interview
            </button>
            <button
              type="button"
              onClick={() => setTab('history')}
              aria-current={tab === 'history'}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                tab === 'history' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <HistoryIcon className="w-3 h-3" />
              History{history.length > 0 ? ` (${history.length})` : ''}
            </button>
          </nav>

          <span className="ml-auto hidden font-mono text-[10px] text-neutral-500 @md:inline">
            Session #DEMO-0001
          </span>
        </div>

        {/* Role and level pickers */}
        {tab === 'interview' && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-neutral-800/60 px-3 py-2">
            <Segmented
              label="Role"
              options={ROLES}
              value={q.role}
              onChange={selectRole}
              disabled={phase === 'evaluating'}
            />
            <Segmented
              label="Level"
              options={LEVELS}
              value={q.level}
              onChange={selectLevel}
              disabled={phase === 'evaluating'}
            />
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
          {/* ---------- Interview ---------- */}
          {tab === 'interview' && (
            <div className="space-y-3">
              <div className="space-y-2 rounded-lg border border-neutral-800/90 bg-neutral-900/80 p-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    Interview question
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">
                    {q.role} · {q.level}
                  </span>
                </div>
                <p className="min-h-[3.5rem] text-xs leading-relaxed text-neutral-200" aria-live="polite">
                  {q.text.slice(0, shown)}
                  {shown < q.text.length && (
                    <span className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 bg-indigo-400 motion-safe:animate-pulse" />
                  )}
                </p>
              </div>

              {/* Answering */}
              {phase === 'answering' && (
                <div className="space-y-2">
                  <label htmlFor="id-answer" className="sr-only">
                    Your answer
                  </label>
                  <textarea
                    id="id-answer"
                    value={answer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    rows={5}
                    maxLength={1200}
                    placeholder="Type your answer here, as you would say it in an interview..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-base leading-relaxed text-neutral-100 placeholder:text-neutral-500 focus:border-indigo-400/70 focus:outline-none transition-colors sm:text-xs"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
                    <span className="inline-flex items-center gap-3">
                      <span>
                        {words} {words === 1 ? 'word' : 'words'}
                        {words < MIN_WORDS ? ` (minimum ${MIN_WORDS})` : ''}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(elapsed)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleSample}
                      className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
                    >
                      Fill a sample answer
                    </button>
                  </div>

                  {error && (
                    <p role="alert" className="text-[11px] text-rose-300">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-400"
                  >
                    Submit answer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Evaluating */}
              {phase === 'evaluating' && (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-8 text-xs text-neutral-300">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400/40 border-t-indigo-400" />
                  <span>{EVAL_STEPS[evalStep]}</span>
                </div>
              )}

              {/* Feedback */}
              {phase === 'feedback' && feedback && (
                <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold leading-none text-white">
                        {feedback.score}
                        <span className="text-sm font-normal text-neutral-500">/100</span>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${ratingStyle[feedback.rating]}`}
                      >
                        {feedback.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 rounded-lg border border-neutral-800 bg-neutral-900/80 p-0.5">
                      <button
                        type="button"
                        onClick={() => setFbView('summary')}
                        aria-pressed={fbView === 'summary'}
                        className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                          fbView === 'summary' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => setFbView('json')}
                        aria-pressed={fbView === 'json'}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors ${
                          fbView === 'json' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <Braces className="w-3 h-3" />
                        JSON
                      </button>
                    </div>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-700"
                      style={{ width: `${feedback.score}%` }}
                    />
                  </div>

                  {fbView === 'summary' && (
                    <div className="space-y-3">
                      {feedback.strengths.length > 0 && (
                        <div>
                          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                            What you covered
                          </div>
                          <ul className="space-y-1">
                            {feedback.strengths.map((s) => (
                              <li key={s} className="flex gap-2 text-[11px] leading-relaxed text-neutral-200">
                                <Check className="mt-0.5 w-3 h-3 shrink-0 text-emerald-400" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {feedback.gaps.length > 0 && (
                        <div>
                          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                            What to add
                          </div>
                          <ul className="space-y-1">
                            {feedback.gaps.map((g) => (
                              <li key={g} className="flex gap-2 text-[11px] leading-relaxed text-neutral-300">
                                <X className="mt-0.5 w-3 h-3 shrink-0 text-rose-400" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="rounded-md bg-indigo-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-indigo-100">
                        {feedback.next_step}
                      </p>

                      <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <Clock className="w-3 h-3" />
                        {formatTime(feedback.answer_seconds)} · {feedback.words} words ·{' '}
                        {pacingNote(feedback.answer_seconds)}
                      </p>
                    </div>
                  )}

                  {fbView === 'json' && (
                    <pre className="max-h-48 overflow-auto rounded-md border border-neutral-800 bg-black/40 p-2.5 font-mono text-[10px] leading-relaxed text-emerald-200">
                      {jsonView}
                    </pre>
                  )}

                  <p className="text-[10px] leading-relaxed text-neutral-500">
                    Demo scoring checks for key concepts. The real platform sends the answer to Gemini
                    and gets this structured JSON back.
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetAttempt}
                      className="flex-1 rounded-lg border border-neutral-700 py-2 text-[11px] text-neutral-200 transition-colors hover:border-neutral-600"
                    >
                      Try again
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo((qIndex + 1) % QUESTIONS.length)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-500 py-2 text-[11px] font-medium text-white transition-colors hover:bg-indigo-400"
                    >
                      Next question
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------- History ---------- */}
          {tab === 'history' && (
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="rounded-lg border border-dashed border-neutral-800 px-4 py-8 text-center text-xs text-neutral-500">
                  No answers yet. Submit an answer and it is saved here for this session.
                </p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-200">
                      {item.score}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-neutral-200">
                        {item.question}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-neutral-500">
                        {item.role} · {item.level} · {formatTime(item.seconds)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <p className="pt-1 text-center text-[10px] leading-relaxed text-neutral-500">
                Kept in this browser tab only. The real platform stores sessions in PostgreSQL on Supabase.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewDemo;