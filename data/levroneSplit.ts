export type LevroneExercise = {
  name: string;
  sets: string;
  reps: string;
  restSec: number;
  note?: string;
};

export type LevroneDay = {
  id: string;
  dayNum: number;
  title: string;
  focus: string;
  restNote: string;
  superset?: string;
  isRest?: boolean;
  exercises: LevroneExercise[];
};

const CHEST: LevroneExercise[] = [
  { name: 'Barbell Bench Press', sets: '4-5', reps: '6-10', restSec: 120 },
  { name: 'Incline Barbell Press', sets: '4', reps: '8-10', restSec: 120 },
  { name: 'Incline Dumbbell Press', sets: '4', reps: '8-10', restSec: 90 },
  { name: 'Flat Dumbbell Flye', sets: '3-4', reps: '10-12', restSec: 75 },
  { name: 'Cable Crossover', sets: '3', reps: '12-15', restSec: 60 },
  { name: 'Weighted Dips', sets: '3', reps: '8-12', restSec: 90 },
];

const BACK: LevroneExercise[] = [
  { name: 'Deadlift', sets: '4', reps: '6-8', restSec: 180 },
  { name: 'Wide-Grip Pull-Up / Pulldown', sets: '4', reps: '8-12', restSec: 120 },
  { name: 'Bent-Over Barbell Row', sets: '4', reps: '8-10', restSec: 120 },
  { name: 'T-Bar Row', sets: '4', reps: '8-10', restSec: 90 },
  { name: 'Seated Cable Row', sets: '3', reps: '10-12', restSec: 90 },
  { name: 'Straight-Arm Pulldown', sets: '3', reps: '12-15', restSec: 60 },
];

const SHOULDERS: LevroneExercise[] = [
  { name: 'Seated Barbell Overhead Press', sets: '4', reps: '8-10', restSec: 120 },
  { name: 'Dumbbell Lateral Raise', sets: '4', reps: '10-15', restSec: 60 },
  { name: 'Bent-Over Rear Delt Fly', sets: '4', reps: '10-15', restSec: 60 },
  { name: 'Cable Lateral Raise', sets: '3', reps: '12-15', restSec: 60 },
  { name: 'Barbell Upright Row', sets: '3', reps: '10-12', restSec: 75 },
  { name: 'Shrugs (Barbell or Dumbbell)', sets: '4', reps: '10-15', restSec: 75 },
];

const LEGS: LevroneExercise[] = [
  { name: 'Barbell Back Squat', sets: '4-5', reps: '8-10', restSec: 150 },
  { name: 'Leg Press', sets: '4', reps: '10-15', restSec: 120 },
  { name: 'Walking Lunges', sets: '3', reps: '12 (each leg)', restSec: 90 },
  { name: 'Leg Extension', sets: '4', reps: '12-15', restSec: 60 },
  { name: 'Lying Leg Curl', sets: '4', reps: '10-12', restSec: 90 },
  { name: 'Standing Calf Raise', sets: '5', reps: '12-20', restSec: 60 },
  { name: 'Seated Calf Raise', sets: '3', reps: '15-20', restSec: 45 },
];

const ARMS: LevroneExercise[] = [
  { name: 'Barbell Curl', sets: '4', reps: '8-10', restSec: 75 },
  { name: 'Close-Grip Bench Press', sets: '4', reps: '8-10', restSec: 90 },
  { name: 'Incline Dumbbell Curl', sets: '3-4', reps: '10-12', restSec: 60 },
  { name: 'Overhead Cable Tricep Extension', sets: '3-4', reps: '10-12', restSec: 60 },
  { name: 'Preacher Curl', sets: '3', reps: '10-12', restSec: 60 },
  { name: 'Tricep Pushdown', sets: '3', reps: '12-15', restSec: 45 },
  { name: 'Hammer Curl', sets: '3', reps: '10-12', restSec: 60 },
];

export const LEVRONE_SPLIT: LevroneDay[] = [
  {
    id: 'day-1',
    dayNum: 1,
    title: 'Chest',
    focus: 'Heavy compounds into high-volume isolation',
    restNote: 'Rest: 90-120 sec (compound) · 60-90 sec (isolation)',
    exercises: CHEST,
  },
  {
    id: 'day-2',
    dayNum: 2,
    title: 'Back',
    focus: 'Thickness and width — heavy pulls first',
    restNote: 'Rest: 90-150 sec (heavy pulls) · 60-90 sec (isolation)',
    exercises: BACK,
  },
  {
    id: 'day-3',
    dayNum: 3,
    title: 'Shoulders',
    focus: 'Full delt development, strict form on isolation',
    restNote: 'Rest: 90-120 sec (compound) · 60 sec (isolation)',
    exercises: SHOULDERS,
  },
  {
    id: 'day-4',
    dayNum: 4,
    title: 'Legs',
    focus: 'Quad-dominant volume with posterior chain balance',
    restNote: 'Rest: 120-180 sec (compound) · 60-90 sec (isolation)',
    exercises: LEGS,
  },
  {
    id: 'day-5',
    dayNum: 5,
    title: 'Arms (Biceps + Triceps)',
    focus: 'Mind-muscle focus, paired biceps/triceps supersets',
    restNote: 'Rest: 60-90 sec throughout',
    exercises: ARMS,
  },
  {
    id: 'day-6',
    dayNum: 6,
    title: 'Rest / Light Cardio',
    focus: 'Light cardio (30-40 min moderate pace) or full rest',
    restNote: 'Depends on conditioning phase',
    isRest: true,
    exercises: [],
  },
  {
    id: 'day-7',
    dayNum: 7,
    title: 'Rest',
    focus: 'Full recovery',
    restNote: 'Sleep, hydration & nutrition',
    isRest: true,
    exercises: [],
  },
];

export const LEVRONE_NOTES = [
  'Heavy compound lifts form the foundation for each muscle group, followed by high-volume isolation work to finish it off.',
  'One muscle group per day (classic bro split) allows very high total volume per session without overlapping fatigue.',
  'Moderate rep ranges (6-12) on most lifts, favoring hypertrophy over pure strength or pure endurance.',
  'Known for intense mind-muscle focus and strict form on isolation movements despite lifting heavy overall.',
];
