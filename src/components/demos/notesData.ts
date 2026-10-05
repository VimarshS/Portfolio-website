export interface NoteGroup {
  priority: 1 | 2 | 3;
  idea: string; // one sentence that explains the group
  points: string[];
  tip: string; // shown in "Exam Revision Mode"
  weight: number; // share of marks in percent, shown in the chart
}

export interface TopicNotes {
  key: string;
  title: string;
  keywords: string[]; // words that make the demo recognise the topic
  flow: string[]; // steps for the "Include Diagram" option
  groups: NoteGroup[];
  questions: string[];
}

export interface NoteOptions {
  examMode: boolean;
  diagram: boolean;
  charts: boolean;
}

// Three sample topics. The real app writes notes for any topic with AI.
export const TOPICS: TopicNotes[] = [
  {
    key: 'data-structures',
    title: 'Data Structures',
    keywords: ['data structure', 'stack', 'queue', 'linked list', 'array'],
    flow: ['Data Structures', 'Primitive / Non-primitive', 'Linear / Non-linear', 'Stack and Queue'],
    groups: [
      {
        priority: 1,
        idea: 'A data structure is a way of organizing data so it can be used efficiently.',
        points: [
          'Basic Definition of Data Structures',
          'Classification: Primitive vs Non-primitive',
          'Linear vs Non-linear Data Structures',
        ],
        tip: 'Learn one example of each type. Examiners often ask for the difference, with examples.',
        weight: 20,
      },
      {
        priority: 2,
        idea: 'Searching and sorting show how the choice of method changes speed.',
        points: [
          'Searching Algorithms: Linear and Binary Search',
          'Sorting Algorithms: Bubble and Insertion Sort',
          'Memory Allocation: Static vs Dynamic',
        ],
        tip: 'Binary search needs sorted data. Remember its time complexity: O(log n).',
        weight: 35,
      },
      {
        priority: 3,
        idea: 'Stacks and queues limit where items are added or removed.',
        points: [
          'Stack Operations: Push and Pop (LIFO)',
          'Queue Operations: Enqueue and Dequeue (FIFO)',
          'Applications of Stack and Queue',
        ],
        tip: 'Draw a small diagram of push and pop. It earns easy marks.',
        weight: 45,
      },
    ],
    questions: [
      'Differentiate between linear and non-linear data structures with examples.',
      'Explain binary search with an example. What is its time complexity?',
      'Write the steps of the push and pop operations on a stack.',
    ],
  },
  {
    key: 'photosynthesis',
    title: 'Photosynthesis',
    keywords: ['photosynth', 'chlorophyll', 'calvin'],
    flow: ['Sunlight + CO2 + H2O', 'Light reactions', 'Calvin cycle', 'Glucose + O2'],
    groups: [
      {
        priority: 1,
        idea: 'Photosynthesis is how green plants turn light energy into chemical energy.',
        points: [
          'Definition and overall equation',
          'Where it happens: chloroplast and chlorophyll',
          'Raw materials: carbon dioxide, water and sunlight',
        ],
        tip: 'Write the equation: 6CO2 + 6H2O + light gives C6H12O6 + 6O2.',
        weight: 25,
      },
      {
        priority: 2,
        idea: 'The light reactions capture energy, and the Calvin cycle uses it to build sugar.',
        points: [
          'Light-dependent reactions in the thylakoid',
          'Calvin cycle (light-independent) in the stroma',
          'ATP and NADPH as energy carriers',
        ],
        tip: 'The light reactions make ATP and NADPH. The Calvin cycle uses them to fix CO2.',
        weight: 45,
      },
      {
        priority: 3,
        idea: 'The rate of photosynthesis changes with the environment.',
        points: [
          'Limiting factors: light, CO2 and temperature',
          'Stomata and gas exchange',
          'Importance for oxygen and food chains',
        ],
        tip: 'Know the graph of rate against light intensity and where it levels off.',
        weight: 30,
      },
    ],
    questions: [
      'State the equation of photosynthesis and name where it takes place.',
      'Differentiate between light-dependent and light-independent reactions.',
      'Name three factors that limit the rate of photosynthesis.',
    ],
  },
  {
    key: 'newtons-laws',
    title: "Newton's Laws of Motion",
    keywords: ['newton', 'laws of motion', 'inertia', 'momentum'],
    flow: ['Force applied', 'Net force', 'Acceleration (F = ma)', 'Change in momentum'],
    groups: [
      {
        priority: 1,
        idea: 'Motion is explained by three simple laws.',
        points: [
          "Newton's first law: inertia",
          "Newton's second law: F = ma",
          "Newton's third law: action and reaction",
        ],
        tip: 'State each law in one clear sentence and give one everyday example.',
        weight: 40,
      },
      {
        priority: 2,
        idea: 'Force, mass and acceleration are linked by the second law.',
        points: [
          'Units: newton, kilogram, metre per second squared',
          'Weight vs mass',
          'Solving numericals with F = ma',
        ],
        tip: 'Write the formula, put in the values with units, then give the answer with its unit.',
        weight: 35,
      },
      {
        priority: 3,
        idea: 'Momentum connects the laws to collisions and recoil.',
        points: [
          'Momentum p = mv',
          'Conservation of momentum',
          'Applications: recoil of a gun, rocket propulsion',
        ],
        tip: 'Action and reaction act on different bodies, so they never cancel each other.',
        weight: 25,
      },
    ],
    questions: [
      "State Newton's second law and derive F = ma.",
      'Why do action and reaction forces not cancel each other?',
      'A 5 kg body accelerates at 2 m/s2. Find the force acting on it.',
    ],
  },
];

export function findTopic(input: string): TopicNotes | null {
  const text = input.toLowerCase();
  return TOPICS.find((t) => t.keywords.some((k) => text.includes(k))) ?? null;
}

export function buildMarkdown(
  notes: TopicNotes,
  meta: { level: string; exam: string } & NoteOptions
): string {
  const lines: string[] = [`# ${notes.title}`];

  const context = [meta.level, meta.exam].filter(Boolean).join(' - ');
  if (context) lines.push(`_${context}_`);
  lines.push('', '> Sample notes from the NotesGen AI portfolio demo.', '', '## Sub Topics');

  notes.groups.forEach((group) => {
    lines.push('', `### Priority ${'*'.repeat(group.priority)}`, group.idea, '');
    group.points.forEach((p) => lines.push(`- ${p}`));
    if (meta.examMode) lines.push('', `Exam tip: ${group.tip}`);
  });

  if (meta.diagram) {
    lines.push('', '## Concept flow', '', notes.flow.join(' -> '));
  }
  if (meta.charts) {
    lines.push('', '## Exam weightage', '');
    notes.groups.forEach((g) => lines.push(`- Priority ${g.priority}: ${g.weight}%`));
  }
  if (meta.examMode) {
    lines.push('', '## Likely questions', '');
    notes.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  }

  return lines.join('\n') + '\n';
}