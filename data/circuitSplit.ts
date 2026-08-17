export type CircuitExercise = {
  name: string;
  sets: string;
  reps: string;
  restSec: number;
  note?: string;
};

export type CircuitDay = {
  id: string;
  dayNum: number;
  title: string;
  focus: string;
  restNote: string;
  superset?: string;
  isRest?: boolean;
  exercises: CircuitExercise[];
};

const WARM_UP: CircuitExercise[] = [
  { name: 'Warm-Up: Light Cardio', sets: '1', reps: '3 min', restSec: 0, note: '(march in place / jumping jacks)' },
  { name: 'Warm-Up: Bodyweight Squat', sets: '1', reps: '10 reps', restSec: 0 },
  { name: 'Warm-Up: Arm Circles', sets: '1', reps: '10 each direction', restSec: 0 },
  { name: 'Warm-Up: Walking Lunges', sets: '1', reps: '5 each leg', restSec: 15 },
];

const CIRCUIT: CircuitExercise[] = [
  { name: 'Bodyweight Squat', sets: '3', reps: '12-15', restSec: 15, note: 'Chest up, full range of motion' },
  { name: 'Push-Ups (knees down if needed)', sets: '3', reps: '8-12', restSec: 15, note: 'Straight body line' },
  { name: 'Dumbbell Row (each arm)', sets: '3', reps: '10-12', restSec: 15, note: 'Controlled, squeeze at top' },
  { name: 'Glute Bridge', sets: '3', reps: '12-15', restSec: 15, note: 'Squeeze glutes at top' },
  { name: 'Standing Dumbbell Shoulder Press', sets: '3', reps: '10-12', restSec: 15, note: 'Light-moderate weight' },
  { name: 'Walking Lunges', sets: '3', reps: '10 each leg', restSec: 15, note: 'Controlled, knee tracks over toe' },
  { name: 'Plank', sets: '3', reps: '20-30 sec hold', restSec: 15, note: 'Core braced, straight line' },
  { name: 'Mountain Climbers', sets: '3', reps: '20 sec', restSec: 120, note: 'Moderate pace, controlled core — rest 90-120s here before the next round' },
];

export const CIRCUIT_SPLIT: CircuitDay[] = [
  {
    id: 'day-1',
    dayNum: 1,
    title: 'Full Body Circuit',
    focus: 'Monday — Conditioning & work capacity',
    restNote: '15-20s between exercises · 90-120s between rounds',
    superset: 'Warm up for 5-6 min, then run the 8-exercise circuit back-to-back for 3 full rounds. Same circuit every session — no A/B split to memorize.',
    exercises: [...WARM_UP, ...CIRCUIT],
  },
  {
    id: 'day-2',
    dayNum: 2,
    title: 'Rest / Active Recovery',
    focus: 'Tuesday — Recovery',
    restNote: 'Light walking or mobility work',
    isRest: true,
    exercises: [],
  },
  {
    id: 'day-3',
    dayNum: 3,
    title: 'Full Body Circuit',
    focus: 'Wednesday — Conditioning & work capacity',
    restNote: '15-20s between exercises · 90-120s between rounds',
    superset: 'Same warm-up and circuit as Day 1 — 3 full rounds.',
    exercises: [...WARM_UP, ...CIRCUIT],
  },
  {
    id: 'day-4',
    dayNum: 4,
    title: 'Rest / Active Recovery',
    focus: 'Thursday — Recovery',
    restNote: 'Light walking or mobility work',
    isRest: true,
    exercises: [],
  },
  {
    id: 'day-5',
    dayNum: 5,
    title: 'Full Body Circuit',
    focus: 'Friday — Conditioning & work capacity',
    restNote: '15-20s between exercises · 90-120s between rounds',
    superset: 'Same warm-up and circuit as Day 1 — 3 full rounds.',
    exercises: [...WARM_UP, ...CIRCUIT],
  },
  {
    id: 'day-6',
    dayNum: 6,
    title: 'Rest',
    focus: 'Saturday — Full rest',
    restNote: 'This is where you recover and adapt',
    isRest: true,
    exercises: [],
  },
  {
    id: 'day-7',
    dayNum: 7,
    title: 'Rest',
    focus: 'Sunday — Full rest',
    restNote: 'This is where you recover and adapt',
    isRest: true,
    exercises: [],
  },
];

export const CIRCUIT_NOTES = [
  'Non-consecutive training days (Mon/Wed/Fri) — this is a conditioning and fat-loss split, not a pure strength program.',
  'Progression Weeks 1-2: learn the movements, focus on form, use light weights, take the full 20 sec between exercises.',
  'Progression Weeks 3-4: trim transition rest to 10-15 sec to raise intensity — keep the weight the same.',
  'Progression Weeks 5-6: add a 4th round, or increase weight slightly on the strength moves (squat, row, press).',
  'Keep moving, but keep form — sloppy reps under fatigue is how beginners get hurt. Slow down rather than break form.',
  'Scale rest, not just reps — if round 3 form is falling apart, add 10-15 sec rest before the next exercise instead of pushing through bad reps.',
  'Hydrate between rounds — circuit training sweats more than straight-set strength work.',
  'Total session time: ~40-45 min (5-6 min warm-up, 3 rounds at ~8-10 min each with rest between, 5 min cool-down/stretch).',
];
