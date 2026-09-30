// Static content for the landing page. Covers from Open Library, photos from Unsplash.
const img = (p) => `${import.meta.env.BASE_URL}img/${p}`

export const COVERS = {
  atomic: img('covers/atomic-habits.jpg'),
  money: img('covers/psychology-of-money.jpg'),
  deep: img('covers/deep-work.jpg'),
  mindset: img('covers/mindset.jpg'),
  seven: img('covers/seven-habits.jpg'),
}

export const PHOTOS = {
  band: img('band.jpg'),
  am: img('am.jpg'),
  noon: img('noon.jpg'),
  pm: img('pm.jpg'),
}

// The first week of the Atomic Habits plan, shown fanned out in the hero.
export const PLAN_DAYS = [
  { day: 1, title: 'Tiny changes add up', state: 'done' },
  { day: 2, title: 'Become the person first', state: 'done' },
  { day: 3, title: 'The four steps of a habit', state: 'done' },
  { day: 4, title: 'The cue comes first', state: 'today' },
  { day: 5, title: 'Stack it on what you already do', state: 'next' },
  { day: 6, title: 'Design your space', state: 'next' },
  { day: 7, title: 'Make it attractive', state: 'next' },
]

export const PILE = [
  { title: 'The 7 Habits of Highly Effective People', note: 'p. 101', bg: '#F1EFEA', ink: '#16181B', band: '#C23B22', width: 96, tilt: -1.5 },
  { title: 'Mindset', note: 'p. 12', bg: '#FFFFFF', ink: '#16181B', band: '#2BA6C4', width: 84, tilt: 2 },
  { title: 'Deep Work', note: 'the introduction', bg: '#F2B705', ink: '#16181B', band: '#16181B', width: 90, tilt: -2.5 },
  { title: 'The Psychology of Money', note: 'chapter 3', bg: '#1F4034', ink: '#F4F4F2', band: '#FF8A45', width: 88, tilt: 1 },
  { title: 'Atomic Habits', note: 'p. 43', bg: '#EDE9E0', ink: '#16181B', band: '#C9A56A', width: 80, tilt: -1 },
]

export const MOMENTS = [
  {
    id: 'morning',
    time: '7:30 AM',
    label: 'Morning',
    title: 'Read today’s page',
    body: 'One idea in about eight minutes. Read it in the app, or read the day’s pages in your own copy: paper, Kindle or audiobook.',
    photo: PHOTOS.am,
    photoAlt: 'Coffee steaming next to an open book on a window sill',
  },
  {
    id: 'midday',
    time: '1:00 PM',
    label: 'Midday',
    title: 'Try one small thing',
    body: 'Every reading ends with an action you can do before dinner. Small enough that it actually happens.',
    photo: PHOTOS.noon,
    photoAlt: 'A hand writing with a pencil in a spiral notebook',
  },
  {
    id: 'evening',
    time: '9:00 PM',
    label: 'Evening',
    title: 'Sit with a question',
    body: 'Write a line before bed. Your answers turn into a journal of what each book changed.',
    photo: PHOTOS.pm,
    photoAlt: 'A person writing in a small journal',
  },
]

export const BOOKS = [
  { id: 'atomic', title: 'Atomic Habits', author: 'James Clear', cover: COVERS.atomic, days: 14, mins: 8, topic: 'Habits' },
  { id: 'money', title: 'The Psychology of Money', author: 'Morgan Housel', cover: COVERS.money, days: 21, mins: 7, topic: 'Money' },
  { id: 'deep', title: 'Deep Work', author: 'Cal Newport', cover: COVERS.deep, days: 10, mins: 9, topic: 'Focus' },
  { id: 'mindset', title: 'Mindset', author: 'Carol S. Dweck', cover: COVERS.mindset, days: 12, mins: 8, topic: 'Mindset' },
  { id: 'seven', title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', cover: COVERS.seven, days: 30, mins: 9, topic: 'Habits' },
]

export const TOPICS = ['All', 'Habits', 'Money', 'Focus', 'Mindset']

export const CLUB_CHAT = [
  { who: 'Tobi', initials: 'TK', color: '#FF8A45', text: 'Moved my savings to an account I don’t see every day. Out of sight really works.', me: false },
  { who: 'Ada', initials: 'AO', color: '#7FB89D', text: 'Same idea as the Atomic Habits plan! Make the bad cue invisible.', me: false },
  { who: 'You', initials: 'ME', color: '#1F4034', text: 'Finally set up the automatic transfer. Day 9 done.', me: true },
]
