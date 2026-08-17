export type IronLesson = {
  id: string;
  tag: string;
  title: string;
  body: string;
};

export const IRON_LESSONS: IronLesson[] = [
  {
    id: 'drop-set',
    tag: 'Technique',
    title: 'The Drop Set',
    body: 'Perform an exercise to muscular failure, then immediately reduce the weight by 20-30% and continue to failure again. A brutal mechanism for forcing hypertrophy by recruiting dormant muscle fibers.',
  },
  {
    id: 'progressive-overload',
    tag: 'Principle',
    title: 'Progressive Overload',
    body: 'Muscle only grows when forced to adapt. Add weight, reps, or sets every 1-2 weeks — even small increments compound into serious gains over months.',
  },
  {
    id: 'mind-muscle',
    tag: 'Technique',
    title: 'Mind-Muscle Connection',
    body: 'Slow down and consciously focus on the target muscle contracting through the full range of motion. Studies show this measurably increases activation versus lifting on autopilot.',
  },
  {
    id: 'time-under-tension',
    tag: 'Principle',
    title: 'Time Under Tension',
    body: 'Slowing the eccentric (lowering) phase to 3-4 seconds increases total tension on the muscle fiber, driving more micro-damage and growth than fast, momentum-driven reps.',
  },
  {
    id: 'forced-reps',
    tag: 'Technique',
    title: 'Forced Reps',
    body: 'Once you hit true failure, a spotter assists with just enough help to grind out 2-3 extra reps. Push past your natural limit — used sparingly, on your last set only.',
  },
  {
    id: 'supersets',
    tag: 'Technique',
    title: 'Antagonist Supersets',
    body: 'Pair opposing muscle groups back-to-back with no rest — like chest and back — the way Arnold trained. Keeps intensity high and cuts workout time without sacrificing volume.',
  },
  {
    id: 'deload',
    tag: 'Principle',
    title: 'The Deload Week',
    body: "Every 6-8 weeks, cut volume by ~40% for one week. It feels like a step back, but it lets connective tissue and the nervous system catch up so you can keep progressing injury-free.",
  },
  {
    id: 'rest-pause',
    tag: 'Technique',
    title: 'Rest-Pause Training',
    body: 'Hit failure, rest just 10-15 seconds, then squeeze out a few more reps at the same weight. Repeat 2-3 times to turn one set into a brutal extended set for maximum fiber recruitment.',
  },
  {
    id: 'full-range',
    tag: 'Principle',
    title: 'Full Range of Motion',
    body: 'Partial reps let you lift more weight, but full stretch-to-contraction range builds more muscle and mobility. Chase the deepest safe range before you chase heavier plates.',
  },
  {
    id: 'pre-exhaust',
    tag: 'Technique',
    title: 'Pre-Exhaustion',
    body: "Fatigue a target muscle with an isolation move (like a leg extension) right before a compound lift (like a squat) so the weaker link doesn't limit how hard the target muscle works.",
  },
];

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getTodaysLesson(): IronLesson {
  const index = dayOfYear(new Date()) % IRON_LESSONS.length;
  return IRON_LESSONS[index];
}
