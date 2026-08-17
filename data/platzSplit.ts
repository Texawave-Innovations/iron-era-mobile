export type PlatzExercise = {
  name: string;
  sets: string;
  reps: string;
  restSec: number;
  note?: string;
};

export type PlatzDay = {
  id: string;
  dayNum: number;
  title: string;
  focus: string;
  restNote: string;
  superset?: string;
  isRest?: boolean;
  exercises: PlatzExercise[];
};

const LEG_DAY: PlatzExercise[] = [
  { name: 'Barbell Back Squat (warm-up ramp)', sets: '4-5', reps: 'Ramping', restSec: 105, note: 'Progressively heavier to top working weight' },
  { name: 'Barbell Back Squat (working sets)', sets: '4-6', reps: '10-20+', restSec: 150, note: 'Full depth — some sets exceeded 20+ reps to failure' },
  { name: 'Front Squat', sets: '4', reps: '8-12', restSec: 120, note: 'Hits quads from a different angle' },
  { name: 'Leg Press', sets: '4', reps: '12-20', restSec: 90, note: 'High volume, controlled tempo' },
  { name: 'Hack Squat', sets: '4', reps: '10-15', restSec: 90 },
  { name: 'Leg Extension', sets: '4-5', reps: '15-20', restSec: 60, note: 'Often finished with a drop set or two' },
  { name: 'Lying/Seated Leg Curl', sets: '4', reps: '10-15', restSec: 75, note: 'Hamstring balance work' },
  { name: 'Stiff-Leg Deadlift', sets: '3', reps: '10-12', restSec: 90, note: 'Posterior chain' },
  { name: 'Standing Calf Raise', sets: '5', reps: '12-20', restSec: 60, note: 'Full stretch and contraction' },
  { name: 'Seated Calf Raise', sets: '4', reps: '15-20', restSec: 50 },
];

export const PLATZ_SPLIT: PlatzDay[] = [
  {
    id: 'day-1',
    dayNum: 1,
    title: 'Legs (Golden Eagle)',
    focus: 'Extreme depth, extreme volume, extreme reps',
    restNote: '2-3 min on squats · 60-90s on accessory work',
    superset: "Platz-style: full ass-to-grass depth on every squat rep, high-rep sets taken to failure, and isometric pauses at the bottom under load. Sessions run 60-90+ minutes.",
    exercises: LEG_DAY,
  },
  {
    id: 'day-2',
    dayNum: 2,
    title: 'Rest / Upper Body',
    focus: 'Recovery — legs trained once or twice per week',
    restNote: 'Legs need real recovery after this volume',
    isRest: true,
    exercises: [],
  },
];

export const PLATZ_NOTES = [
  'Historical reference, not beginner territory — this reflects one individual\'s extreme response to volume, not a universal program.',
  'Extreme-depth, high-rep-to-failure squats carry real injury risk — connective tissue and joints need years of progressive loading to tolerate this safely.',
  'Form breaks down badly under fatigue at high reps, which is where most squat injuries happen — do not replicate this without a strong technical squat base first.',
  'Build up to this volume and intensity gradually over time; do not attempt it cold.',
  'Isometric holds at the bottom of the squat increase time under tension and are a signature Platz technique for building mental toughness.',
];
