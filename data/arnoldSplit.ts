export type ArnoldExercise = {
  name: string;
  sets: string;
  reps: string;
  restSec: number;
  note?: string;
};

export type ArnoldDay = {
  id: string;
  dayNum: number;
  title: string;
  focus: string;
  restNote: string;
  superset?: string;
  isRest?: boolean;
  exercises: ArnoldExercise[];
};

const CHEST_BACK_BASE: ArnoldExercise[] = [
  { name: 'Barbell Bench Press', sets: '4', reps: '8-12', restSec: 120 },
  { name: 'Pull-Ups (or Lat Pulldown)', sets: '4', reps: '8-12', restSec: 120 },
  { name: 'Incline Dumbbell Press', sets: '4', reps: '8-12', restSec: 90 },
  { name: 'Bent-Over Barbell Row', sets: '4', reps: '8-12', restSec: 120 },
  { name: 'Flat Dumbbell Fly', sets: '3', reps: '10-12', restSec: 60 },
  { name: 'Seated Cable Row', sets: '3', reps: '10-12', restSec: 90 },
  { name: 'Dips (chest-focused lean)', sets: '3', reps: '8-12', restSec: 90 },
  { name: 'Straight-Arm Pulldown', sets: '3', reps: '10-15', restSec: 60 },
  { name: 'Cable Crossover', sets: '3', reps: '12-15', restSec: 60 },
];

const SHOULDERS_ARMS: ArnoldExercise[] = [
  { name: 'Barbell Overhead Press', sets: '4', reps: '8-12', restSec: 120 },
  { name: 'Lateral Raise', sets: '4', reps: '10-15', restSec: 60 },
  { name: 'Bent-Over Rear Delt Fly', sets: '3', reps: '10-15', restSec: 60 },
  { name: 'Upright Row', sets: '3', reps: '10-12', restSec: 75 },
  { name: 'Barbell Curl', sets: '4', reps: '8-12', restSec: 75 },
  { name: 'Close-Grip Bench Press', sets: '4', reps: '8-12', restSec: 90 },
  { name: 'Incline Dumbbell Curl', sets: '3', reps: '10-12', restSec: 60 },
  { name: 'Overhead Tricep Extension', sets: '3', reps: '10-12', restSec: 60 },
  { name: 'Preacher Curl', sets: '3', reps: '10-12', restSec: 60 },
  { name: 'Cable Tricep Pushdown', sets: '3', reps: '12-15', restSec: 45 },
];

const LEGS: ArnoldExercise[] = [
  { name: 'Barbell Back Squat', sets: '4', reps: '8-12', restSec: 150 },
  { name: 'Leg Press', sets: '4', reps: '10-15', restSec: 120 },
  { name: 'Walking Lunges', sets: '3', reps: '12 (ea. leg)', restSec: 90 },
  { name: 'Leg Extension', sets: '3', reps: '12-15', restSec: 60 },
  { name: 'Leg Curl (hamstrings)', sets: '4', reps: '10-12', restSec: 90 },
  { name: 'Romanian Deadlift', sets: '3', reps: '10-12', restSec: 120 },
  { name: 'Standing Calf Raise', sets: '4', reps: '12-20', restSec: 60 },
  { name: 'Seated Calf Raise', sets: '3', reps: '15-20', restSec: 45 },
];

export const ARNOLD_SPLIT: ArnoldDay[] = [
  {
    id: 'day-1',
    dayNum: 1,
    title: 'Chest & Back',
    focus: 'High-frequency push/pull volume',
    restNote: '60-90s (chest) · 90-120s (back)',
    superset: "Arnold-style superset: pair chest + back exercises back-to-back, then rest at the end of the pair.",
    exercises: [
      ...CHEST_BACK_BASE,
      { name: 'Deadlift', sets: '3', reps: '6-8', restSec: 150, note: 'Day 1 only' },
    ],
  },
  {
    id: 'day-2',
    dayNum: 2,
    title: 'Shoulders & Arms',
    focus: 'Delts, biceps, triceps',
    restNote: '60-90s (shoulders) · 45-75s (arms)',
    exercises: SHOULDERS_ARMS,
  },
  {
    id: 'day-3',
    dayNum: 3,
    title: 'Legs',
    focus: 'Quads, hamstrings, calves',
    restNote: '90-150s (compound) · 60-90s (isolation)',
    exercises: LEGS,
  },
  {
    id: 'day-4',
    dayNum: 4,
    title: 'Chest & Back',
    focus: 'High-frequency push/pull volume',
    restNote: '60-90s (chest) · 90-120s (back)',
    superset: "Arnold-style superset: pair chest + back exercises back-to-back, then rest at the end of the pair.",
    exercises: CHEST_BACK_BASE,
  },
  {
    id: 'day-5',
    dayNum: 5,
    title: 'Shoulders & Arms',
    focus: 'Delts, biceps, triceps',
    restNote: '60-90s (shoulders) · 45-75s (arms)',
    exercises: SHOULDERS_ARMS,
  },
  {
    id: 'day-6',
    dayNum: 6,
    title: 'Legs',
    focus: 'Quads, hamstrings, calves',
    restNote: '90-150s (compound) · 60-90s (isolation)',
    exercises: LEGS,
  },
  {
    id: 'day-7',
    dayNum: 7,
    title: 'Rest',
    focus: 'Full rest or light active recovery',
    restNote: 'This is where growth happens',
    isRest: true,
    exercises: [],
  },
];

export const ARNOLD_NOTES = [
  'Progressive overload: add weight or reps every 1-2 weeks on compound lifts.',
  'Warm-up sets are not counted — do 2-3 light warm-up sets before the first heavy exercise per muscle group.',
  'High volume split — best suited for lifters with 1-2+ years of consistent training and solid recovery.',
  'Deload every 6-8 weeks: reduce sets by ~40% for one lighter week to manage fatigue.',
];
