export type PPLExercise = {
  name: string;
  sets: string;
  reps: string;
  restSec: number;
  badge?: string;
};

export type PPLDay = {
  id: string;
  dayNum: string;
  title: string;
  subtitle: string;
  restNote: string;
  isRest?: boolean;
  exercises: PPLExercise[];
};

export const PPL_NOTES = [
  'Progressive Overload: Add weight or reps weekly once you complete the top rep range with strict form.',
  'Warm-ups: Do 2–3 ramp-up sets before your first heavy compound movement (not counted in working sets).',
  'Volume Distribution: High frequency 6-day rotation hits each muscle twice weekly with manageable per-session fatigue.',
  '4-Day Rolling Option: Can also be executed on a rolling Push → Pull → Legs → Rest cycle for more rest days.',
];

export const PPL_SPLIT: PPLDay[] = [
  {
    id: 'push1',
    dayNum: 'DAY 1',
    title: 'PUSH (Chest, Shoulders, Triceps)',
    subtitle: 'Heavy Compound Focus',
    restNote: 'Rest: 90–120 sec (compound), 45–60 sec (isolation)',
    exercises: [
      { name: 'Barbell Bench Press', restSec: 120, sets: '4 SETS', reps: '6-10 REPS', badge: 'Warmup Reqd' },
      { name: 'Overhead Barbell Press', restSec: 120, sets: '4 SETS', reps: '6-10 REPS', badge: 'Heavy Compound' },
      { name: 'Incline Dumbbell Press', restSec: 90, sets: '3 SETS', reps: '8-12 REPS' },
      { name: 'Lateral Raise', restSec: 60, sets: '4 SETS', reps: '12-15 REPS' },
      { name: 'Dips (Triceps Focus)', restSec: 90, sets: '3 SETS', reps: '8-12 REPS' },
      { name: 'Cable Fly', restSec: 60, sets: '3 SETS', reps: '12-15 REPS' },
      { name: 'Overhead Tricep Extension', restSec: 60, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Tricep Pushdown', restSec: 45, sets: '3 SETS', reps: '12-15 REPS' },
    ],
  },
  {
    id: 'pull1',
    dayNum: 'DAY 2',
    title: 'PULL (Back, Biceps, Rear Delts)',
    subtitle: 'Back Thickness & Biceps',
    restNote: 'Rest: 90–150 sec (compound), 45–75 sec (isolation)',
    exercises: [
      { name: 'Deadlift', restSec: 150, sets: '3 SETS', reps: '5-8 REPS', badge: 'Day 2 Only' },
      { name: 'Pull-Ups / Lat Pulldown', restSec: 120, sets: '4 SETS', reps: '6-10 REPS' },
      { name: 'Barbell Row', restSec: 120, sets: '4 SETS', reps: '8-12 REPS' },
      { name: 'Seated Cable Row', restSec: 90, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Rear Delt Fly', restSec: 60, sets: '3 SETS', reps: '12-15 REPS' },
      { name: 'Barbell Curl', restSec: 75, sets: '3 SETS', reps: '8-12 REPS' },
      { name: 'Hammer Curl', restSec: 60, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Face Pull', restSec: 45, sets: '3 SETS', reps: '12-15 REPS' },
    ],
  },
  {
    id: 'legs1',
    dayNum: 'DAY 3',
    title: 'LEGS (Quads, Hamstrings, Calves)',
    subtitle: 'Lower Body Heavy Hypertrophy',
    restNote: 'Rest: 90–150 sec (compound), 60–90 sec (isolation)',
    exercises: [
      { name: 'Barbell Back Squat', restSec: 150, sets: '4 SETS', reps: '6-10 REPS', badge: 'Warmup Reqd' },
      { name: 'Romanian Deadlift', restSec: 120, sets: '4 SETS', reps: '8-10 REPS' },
      { name: 'Leg Press', restSec: 120, sets: '3 SETS', reps: '10-15 REPS' },
      { name: 'Walking Lunges', restSec: 90, sets: '3 SETS', reps: '12 REPS', badge: 'Each Leg' },
      { name: 'Leg Curl', restSec: 90, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Leg Extension', restSec: 60, sets: '3 SETS', reps: '12-15 REPS' },
      { name: 'Standing Calf Raise', restSec: 60, sets: '4 SETS', reps: '12-20 REPS' },
      { name: 'Seated Calf Raise', restSec: 45, sets: '3 SETS', reps: '15-20 REPS' },
    ],
  },
  {
    id: 'push2',
    dayNum: 'DAY 4',
    title: 'PUSH (Chest, Shoulders, Triceps)',
    subtitle: 'Incline & Hypertrophy Focus',
    restNote: 'Rest: 90–120 sec (compound), 45–60 sec (isolation)',
    exercises: [
      { name: 'Incline Barbell Press', restSec: 120, sets: '4 SETS', reps: '8-10 REPS' },
      { name: 'Dumbbell Shoulder Press', restSec: 90, sets: '4 SETS', reps: '8-12 REPS' },
      { name: 'Flat Dumbbell Press', restSec: 90, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Cable Lateral Raise', restSec: 60, sets: '4 SETS', reps: '12-15 REPS' },
      { name: 'Skullcrushers', restSec: 75, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Pec Deck Fly', restSec: 60, sets: '3 SETS', reps: '12-15 REPS' },
      { name: 'Tricep Rope Pushdown', restSec: 45, sets: '3 SETS', reps: '12-15 REPS' },
    ],
  },
  {
    id: 'pull2',
    dayNum: 'DAY 5',
    title: 'PULL (Back, Biceps, Rear Delts)',
    subtitle: 'Lat Width & Arm Detail',
    restNote: 'Rest: 90–120 sec (compound), 45–60 sec (isolation)',
    exercises: [
      { name: 'Lat Pulldown', restSec: 120, sets: '4 SETS', reps: '8-12 REPS' },
      { name: 'Single-Arm Dumbbell Row', restSec: 90, sets: '4 SETS', reps: '8-12 REPS' },
      { name: 'Incline Dumbbell Row', restSec: 90, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Face Pull', restSec: 45, sets: '3 SETS', reps: '12-15 REPS' },
      { name: 'Incline Dumbbell Curl', restSec: 60, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Preacher Curl', restSec: 60, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Reverse Grip Curl', restSec: 45, sets: '3 SETS', reps: '12-15 REPS' },
    ],
  },
  {
    id: 'legs2',
    dayNum: 'DAY 6',
    title: 'LEGS (Quads, Hamstrings, Calves)',
    subtitle: 'Posterior Chain & Unilateral',
    restNote: 'Rest: 90–120 sec (compound), 60–90 sec (isolation)',
    exercises: [
      { name: 'Front Squat', restSec: 120, sets: '4 SETS', reps: '8-10 REPS' },
      { name: 'Lying Leg Curl', restSec: 90, sets: '4 SETS', reps: '10-12 REPS' },
      { name: 'Bulgarian Split Squat', restSec: 90, sets: '3 SETS', reps: '10-12 REPS', badge: 'Each Leg' },
      { name: 'Dumbbell Romanian Deadlift', restSec: 90, sets: '3 SETS', reps: '10-12 REPS' },
      { name: 'Leg Extension', restSec: 60, sets: '3 SETS', reps: '12-15 REPS' },
      { name: 'Standing Calf Raise', restSec: 60, sets: '4 SETS', reps: '15-20 REPS' },
    ],
  },
  {
    id: 'rest',
    dayNum: 'DAY 7',
    title: 'REST & RECOVERY',
    subtitle: 'Full Rest or Active Mobility',
    restNote: 'Focus on sleep, hydration & nutrition',
    isRest: true,
    exercises: [],
  },
];
