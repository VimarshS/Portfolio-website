export interface Project {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  featured: boolean;
  technologies: string[];
  features: string[];
  architecture: string;
  learnings: string;
  liveUrl?: string;
  githubUrl?: string;
  tagline: string;
  category: 'Full-Stack & AI' | 'AI & Web' | 'Real-Time & WebSockets';
  mockupType: 'interview' | 'notes' | 'chat'| 'generic';
}

export interface SkillItem {
  name: string;
  description: string;
  badge?: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  programType: string;
  period: string;
  location: string;
  type: string;
  summary: string;
  bulletPoints: string[];
  skills: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  metric: string;
  metricLabel: string;
  subtitle: string;
  description: string;
  year: string;
  badge: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  coursework: string[];
}

export const PERSONAL_INFO = {
  name: "Vimarsh Srivastava",
  role: "Software Engineer",
  tagline: "Software Engineer | Full Stack Developer | AI Enthusiast",
  bio: "Building robust, production-ready full-stack applications, distributed RESTful architectures, and intelligent web experiences. Focused on modern JavaScript/TypeScript, React, Node.js, Next.js, relational and document databases, and AI engineering.",
  location: "Lucknow, India",
  email: "vimarshadarsh@gmail.com",
  phone: "+91 9118694244",
  github: "https://github.com/VimarshS",
  linkedin: "https://www.linkedin.com/in/vimarsh-srivastava-a393b42a1",
  portfolio: "https://vimarsh-portfolio.vercel.app/",
  resumePath: "/resume.pdf",
  status: "Available for Software Engineering Internships & Entry-Level Roles",
  stats: [
    { label: "SIH Hackathon", value: "3rd Place", context: "36-hr prototype" },
    { label: "LeetCode DSA", value: "250+", context: "Problems solved" },
    { label: "Full-Stack Apps", value: "3+", context: "Production-ready MERN" },
    { label: "RESTful APIs", value: "5+", context: "Built & integrated" },
  ]
};

