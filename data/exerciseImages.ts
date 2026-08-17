// Real gym/exercise photography, matched to each movement by keyword.
// Falls back to a generic gym training photo for anything unmapped.
const FALLBACK = 'https://images.pexels.com/photos/29825221/pexels-photo-29825221.jpeg';

const EXERCISE_IMAGES: { keywords: string[]; url: string }[] = [
  { keywords: ['bench press', 'chest press', 'incline dumbbell press', 'flat dumbbell press', 'incline barbell press'], url: 'https://images.pexels.com/photos/3837743/pexels-photo-3837743.jpeg' },
  { keywords: ['squat'], url: 'https://images.pexels.com/photos/4853693/pexels-photo-4853693.jpeg' },
  { keywords: ['deadlift'], url: 'https://images.pexels.com/photos/20817818/pexels-photo-20817818.jpeg' },
  { keywords: ['pull-up', 'pull up', 'pullup', 'chin-up'], url: 'https://images.pexels.com/photos/8520197/pexels-photo-8520197.jpeg' },
  { keywords: ['overhead press', 'shoulder press', 'military press'], url: 'https://images.pexels.com/photos/7289370/pexels-photo-7289370.jpeg' },
  { keywords: ['lat pulldown', 'straight-arm pulldown'], url: 'https://images.pexels.com/photos/30165244/pexels-photo-30165244.jpeg' },
  { keywords: ['leg press'], url: 'https://images.pexels.com/photos/18060020/pexels-photo-18060020.jpeg' },
  { keywords: ['row'], url: 'https://images.pexels.com/photos/29825221/pexels-photo-29825221.jpeg' },
];

export function getExerciseImage(name: string): string {
  const lower = name.toLowerCase();
  const match = EXERCISE_IMAGES.find((entry) => entry.keywords.some((kw) => lower.includes(kw)));
  return match ? match.url : FALLBACK;
}
