export type MentzerExercise = {
  name: string;
  sets: string;
  reps: string;
  restSec: number;
  note?: string;
};

export type MentzerDay = {
  id: string;
  dayNum: number;
  title: string;
  focus: string;
  restNote: string;
  superset?: string;
  isRest?: boolean;
  exercises: MentzerExercise[];
};

const CHEST_BACK: MentzerExercise[] = [
  { name: 'Incline Barbell Press', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Nautilus/Machine Flye', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Pullovers (Nautilus/DB)', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Wide-Grip Pulldown/Pull-Up', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'T-Bar Row or Seated Row', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
];

const LEGS: MentzerExercise[] = [
  { name: 'Leg Extension', sets: '1', reps: '10-15', restSec: 240, note: 'Pre-exhaust, to failure' },
  { name: 'Leg Press or Squat', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Leg Curl', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Standing/Seated Calf Raise', sets: '1', reps: '8-12', restSec: 150, note: 'To failure' },
];

const SHOULDERS_ARMS: MentzerExercise[] = [
  { name: 'Nautilus/Machine Lateral Raise', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Overhead Press (machine or barbell)', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Barbell or Machine Curl', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Close-Grip Bench or Dip', sets: '1', reps: '6-10', restSec: 240, note: 'To failure' },
  { name: 'Triceps Pressdown', sets: '1', reps: '6-10', restSec: 150, note: 'To failure' },
];

export const MENTZER_SPLIT: MentzerDay[] = [
  {
    id: 'day-1',
    dayNum: 1,
    title: 'Chest & Back',
    focus: 'One all-out working set per exercise, to failure',
    restNote: '3-5 min — full recovery needed for max effort',
    superset: 'Mentzer-style: warm up light, then a single brutal working set taken to failure — a spotter for forced reps is optional, only with a trained partner.',
    exercises: CHEST_BACK,
  },
  {
    id: 'day-2',
    dayNum: 2,
    title: 'Rest',
    focus: 'Full rest',
    restNote: '4-7 days between sessions for the same muscle group',
    isRest: true,
    exercises: [],
  },
  {
    id: 'day-3',
    dayNum: 3,
    title: 'Rest',
    focus: 'Full rest',
    restNote: '4-7 days between sessions for the same muscle group',
    isRest: true,
    exercises: [],
  },
  {
    id: 'day-4',
    dayNum: 4,
    title: 'Legs',
    focus: 'Pre-exhaust quads, then compound finish',
    restNote: '3-5 min — full recovery needed for max effort',
    superset: 'Pre-exhaust method: leg extension (isolation) immediately before leg press/squat (compound) to fatigue the quads directly.',
    exercises: LEGS,
  },
  {
    id: 'day-5',
    dayNum: 5,
    title: 'Rest',
    focus: 'Full rest',
    restNote: '4-7 days between sessions for the same muscle group',
    isRest: true,
    exercises: [],
  },
  {
    id: 'day-6',
    dayNum: 6,
    title: 'Shoulders & Arms',
    focus: 'One all-out working set per exercise, to failure',
    restNote: '3-5 min — full recovery needed for max effort',
    exercises: SHOULDERS_ARMS,
  },
  {
    id: 'day-7',
    dayNum: 7,
    title: 'Rest',
    focus: 'Full rest or light active recovery',
    restNote: 'Recovery capacity, not training stimulus, is the real limiter on growth',
    isRest: true,
    exercises: [],
  },
];

export const MENTZER_NOTES = [
  'Low volume, low frequency, taken to absolute muscular failure — the opposite philosophy of high-volume splits.',
  'Each muscle group is trained once every 4-7 days; this is not a fixed repeating week, base the next session on recovery, not the calendar.',
  'Warm-up sets are light and do not count toward failure — only the single working set per exercise is taken to true muscular failure.',
  'Forced reps or a spotter pushing 2-3 reps past failure is an advanced technique — only attempt with a trained spotter.',
  'Rest is the core growth mechanism here: some Heavy Duty cycles stretch to one full-body workout every 4-7 days.',
];