export const PROJECTS: Project[] = [
  {
    id: "ai-mock-interview",
    title: "AI Mock Interview Platform",
    subtitle: "Real-Time AI Technical Interview Simulator",
    tagline: "Next.js · TypeScript · Supabase · Gemini API · Tailwind CSS",
    category: "Full-Stack & AI",
    mockupType: "interview",
    featured: true,
    summary: "A full-stack technical interview simulation platform that generates role-specific technical questions, evaluates responses dynamically, and delivers actionable real-time feedback using Google Gemini API.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Gemini API",
      "PostgreSQL",
      "Tailwind CSS",
      "Vercel"
    ],
    features: [
      "AI-generated, role-based technical interview questions tailored to specific engineering roles and seniority",
      "Real-time evaluation providing structured diagnostic feedback on candidate code and conceptual answers",
      "Integrated Google Gemini API via streaming prompts with structured JSON output constraints",
      "Persistent PostgreSQL relational database hosted and secured via Supabase auth and row-level policies",
      "Optimized, responsive frontend interface engineered for low latency during interview simulations",
      "Production deployment and continuous branch previews configured on Vercel"
    ],
    architecture: "Built with Next.js App Router and server actions for secure API communications. The frontend streams prompts to server endpoints that orchestrate structured Gemini interactions. Candidate profiles, sessions, and evaluation records are stored in PostgreSQL managed through Supabase with Row Level Security (RLS).",
    learnings: "Engineered structured output prompting strategies to prevent non-deterministic formatting failures in LLM evaluations, and handled asynchronous audio/text input pacing for a natural interview rhythm.",
    githubUrl: "https://github.com/VimarshS/intervu-ai.git",
    liveUrl: "https://intervu-ai-weld.vercel.app" 
  },
  {
    id: "notesgen-ai",
    title: "NotesGen AI",
    subtitle: "Intelligent Semantic Study Material Synthesizer",
    tagline: "React.js · Node.js · Express.js · MongoDB · OpenAI API",
    category: "AI & Web",
    mockupType: "notes",
    featured: true,
    summary: "An automated study companion that ingests raw, unstructured course material and generates concise, structured notes using NLP summarization and semantic concept extraction.",
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "OpenAI API",
      "REST APIs"
    ],
    features: [
      "Automated natural language text summarization for long-form educational transcripts and reading material",
      "Semantic key-concept extraction formatting complex paragraphs into hierarchical bullet points",
      "Converts raw, disorganized study inputs into review-ready markdown documents in seconds",
      "Dedicated Node.js and Express.js backend pipeline handling document ingestion, token counting, and API throttling",
      "MongoDB database persistence storing user notes, tags, and document histories"
    ],
    architecture: "Decoupled single-page React frontend consuming a Node.js/Express REST API backend. Long-form texts are parsed, tokenized, and processed through LLM endpoints with optimized system prompts, then cached and organized in MongoDB collections.",
    learnings: "Designed efficient text chunking mechanisms to process multi-page documents without exceeding model context windows, and built clean client-side formatting for parsed output.",
    liveUrl: "https://notes-gen-ai-puce.vercel.app/",
    githubUrl: "https://github.com/VimarshS/NotesGenAI.git"
  },
  {
    id: "realtime-chat",
    title: "Real-Time Chat Application",
    subtitle: "Low-Latency WebSocket Messaging Architecture",
    tagline: "React.js · Node.js · Express.js · MongoDB · WebSockets",
    category: "Real-Time & WebSockets",
    mockupType: "chat",
    featured: true,
    summary: "A responsive full-stack messaging platform featuring instant bi-directional message dispatch, persistent message histories, user authentication, and Cloudinary media sharing.",
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "WebSockets",
      "Cloudinary",
      "JWT"
    ],
    features: [
      "Full-duplex real-time communication via WebSockets for zero-refresh instant chat updates",
      "Persistent chat history and user session records stored securely in MongoDB",
      "Stateless JWT token authentication with protected routes and identity verification",
      "Integrated Cloudinary cloud storage for seamless image and media attachment delivery",
      "Real-time online presence tracking, responsive UI layouts, and typing activity cues"
    ],
    architecture: "React client connected via WebSocket protocols to an Express.js backend server. The server broadcasts incoming messages to active room subscribers while asynchronously writing payload records to MongoDB. Media uploads stream directly to Cloudinary with secure asset URLs stored in database documents.",
    learnings: "Mastered connection state management and optimistic UI updates, ensuring message bubbles render instantly in the UI with graceful rollback if the socket connection encounters latency.",
    githubUrl: "https://github.com/VimarshS/chat-app.git",
    liveUrl: "https://chat-app-pink-eta-53.vercel.app"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Programming",
    description: "Core programming languages utilized for system architecture and algorithmic solutions",
    skills: [
      { name: "Java", description: "Object-oriented architecture, multi-threading, and robust algorithmic problem solving" },
      { name: "JavaScript", description: "Modern ES6+, asynchronous promises, closures, and browser APIs" },
      { name: "SQL", description: "Relational queries, table normalization, joins, and data integrity constraints" }
    ]
  },
  {
    category: "Web Development",
    description: "Full-stack web technologies for building responsive interfaces and robust backend APIs",
    skills: [
      { name: "React.js", description: "Component lifecycle, state management, hooks, and responsive dynamic interfaces" },
      { name: "Node.js", description: "Asynchronous runtime, event-driven I/O, and server-side logic" },
      { name: "Express.js", description: "RESTful API middleware, request routing, error handlers, and authentication" },
      { name: "Tailwind CSS", description: "Utility-first design systems, responsive layouts, and performance optimization" },
      { name: "REST APIs", description: "HTTP verb semantics, status codes, JSON payload design, and endpoint security" }
    ]
  },
  {
    category: "Databases & Cloud",
    description: "Data persistence engines and modern cloud infrastructure platforms",
    skills: [
      { name: "MongoDB", description: "Document data modeling, aggregation pipelines, and NoSQL schema design" },
      { name: "PostgreSQL", description: "Relational schema design, indexes, foreign key constraints, and ACID transactions" },
      { name: "Supabase", description: "Postgres database hosting, automated REST APIs, and auth row-level security" },
      { name: "Vercel", description: "Edge hosting, continuous Git-driven deployment pipelines, and preview domains" },
      { name: "Docker", description: "Containerized application runtime, environment isolation, and Dockerfiles" }
    ]
  },
  {
    category: "Core Computer Science",
    description: "Academic foundational principles governing computing systems and software design",
    skills: [
      { name: "Data Structures & Algorithms", description: "Arrays, trees, graphs, dynamic programming, and complexity analysis (Big-O)" },
      { name: "Object-Oriented Programming", description: "Encapsulation, inheritance, polymorphism, and abstraction design patterns" },
      { name: "DBMS", description: "Transaction management, concurrency control, ACID properties, and relational algebra" },
      { name: "Operating Systems", description: "Process scheduling, thread concurrency, virtual memory, and file subsystems" },
      { name: "Computer Networks", description: "TCP/IP protocol suite, HTTP/HTTPS, WebSockets, DNS, and OSI reference model" }
    ]
  },
  {
    category: "Tools & Methodologies",
    description: "Version control, workflow practices, and development ecosystem utilities",
    skills: [
      { name: "Git", description: "Distributed branch management, rebasing, merge conflict resolution, and commits" },
      { name: "GitHub", description: "Pull request code reviews, issue tracking, and repository governance" },
      { name: "CI/CD", description: "Automated test runs, build verification, and deployment workflows" },
      { name: "Postman", description: "Endpoint debugging, integration testing, and API documentation validation" },
      { name: "Agile / Scrum", description: "Iterative sprints, sprint standups, backlog grooming, and incremental shipping" },
      { name: "JWT Authentication", description: "Stateless security tokens, claim payload signing, and refresh token flows" }
    ]
  }
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    role: "Full Stack Web Development Intern",
    company: "Unified Mentor",
    programType: "Training & Project Program",
    period: "Aug 2025 – Nov 2025",
    location: "Remote",
    type: "Internship",
    summary: "Participated in an intensive hands-on full-stack development internship focusing on production MERN engineering, scalable RESTful API design, and disciplined software development practices.",
    bulletPoints: [
      "Engineered 3 full-stack web applications from concept to deployment using the MERN stack (MongoDB, Express.js, React.js, Node.js).",
      "Developed and integrated 5+ RESTful APIs with strict request validation, structured error handling, and clean JSON payloads.",
      "Implemented stateless JWT authentication and role-based authorization to secure private application routes and sensitive data.",
      "Maintained professional Git/GitHub version control workflows, disciplined code organization, debugging, and deployment configurations."
    ],
    skills: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT", "REST APIs", "Git", "GitHub"]
  }
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "sih-2024",
    title: "Smart India Hackathon 2024",
    metric: "3rd Place",
    metricLabel: "Out of 20+ Teams",
    subtitle: "36-Hour Continuous Sprint",
    description: "Collaborated under intense high-pressure constraints to deliver a complete, functioning software prototype within 36 hours. Evaluated by industry judges and secured 3rd position among 20+ competing university teams.",
    year: "2024",
    badge: "Hackathon Finalist"
  },
  {
    id: "leetcode-dsa",
    title: "Algorithmic Problem Solving",
    metric: "250+",
    metricLabel: "Problems Solved",
    subtitle: "LeetCode & Competitive Platforms",
    description: "Consistent problem solving demonstrating deep theoretical and practical mastery across arrays, strings, trees, graphs, two-pointer techniques, and dynamic programming.",
    year: "2024 – Present",
    badge: "Problem Solving"
  }
];

export const EDUCATION: EducationItem = {
  degree: "B.Tech in Computer Science and Engineering",
  institution: "Shri Ramswaroop Memorial University",
  location: "Lucknow, India",
  period: "Aug 2023 – May 2027",
  status: "Undergraduate Candidate",
  coursework: [
    "Data Structures & Algorithms",
    "Operating Systems",
    "Database Management Systems (DBMS)",
    "Computer Networks",
    "Object-Oriented Programming (OOP)"
  ]
};
