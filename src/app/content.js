// Reading plans. Readings are original Mindleaf writing based on each book's ideas,
// never text copied from the book. Days without `reading` are still being written.
import { BOOKS } from '../data.js'

const atomicDays = [
  {
    title: 'Tiny changes add up',
    part: 'Part 1 · Why small habits matter',
    reading: [
      'Big goals feel exciting and then fade. Small changes feel almost pointless, so we skip them. That is the trap: the results of a small habit are invisible at first, and then very hard to ignore.',
      'Think of a habit as interest on your time. Getting one per cent better at something each day barely shows this week. Over a year it changes who you are.',
      'The same maths works against you. A small bad habit, repeated, compounds just as quietly.',
    ],
    idea: 'Care less about how big the step is, and more about whether you take it every day.',
    actions: ['Pick one habit you want to build this month.', 'Shrink it until it takes under two minutes.', 'Do the two-minute version today.'],
    question: 'Which small thing, repeated every day for a year, would change your life the most?',
  },
  {
    title: 'Become the person first',
    part: 'Part 1 · Why small habits matter',
    reading: [
      'Most of us start with the outcome: lose weight, save money, finish a book. A steadier place to start is identity. Instead of “I want to read more”, try “I am a reader”.',
      'Every time you act like that person, you cast a small vote for them. One vote doesn’t decide anything, but they add up, and your behaviour starts to feel natural rather than forced.',
    ],
    idea: 'Decide who you want to be, then prove it to yourself with small wins.',
    actions: ['Finish the sentence “I am the kind of person who…”.', 'Do one small thing today that person would do.', 'Notice how it felt afterwards.'],
    question: 'Who do you want to become, and what would that person do today?',
  },
  {
    title: 'The four steps of a habit',
    part: 'Part 1 · Why small habits matter',
    reading: [
      'Every habit runs on a loop. Something catches your attention (the cue). You feel a pull towards a result (the craving). You act (the response). You get something out of it (the reward).',
      'Once you can see the loop, you can change any part of it. Want a good habit? Make the cue obvious and the reward satisfying. Want to drop one? Hide the cue and make the reward less appealing.',
    ],
    idea: 'You don’t need more willpower. You need to understand the loop you’re in.',
    actions: ['Pick one habit you want to drop.', 'Write down its cue, craving, response and reward.', 'Circle the step that looks easiest to change.'],
    question: 'What reward are you really getting from a habit you want to drop?',
  },
  {
    title: 'The cue comes first',
    part: 'Part 2 · Make it obvious',
    reading: [
      'Every habit starts with something you notice. A phone on the table, a smell from the kitchen, the time on the clock. Before you can change what you do, you have to see what prompts it.',
      'Most cues work quietly. You don’t decide to scroll; the phone is simply there, and your hand reaches for it. The same is true of the good habits you want: if the book is on a shelf in another room, you won’t pick it up.',
      'So start by looking. Walk through your home and notice what each space invites you to do. Then change one thing. Put the book on your pillow. Move the phone charger to the kitchen.',
    ],
    idea: 'Make the good cues easy to see. Hide the ones that pull you off course.',
    actions: ['Notice three things at home that set off habits you want to drop.', 'Put the book you want to read on your pillow tonight.', 'Move one distraction out of sight before tomorrow.'],
    question: 'What sets off the habit you most want to change?',
  },
  {
    title: 'Stack it on what you already do',
    part: 'Part 2 · Make it obvious',
    reading: [
      'New habits stick better when they hang on old ones. You already brush your teeth, make tea and lock the door every day without thinking. Those moments are hooks.',
      'Use a simple sentence: “After I [current habit], I will [new habit].” After I pour my morning tea, I will read one page. The old habit becomes the reminder, so you don’t have to remember.',
    ],
    idea: 'Tie the new habit to something you already do without thinking.',
    actions: ['List five things you do every morning without fail.', 'Write one “After I…, I will…” sentence.', 'Try it tomorrow morning.'],
    question: 'Which part of your day already runs on autopilot, and what could you attach to it?',
  },
  { title: 'Design your space', part: 'Part 2 · Make it obvious' },
  { title: 'Make it attractive', part: 'Part 2 · Make it attractive' },
  { title: 'Join people who already do it', part: 'Part 2 · Make it attractive' },
  { title: 'Make it easy', part: 'Part 3 · Make it easy' },
  { title: 'The two-minute rule', part: 'Part 3 · Make it easy' },
  { title: 'Make it satisfying', part: 'Part 3 · Make it satisfying' },
  { title: 'Never miss twice', part: 'Part 3 · Make it satisfying' },
  { title: 'When motivation fades', part: 'Part 3 · Keep going' },
  { title: 'Look back, look ahead', part: 'Part 3 · Keep going' },
]

export const PLANS = {
  atomic: { ...BOOKS.find((b) => b.id === 'atomic'), days: atomicDays.length, dayList: atomicDays, available: true, about: 'Small habits, repeated daily, quietly shape who you become. Over fourteen mornings this plan walks through the book’s main ideas and turns each one into something you can try the same day.' },
}
for (const b of BOOKS) if (!PLANS[b.id]) PLANS[b.id] = { ...b, dayList: [], available: false }

export const planFor = (id) => PLANS[id] ?? PLANS.atomic
export const dayOf = (planId, n) => planFor(planId).dayList[n - 1] ?? null
