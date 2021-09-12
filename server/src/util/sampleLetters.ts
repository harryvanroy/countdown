// distributions from http://www.thecountdownpage.com/letters.htm
const vowelDist = {
  a: 15,
  e: 21,
  i: 13,
  o: 13,
  u: 5
} as const

const vowelSamples = Object.entries(vowelDist).reduce((acc, [vowel, dist]) => {
  return [...acc, ...Array(dist).fill(vowel)]
}, [] as string[]);

const consDist = {
  b: 2,
  c: 3,
  d: 6,
  f: 2,
  g: 3,
  h: 2,
  j: 1,
  k: 1,
  l: 5,
  m: 4,
  n: 8,
  p: 4,
  q: 1,
  r: 9,
  s: 9,
  t: 9,
  v: 1,
  w: 1,
  x: 1,
  y: 1,
  z: 1
} as const

const consSamples = Object.entries(consDist).reduce((acc, [cons, dist]) => {
  return [...acc, ...Array(dist).fill(cons)]
}, [] as string[]);

export function sampleLetters(vowels: number, cons: number): string {
  let result = '';

  // get consonants
  for (let i = 0; i < cons; i++) {
    const idx = Math.floor(Math.random() * consSamples.length);
    result += consSamples[idx];
  }

  // get vowels
  for (let i = 0; i < vowels; i++) {
    const idx = Math.floor(Math.random() * vowelSamples.length);
    result += vowelSamples[idx];
  }

  // shuffle result
  const shuffled = result.split('').sort(() => 0.5 - Math.random()).join('')

  return shuffled
}