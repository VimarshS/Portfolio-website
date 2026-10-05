export type Role = 'Frontend' | 'Full Stack' | 'Backend';
export type Level = 'Junior' | 'Mid';

export interface Concept {
  label: string; // shown as a strength when the answer covers it
  keywords: string[]; // words that count as "covered"
  hint: string; // shown as a gap when the answer misses it
}

export interface Question {
  id: string;
  role: Role;
  level: Level;
  text: string;
  concepts: Concept[];
  sample: string; // an example answer (it leaves one idea out on purpose)
}

export interface Feedback {
  score: number;
  rating: 'Strong' | 'Good' | 'Needs work';
  strengths: string[];
  gaps: string[];
  next_step: string;
  answer_seconds: number;
  words: number;
}

export const ROLES: Role[] = ['Frontend', 'Full Stack', 'Backend'];
export const LEVELS: Level[] = ['Junior', 'Mid'];
export const MIN_WORDS = 10;

// Six sample questions. The real platform asks Gemini to write new ones.
export const QUESTIONS: Question[] = [
  {
    id: 'fe-junior',
    role: 'Frontend',
    level: 'Junior',
    text: 'What is the difference between state and props in React, and when would you lift state up?',
    concepts: [
      {
        label: 'Props are read-only inputs passed from a parent',
        keywords: ['read-only', 'read only', 'immutable', 'passed from', 'passed down', 'from the parent', 'from parent', 'parent passes'],
        hint: 'Say that props are read-only and flow from a parent to its children.',
      },
      {
        label: 'State belongs to the component and changes over time',
        keywords: ['usestate', 'owned', 'local state', 'internal', 'changes over time', 'mutable', 'own state'],
        hint: 'Explain that state belongs to the component and changes over time, for example with useState.',
      },
      {
        label: 'A change in state or props causes a re-render',
        keywords: ['re-render', 'rerender', 're render', 'render again', 'renders again', 'updates the ui', 'update the ui'],
        hint: 'Mention that changing state or props makes React render the component again.',
      },
      {
        label: 'Lifting state up to the closest common parent',
        keywords: ['lift', 'common parent', 'closest parent', 'shared state', 'sibling'],
        hint: 'Say that when two siblings need the same data, you lift the state up to their common parent.',
      },
    ],
    sample:
      'Props are read-only values passed from a parent component to its child. State is owned by the component itself, for example with useState, and it changes over time. When state or props change, React triggers a re-render of the component and updates the UI.',
  },
  {
    id: 'fe-mid',
    role: 'Frontend',
    level: 'Mid',
    text: 'How does React decide what to update in the DOM when state changes, and how would you stop unnecessary re-renders?',
    concepts: [
      {
        label: 'React compares a virtual DOM and updates only the differences',
        keywords: ['virtual dom', 'reconcil', 'diff'],
        hint: 'Explain that React compares the new virtual DOM with the old one and updates only what changed.',
      },
      {
        label: 'Stable keys help React match list items',
        keywords: ['key'],
        hint: 'Mention stable keys in lists, so React can match items between renders.',
      },
      {
        label: 'Memoization with React.memo, useMemo or useCallback',
        keywords: ['memo', 'usecallback'],
        hint: 'Name memoization tools such as React.memo, useMemo and useCallback.',
      },
      {
        label: 'State is kept close to where it is used',
        keywords: ['colocat', 'move state down', 'close to', 'split', 'smaller component'],
        hint: 'Say that keeping state close to where it is used limits how much re-renders.',
      },
      {
        label: 'Measure with the React Profiler before optimizing',
        keywords: ['profiler', 'devtools', 'measure'],
        hint: 'Say you would measure with the React Profiler before optimizing.',
      },
    ],
    sample:
      'React builds a virtual DOM and uses reconciliation to diff it against the previous tree, then updates only the real DOM nodes that changed. Stable keys in lists help it match items. To avoid extra renders I use React.memo, useMemo and useCallback where it matters, and I measure first with the React Profiler instead of guessing.',
  },
  {
    id: 'fs-junior',
    role: 'Full Stack',
    level: 'Junior',
    text: 'How does a user log in on a MERN app that uses JWT? Walk through the whole flow.',
    concepts: [
      {
        label: 'The server checks the password against a stored hash',
        keywords: ['bcrypt', 'hash', 'compare', 'verify the password', 'check the password'],
        hint: 'Say the server compares the password with a stored hash, for example with bcrypt.',
      },
      {
        label: 'The server signs a JWT after a successful login',
        keywords: ['sign', 'jsonwebtoken', 'issue'],
        hint: 'Say the server signs a JWT with a secret after a successful login.',
      },
      {
        label: 'The client keeps the token in a safe place',
        keywords: ['localstorage', 'local storage', 'httponly', 'http-only', 'cookie', 'session storage'],
        hint: 'Say where the token is kept, for example in an httpOnly cookie.',
      },
      {
        label: 'The token is sent with every request',
        keywords: ['authorization', 'bearer', 'header'],
        hint: 'Mention that the token is sent in the Authorization header with each request.',
      },
      {
        label: 'Middleware verifies the token on protected routes',
        keywords: ['middleware', 'verify', 'protected'],
        hint: 'Mention a middleware that verifies the token before protected routes run.',
      },
      {
        label: 'Tokens expire and can be refreshed',
        keywords: ['expire', 'expiry', 'expiration', 'refresh'],
        hint: 'Add that tokens expire, and that a refresh token can renew them.',
      },
    ],
    sample:
      'The user sends email and password to the login route. The server compares the password with the stored bcrypt hash. If it matches, the server signs a JWT with a secret and sends it back. The client keeps it in an httpOnly cookie, or sends it in the Authorization header as a Bearer token on every request. A middleware verifies the token before any protected route runs.',
  },
  {
    id: 'fs-mid',
    role: 'Full Stack',
    level: 'Mid',
    text: 'Your REST API gets slow because the list endpoint returns thousands of rows. How would you fix it?',
    concepts: [
      {
        label: 'Pagination with limit and skip, or a cursor',
        keywords: ['paginat', 'limit', 'skip', 'cursor'],
        hint: 'Say you would paginate, with limit and skip or with a cursor.',
      },
      {
        label: 'A database index on the filtered and sorted fields',
        keywords: ['index'],
        hint: 'Mention adding a database index on the fields you filter and sort by.',
      },
      {
        label: 'Returning only the fields the client needs',
        keywords: ['projection', 'only the fields', 'select only', 'needed fields', 'fewer fields'],
        hint: 'Say you would return only the fields the client needs.',
      },
      {
        label: 'Caching repeated reads',
        keywords: ['cache', 'redis'],
        hint: 'Mention caching repeated reads, for example with Redis.',
      },
      {
        label: 'Measuring first, for example with an explain plan',
        keywords: ['explain', 'profil', 'measure', 'monitor', 'slow query'],
        hint: 'Say you would measure first, for example with a query explain plan.',
      },
    ],
    sample:
      'First I would measure where the time goes, for example with the query explain plan. Then I would add pagination with limit and skip, or a cursor for big lists. I would add an index on the fields used to filter and sort, and return only the fields the client needs instead of the full documents.',
  },
  {
    id: 'be-junior',
    role: 'Backend',
    level: 'Junior',
    text: 'What is the difference between SQL and NoSQL databases, and how do you choose between them?',
    concepts: [
      {
        label: 'SQL stores data in tables with a fixed schema',
        keywords: ['table', 'schema', 'relational', 'rows'],
        hint: 'Say SQL databases store data in tables with a fixed schema.',
      },
      {
        label: 'NoSQL stores flexible data such as documents',
        keywords: ['document', 'flexible', 'json', 'schemaless', 'key-value', 'key value'],
        hint: 'Say NoSQL databases store flexible data such as documents.',
      },
      {
        label: 'SQL is strong at joins and transactions',
        keywords: ['join', 'transaction', 'acid'],
        hint: 'Mention joins and ACID transactions as strengths of SQL.',
      },
      {
        label: 'Many NoSQL databases scale out horizontally',
        keywords: ['scale', 'scaling', 'horizontal', 'shard'],
        hint: 'Mention that many NoSQL databases scale out horizontally.',
      },
      {
        label: 'The choice depends on data shape and query patterns',
        keywords: ['use case', 'access pattern', 'query pattern', 'depends on', 'data shape', 'requirements'],
        hint: 'End with how you choose: by the shape of the data and the way it is queried.',
      },
    ],
    sample:
      'SQL databases are relational: data lives in tables with a fixed schema, and they are strong at joins and ACID transactions. NoSQL databases like MongoDB store flexible JSON-like documents, which suits changing data. I choose based on the use case: how the data is shaped and which queries I need most.',
  },
  {
    id: 'be-mid',
    role: 'Backend',
    level: 'Mid',
    text: 'How would you design rate limiting for a public API?',
    concepts: [
      {
        label: 'A clear algorithm, such as token bucket or sliding window',
        keywords: ['token bucket', 'sliding window', 'fixed window', 'leaky bucket'],
        hint: 'Name an algorithm such as token bucket or sliding window.',
      },
      {
        label: 'Clients are identified by API key, user or IP',
        keywords: ['ip', 'api key', 'user id', 'per user', 'per client'],
        hint: 'Say how you identify a client: by IP address, API key or user id.',
      },
      {
        label: 'Counters live in a shared store such as Redis',
        keywords: ['redis', 'shared store', 'distributed', 'central store'],
        hint: 'Say the counters live in a shared store such as Redis, so every server sees them.',
      },
      {
        label: 'The API answers with 429 and a Retry-After header',
        keywords: ['429', 'retry-after', 'too many requests'],
        hint: 'Return status 429 with a Retry-After header.',
      },
      {
        label: 'Limits are also enforced at the gateway or proxy',
        keywords: ['gateway', 'nginx', 'proxy', 'cloudflare', 'edge'],
        hint: 'Mention enforcing limits at the gateway or reverse proxy as well.',
      },
    ],
    sample:
      'I would use a token bucket or sliding window algorithm. Each client is identified by API key, or by IP address when there is no key. The counters are kept in Redis so all servers share them. When the limit is hit, the API answers with status 429 and a Retry-After header.',
  },
];

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// A keyword counts when a word in the answer STARTS with it ("index" matches "indexes")
const mentions = (text: string, keyword: string) =>
  new RegExp(`\\b${escapeRegExp(keyword)}`, 'i').test(text);

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export function pacingNote(seconds: number): string {
  if (seconds < 20) return 'Quick answer. Take a little more time to explain your reasoning.';
  if (seconds <= 150) return 'Good pace for an interview answer.';
  return 'Long answer. Start with a short summary, then add the details.';
}

// Demo scoring: how many key ideas appear, plus a small bonus for a fuller answer.
// The real platform sends the answer to Gemini and gets this JSON back instead.
export function evaluateAnswer(question: Question, answer: string, seconds: number): Feedback {
  const words = countWords(answer);
  const covered = question.concepts.filter((c) => c.keywords.some((k) => mentions(answer, k)));
  const missed = question.concepts.filter((c) => !covered.includes(c));

  const coverage = covered.length / question.concepts.length;
  const depth = Math.min(words / 60, 1);
  const score = Math.round(coverage * 80 + depth * 20);

  return {
    score,
    rating: score >= 75 ? 'Strong' : score >= 50 ? 'Good' : 'Needs work',
    strengths: covered.map((c) => c.label),
    gaps: missed.map((c) => c.hint),
    next_step:
      missed.length > 0
        ? `Add this next time: ${missed[0].hint}`
        : 'Back your answer with a real example from one of your projects.',
    answer_seconds: seconds,
    words,
  };
}