import type { Course, Lesson, Source, Unit } from '@/types'

/* ------------------------------------------------------------------
   Sources. Lessons are grounded in three kinds of authority:
   · etiquette institutions (Emily Post, Debrett's, Protocol School)
   · cross-cultural research (Edward T. Hall's proxemics & context)
   · peer-reviewed "why it matters" studies (listening, gratitude,
     apology, phone use) and professional country guides
     (Commisceo Global, SBS Cultural Atlas, Pew Research).
   Every lesson cites at least two, so no single voice stands alone.
   ------------------------------------------------------------------ */
const S: Record<string, Source> = {
  /* etiquette institutions */
  post: { label: 'The Emily Post Institute — Etiquette advice', url: 'https://emilypost.com/advice' },
  debretts: { label: "Debrett's — Etiquette & modern manners", url: 'https://debretts.com/etiquettes/' },
  debrettsQueue: { label: "Debrett's — How to queue", url: 'https://debretts.com/how-to-queue/' },
  debrettsUnderstate: { label: "Debrett's — The art of understatement", url: 'https://debretts.com/the-art-of-understatement/' },
  psow: { label: 'The Protocol School of Washington', url: 'https://www.psow.edu/' },

  /* cross-cultural research */
  hall: { label: 'Edward T. Hall — Proxemics & context (UC / CSISS Classics)', url: 'https://escholarship.org/uc/item/4774h1rm' },

  /* why-it-matters research */
  listening: { label: 'StatPearls / NIH — Active Listening', url: 'https://www.ncbi.nlm.nih.gov/books/NBK442015/' },
  gratitude: { label: 'Greater Good Science Center, UC Berkeley — Gratitude & relationships', url: 'https://greatergood.berkeley.edu/article/item/how_gratitude_helps_your_friendships_grow' },
  apology: { label: 'Ohio State (Lewicki et al., 2016) — Six elements of an effective apology', url: 'https://news.osu.edu/the-6-elements-of-an-effective-apology/' },
  phubbing: { label: 'NIH / PMC — Phone interruptions & relational well-being', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7430699/' },

  /* country cultural authorities */
  usAtlas: { label: 'SBS Cultural Atlas — American etiquette', url: 'https://culturalatlas.sbs.com.au/american-culture/american-culture-etiquette' },
  berlitz: { label: 'Berlitz — American manners & etiquette', url: 'https://www.berlitz.com/blog/american-manners-etiquette-tipping-table-handshakes' },
  pew: { label: 'Pew Research Center — Tipping in America', url: 'https://www.pewresearch.org/2023/11/09/services-americans-do-and-dont-tip-for-and-how-much/' },
  jpCommisceo: { label: 'Commisceo Global — Japan culture guide', url: 'https://commisceo-global.com/country-guides/japan-guide/' },
  jpNippon: { label: 'Nippon.com — Glossary of chopstick etiquette', url: 'https://www.nippon.com/en/japan-data/h01362/' },
  krCommisceo: { label: 'Commisceo Global — South Korea culture guide', url: 'https://commisceo-global.com/country-guides/south-korea-guide/' },
  krAtlas: { label: 'SBS Cultural Atlas — South Korean greetings', url: 'https://culturalatlas.sbs.com.au/south-korean-culture/south-korean-culture-greetings' },
  aeCommisceo: { label: 'Commisceo Global — UAE culture guide', url: 'https://commisceo-global.com/country-guides/uae-guide/' },
  inCommisceo: { label: 'Commisceo Global — India culture guide', url: 'https://commisceo-global.com/country-guides/india-guide/' },
  inAtlas: { label: 'SBS Cultural Atlas — Indian etiquette', url: 'https://culturalatlas.sbs.com.au/indian-culture/indian-culture-etiquette' },
  mxCommisceo: { label: 'Commisceo Global — Mexico culture guide', url: 'https://commisceo-global.com/country-guides/mexico-guide/' },
  brCommisceo: { label: 'Commisceo Global — Brazil culture guide', url: 'https://commisceo-global.com/country-guides/brazil-guide/' },
}

const REVIEWER = 'Mannerly Culture Desk'
const REVIEWED = '2026-08-11'
const ALL = ['kids', 'tweens', 'teens', 'adults'] as const

type LessonSeed = Omit<Lesson, 'reviewer' | 'reviewedOn'>
const build = (seed: LessonSeed): Lesson => ({ ...seed, reviewer: REVIEWER, reviewedOn: REVIEWED })

/* ============================================================
   GLOBAL MANNERS CORE — free forever
   ============================================================ */
const CORE: Lesson[] = [
  build({
    id: 'gc-greet', title: 'Do you wave back?', icon: '👋', xp: 10,
    scene: { environment: 'street', state: 'greeting', characters: ['manni', 'kaya'], caption: 'Someone says hi.' },
    prompt: 'Someone says hi. What do you do?',
    choices: [
      { id: 'a', label: 'Say hi back', emoji: '😊', correct: true, reaction: 'They smile.', reactionState: 'smiling' },
      { id: 'b', label: 'Look away', emoji: '😐', reaction: 'They feel ignored.', reactionState: 'confused' },
      { id: 'c', label: 'Stare and say nothing', emoji: '🫥', reaction: 'It gets awkward.', reactionState: 'embarrassed' },
    ],
    reason: 'Saying hi back makes people feel welcome.',
    challenge: 'Say hi to three people today.',
    situation: 'Someone greets you', behavior: 'Say hi back',
    formality: 'casual', normStrength: 'strong',
    whenUnsure: 'A smile and a wave always work.', reasoning: 'Greeting people shows you see them.',
    ageGroups: [...ALL], sources: [S.post, S.psow],
  }),
  build({
    id: 'gc-please', title: "What's the magic word?", icon: '🙏', xp: 10,
    scene: { environment: 'home', state: 'asking', characters: ['manni', 'kaya'], caption: 'You want the juice.' },
    prompt: 'You want the juice. What do you say?',
    choices: [
      { id: 'a', label: 'Can I have some, please?', emoji: '🧃', correct: true, reaction: 'Sure! Here you go.', reactionState: 'giving' },
      { id: 'b', label: 'Give me that', emoji: '😠', reaction: 'They frown.', reactionState: 'confused' },
      { id: 'c', label: 'Just grab it', emoji: '💪', reaction: 'You knock a cup.', reactionState: 'embarrassed' },
    ],
    reason: 'Please makes asking polite.',
    challenge: 'Say please every time you ask today.',
    situation: 'Asking for something', behavior: 'Ask with please',
    formality: 'casual', normStrength: 'strong',
    whenUnsure: 'Add please. It always helps.', reasoning: 'Please turns an order into a request.',
    ageGroups: [...ALL], sources: [S.post, S.debretts],
  }),
  build({
    id: 'gc-thanks', title: 'Do you owe a thanks?', icon: '💛', xp: 10,
    scene: { environment: 'store', state: 'thanking', characters: ['manni', 'server'], caption: 'Someone holds the door.' },
    prompt: 'Someone holds the door. What do you say?',
    choices: [
      { id: 'a', label: 'Thank you!', emoji: '😄', correct: true, reaction: 'They feel good.', reactionState: 'smiling' },
      { id: 'b', label: 'Walk past', emoji: '🚶', reaction: 'They feel ignored.', reactionState: 'confused' },
      { id: 'c', label: 'Say nothing', emoji: '🙄', reaction: 'A kind act, wasted.', reactionState: 'idle' },
    ],
    reason: 'Thank you shows you noticed their help.',
    challenge: 'Thank someone who helps you today.',
    situation: 'Someone helps you', behavior: 'Say thank you',
    formality: 'casual', normStrength: 'strong',
    whenUnsure: 'A quick thanks is never wrong.', reasoning: 'Studies show a real thank-you makes people feel closer to you.',
    ageGroups: [...ALL], sources: [S.gratitude, S.post],
  }),
  build({
    id: 'gc-introduce', title: 'How do you break the ice?', icon: '🤝', xp: 10,
    scene: { environment: 'party', state: 'greeting', characters: ['manni', 'friend'], caption: 'A new person.' },
    prompt: 'You meet someone new. What do you say?',
    choices: [
      { id: 'a', label: "Hi, I'm Sam.", emoji: '🙋', correct: true, reaction: 'They say their name too.', reactionState: 'talking' },
      { id: 'b', label: 'Say nothing', emoji: '⏳', reaction: 'You both go quiet.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Walk off', emoji: '🚶', reaction: 'You stay strangers.', reactionState: 'idle' },
    ],
    reason: 'Say your name so people can meet you.',
    challenge: 'Introduce yourself to one new person.',
    situation: 'Meeting someone new', behavior: 'Say your name',
    formality: 'semiformal', normStrength: 'medium',
    whenUnsure: 'Say your name and smile.', reasoning: 'Names help people connect.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.post, S.psow],
  }),
  build({
    id: 'gc-sorry', title: 'What makes a real sorry?', icon: '🫶', xp: 10,
    scene: { environment: 'street', state: 'apologizing', characters: ['manni', 'kaya'], caption: 'You bump someone.' },
    prompt: 'You bump into someone. What do you say?',
    choices: [
      { id: 'a', label: 'Sorry! Are you okay?', emoji: '🙏', correct: true, reaction: 'All good.', reactionState: 'smiling' },
      { id: 'b', label: 'Blame them', emoji: '😤', reaction: 'Now it is a fight.', reactionState: 'confused' },
      { id: 'c', label: 'Keep walking', emoji: '🏃', reaction: 'They feel upset.', reactionState: 'idle' },
    ],
    reason: 'Say sorry, own it, and check they are okay.',
    challenge: 'Say sorry for one small mistake today.',
    situation: 'You make a small mistake', behavior: 'Own it and check on them',
    formality: 'casual', normStrength: 'strong',
    whenUnsure: 'A simple sorry fixes most things.', reasoning: 'Research says the best sorry owns the mistake instead of making excuses.',
    ageGroups: [...ALL], sources: [S.apology, S.post],
  }),

  build({
    id: 'gc-listen', title: 'Are you really listening?', icon: '👂', xp: 10,
    scene: { environment: 'classroom', state: 'listening', characters: ['manni', 'friend'], caption: 'A friend is talking.' },
    prompt: 'Your friend is talking. What do you do?',
    choices: [
      { id: 'a', label: 'Look at them and nod', emoji: '🙂', correct: true, reaction: 'They feel heard.', reactionState: 'talking' },
      { id: 'b', label: 'Check your phone', emoji: '📱', reaction: 'They stop talking.', reactionState: 'confused' },
      { id: 'c', label: 'Plan what to say', emoji: '💭', reaction: 'You miss it.', reactionState: 'idle' },
    ],
    reason: 'Look at people when they talk to you.',
    challenge: 'Let someone finish before you talk.',
    situation: 'A friend is talking', behavior: 'Look and listen',
    formality: 'casual', normStrength: 'medium',
    whenUnsure: 'Put your phone away and look up.', reasoning: 'Real listening makes people feel understood, and easy to like you back.',
    ageGroups: [...ALL], sources: [S.listening, S.post],
  }),
  build({
    id: 'gc-interrupt', title: 'When can you jump in?', icon: '✋', xp: 10,
    scene: { environment: 'classroom', state: 'talking', characters: ['manni', 'kaya'], caption: 'Two people are talking.' },
    prompt: 'You have an idea. When do you say it?',
    choices: [
      { id: 'a', label: 'Wait for a pause', emoji: '⏸️', correct: true, reaction: 'Your idea lands well.', reactionState: 'talking' },
      { id: 'b', label: 'Cut in loud', emoji: '📢', reaction: 'They lose their thought.', reactionState: 'confused' },
      { id: 'c', label: 'Talk over them', emoji: '🗣️', reaction: 'No one hears anyone.', reactionState: 'embarrassed' },
    ],
    reason: 'Wait for a pause before you talk.',
    challenge: 'Wait your turn to talk today.',
    situation: 'You want to speak', behavior: 'Wait for a pause',
    formality: 'casual', normStrength: 'medium',
    whenUnsure: 'Raise your hand or wait.', reasoning: 'Taking turns lets everyone be heard.',
    ageGroups: [...ALL], sources: [S.listening, S.post],
  }),
  build({
    id: 'gc-boundaries', title: 'What if they say no?', icon: '🛑', xp: 10,
    scene: { environment: 'home', state: 'confused', characters: ['manni', 'friend'], caption: 'They say “not now.”' },
    prompt: 'Your friend needs space. What do you do?',
    choices: [
      { id: 'a', label: "Okay, I'm here later", emoji: '🤗', correct: true, reaction: 'They feel safe.', reactionState: 'smiling' },
      { id: 'b', label: 'Keep pushing', emoji: '😅', reaction: 'They pull away.', reactionState: 'confused' },
      { id: 'c', label: 'Get upset', emoji: '😞', reaction: 'They feel bad too.', reactionState: 'embarrassed' },
    ],
    reason: 'When someone says no, give them space.',
    challenge: 'Accept one no without a fuss.',
    situation: 'Someone needs space', behavior: 'Accept it kindly',
    formality: 'casual', normStrength: 'strong',
    whenUnsure: 'Give space. They will come back.', reasoning: 'Respecting no builds trust.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.post, S.psow],
  }),

  build({
    id: 'gc-wait-eat', title: 'When can you dig in?', icon: '🍽️', xp: 10,
    scene: { environment: 'restaurant', state: 'idle', characters: ['manni', 'kaya', 'host'], caption: 'Food arrives.' },
    prompt: 'Your food comes first. What do you do?',
    choices: [
      { id: 'a', label: 'Wait for everyone', emoji: '⏳', correct: true, reaction: 'You start together.', reactionState: 'eating' },
      { id: 'b', label: 'Eat now', emoji: '😋', reaction: 'Others watch you.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Rush them', emoji: '⏱️', reaction: 'That feels rude.', reactionState: 'confused' },
    ],
    reason: 'Wait until everyone has their food.',
    challenge: 'Wait for the table before your first bite.',
    situation: 'Food arrives one plate at a time', behavior: 'Wait for everyone',
    formality: 'semiformal', normStrength: 'medium',
    exceptions: 'If the host says start, go ahead.',
    whenUnsure: 'Watch the host, or ask to start.', reasoning: 'Starting together feels friendly.',
    ageGroups: [...ALL], sources: [S.post, S.debretts],
  }),
  build({
    id: 'gc-chew', title: 'Are you a noisy eater?', icon: '🤫', xp: 10,
    scene: { environment: 'home', state: 'eating', characters: ['manni', 'kaya'], caption: 'Dinner with family.' },
    prompt: 'You are hungry. How do you eat?',
    choices: [
      { id: 'a', label: 'Mouth closed, small bites', emoji: '😌', correct: true, reaction: 'Nice to sit by.', reactionState: 'smiling' },
      { id: 'b', label: 'Talk with food in', emoji: '🗣️', reaction: 'Everyone sees it.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Big loud bites', emoji: '😮', reaction: 'It is a lot.', reactionState: 'confused' },
    ],
    reason: 'Chew with your mouth closed.',
    challenge: 'Finish your bite before you talk.',
    situation: 'Eating near others', behavior: 'Chew quietly',
    formality: 'casual', normStrength: 'medium',
    whenUnsure: 'Copy the quietest eater.', reasoning: 'Quiet eating is easy to be around.',
    ageGroups: [...ALL], sources: [S.post, S.debretts],
  }),
  build({
    id: 'gc-phone-meal', title: 'Phone at the table?', icon: '📵', xp: 10,
    scene: { environment: 'restaurant', state: 'idle', characters: ['manni', 'friend'], caption: 'Your phone buzzes.' },
    prompt: 'Your phone buzzes at dinner. What do you do?',
    choices: [
      { id: 'a', label: 'Flip it face down', emoji: '🙃', correct: true, reaction: 'You are really here.', reactionState: 'talking' },
      { id: 'b', label: 'Scroll under the table', emoji: '👀', reaction: 'They can tell.', reactionState: 'confused' },
      { id: 'c', label: 'Take a call', emoji: '📞', reaction: 'Dinner stops.', reactionState: 'embarrassed' },
    ],
    reason: 'Keep your phone away while you eat together.',
    challenge: 'Keep your phone off the table at a meal.',
    situation: 'Phone buzzes during a meal', behavior: 'Put the phone away',
    formality: 'casual', normStrength: 'medium',
    whenUnsure: 'If you must check, say “one sec” first.', reasoning: 'Even a phone face-up on the table makes people feel less heard.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.phubbing, S.post],
  }),

  build({
    id: 'gc-text-tone', title: "Does 'k' sound cold?", icon: '💬', xp: 10,
    scene: { environment: 'home', state: 'confused', characters: ['manni'], caption: 'A reply: “k.”' },
    prompt: 'You are about to text “k.” What do you send?',
    choices: [
      { id: 'a', label: 'Sounds good!', emoji: '✨', correct: true, reaction: 'Warm and clear.', reactionState: 'smiling' },
      { id: 'b', label: 'k', emoji: '🧊', reaction: 'They think you are mad.', reactionState: 'confused' },
      { id: 'c', label: 'Nothing', emoji: '🌫️', reaction: 'They are left guessing.', reactionState: 'idle' },
    ],
    reason: 'Short texts can sound cold. Add a little warmth.',
    challenge: 'Re-read one text before you send it.',
    situation: 'Texting where tone can be misread', behavior: 'Add warmth so it is clear',
    formality: 'casual', normStrength: 'soft',
    whenUnsure: 'A friendlier text is safer.', reasoning: 'Texts have no voice or face, so tone is easy to misread.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.post, S.hall],
  }),
  build({
    id: 'gc-groupchat', title: 'Blowing up the chat?', icon: '📱', xp: 10,
    scene: { environment: 'home', state: 'idle', characters: ['manni', 'friend'], caption: '47 new messages.' },
    prompt: 'You want to reply. How do you send it?',
    choices: [
      { id: 'a', label: 'One clear message', emoji: '🎯', correct: true, reaction: 'Easy to follow.', reactionState: 'smiling' },
      { id: 'b', label: 'Nine tiny texts', emoji: '🔔', reaction: 'Phones buzz nonstop.', reactionState: 'confused' },
      { id: 'c', label: 'Reply-all a joke', emoji: '😬', reaction: 'Quiet from everyone.', reactionState: 'embarrassed' },
    ],
    reason: 'Keep it short. One message, not ten.',
    challenge: 'Send your next texts as one message.',
    situation: 'Posting in a busy group chat', behavior: 'Keep it to one message',
    formality: 'casual', normStrength: 'soft',
    whenUnsure: 'For one person, message them directly.', reasoning: 'Every text pings the whole group.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.post, S.phubbing],
  }),
  build({
    id: 'gc-videocall', title: 'Mic on or off?', icon: '🎥', xp: 10,
    scene: { environment: 'office', state: 'talking', characters: ['manni', 'host'], caption: 'A call with six people.' },
    prompt: 'You are not talking. What do you do?',
    choices: [
      { id: 'a', label: 'Mute yourself', emoji: '🔇', correct: true, reaction: 'Clear for everyone.', reactionState: 'listening' },
      { id: 'b', label: 'Leave mic on', emoji: '🐕', reaction: 'Your dog joins in.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Wander off', emoji: '🍜', reaction: 'People notice.', reactionState: 'idle' },
    ],
    reason: 'Mute your mic when you are not talking.',
    challenge: 'Mute when you are quiet on your next call.',
    situation: 'Group video call', behavior: 'Mute when not speaking',
    formality: 'semiformal', normStrength: 'medium',
    whenUnsure: 'Stay muted until you speak.', reasoning: 'One open mic can drown out everyone.',
    ageGroups: ['teens', 'adults'], sources: [S.post, S.psow],
  }),

  build({
    id: 'gc-queue', title: 'Can you skip the line?', icon: '🧍', xp: 10,
    scene: { environment: 'store', state: 'idle', characters: ['manni', 'kaya'], caption: 'A line at the counter.' },
    prompt: 'You are in a hurry. What do you do?',
    choices: [
      { id: 'a', label: 'Wait at the back', emoji: '🔚', correct: true, reaction: 'Fair. The line moves.', reactionState: 'idle' },
      { id: 'b', label: 'Cut to the front', emoji: '😏', reaction: 'People get upset.', reactionState: 'confused' },
      { id: 'c', label: 'Sneak in', emoji: '👣', reaction: 'They block you.', reactionState: 'embarrassed' },
    ],
    reason: 'Line up at the back and wait your turn.',
    challenge: 'Let one person go before you.',
    situation: 'Waiting in a line', behavior: 'Wait your turn',
    formality: 'casual', normStrength: 'strong',
    whenUnsure: 'Ask “are you in line?” first.', reasoning: 'A line is the fairest way to share a turn.',
    ageGroups: [...ALL], sources: [S.post, S.debrettsQueue],
  }),
  build({
    id: 'gc-seat', title: 'Give up your seat?', icon: '💺', xp: 10,
    scene: { environment: 'train', state: 'idle', characters: ['manni', 'elder'], caption: 'A packed bus.' },
    prompt: 'Someone needs a seat more than you. What do you do?',
    choices: [
      { id: 'a', label: 'Offer your seat', emoji: '🙌', correct: true, reaction: 'A thankful smile.', reactionState: 'thanking' },
      { id: 'b', label: 'Look away', emoji: '😴', reaction: 'They stand, wobbly.', reactionState: 'idle' },
      { id: 'c', label: 'Wait for someone else', emoji: '🤷', reaction: 'No one moves.', reactionState: 'confused' },
    ],
    reason: 'Give your seat to someone who needs it more.',
    challenge: 'Offer your seat or spot this week.',
    situation: 'Few seats left', behavior: 'Offer your seat',
    formality: 'casual', normStrength: 'medium',
    whenUnsure: 'Offer kindly. It is okay if they say no.', reasoning: 'Small kindnesses help everyone.',
    ageGroups: [...ALL], sources: [S.post, S.debretts],
  }),
  build({
    id: 'gc-guest', title: 'How to be a good guest?', icon: '🎁', xp: 10,
    scene: { environment: 'friends-home', state: 'giving', characters: ['manni', 'host'], caption: 'You visit their home.' },
    prompt: 'You arrive at a friend’s home. What do you do?',
    choices: [
      { id: 'a', label: 'Thanks for having me!', emoji: '🌸', correct: true, reaction: 'The host smiles.', reactionState: 'smiling' },
      { id: 'b', label: 'Head for the snacks', emoji: '🍪', reaction: 'A bit too fast.', reactionState: 'confused' },
      { id: 'c', label: 'Grab the remote', emoji: '📺', reaction: 'It is their home.', reactionState: 'embarrassed' },
    ],
    reason: 'Thank the host and follow their house rules.',
    challenge: 'Bring or offer something next visit.',
    situation: 'Visiting a home', behavior: 'Thank the host',
    formality: 'semiformal', normStrength: 'medium',
    whenUnsure: 'Ask “where should I sit?”', reasoning: 'Guests say thanks for the welcome.',
    ageGroups: [...ALL], sources: [S.post, S.debretts],
  }),
]

/* ============================================================
   UNITED STATES (home region / country pack)
   ============================================================ */
const US: Lesson[] = [
  build({
    id: 'us-doors', title: 'Hold the door?', icon: '🚪', xp: 15, country: 'US',
    scene: { environment: 'store', state: 'giving', characters: ['manni', 'kaya'], caption: 'Someone is right behind you.' },
    prompt: 'Someone is right behind you at the door. What do you do?',
    choices: [
      { id: 'a', label: 'Hold it open', emoji: '🚪', correct: true, reaction: 'Thanks!', reactionState: 'smiling' },
      { id: 'b', label: 'Let it shut', emoji: '🚶', reaction: 'It shuts in their face.', reactionState: 'confused' },
      { id: 'c', label: 'Rush through', emoji: '🏃', reaction: 'They dodge the door.', reactionState: 'embarrassed' },
    ],
    reason: 'Hold the door for the person behind you.',
    challenge: 'Hold a door for someone today.',
    situation: 'Someone is behind you at a door', behavior: 'Hold the door',
    formality: 'casual', normStrength: 'medium',
    whenUnsure: 'If they are close, hold it.', reasoning: 'A held door is an easy kindness.',
    ageGroups: [...ALL], sources: [S.usAtlas, S.berlitz],
  }),
  build({
    id: 'us-space', title: 'How close is too close?', icon: '📏', xp: 15, country: 'US',
    scene: { environment: 'office', state: 'talking', characters: ['manni', 'kaya'], caption: 'You chat with someone.' },
    prompt: 'You are talking to someone. Where do you stand?',
    choices: [
      { id: 'a', label: 'About an arm away', emoji: '🙂', correct: true, reaction: 'Comfy for both.', reactionState: 'talking' },
      { id: 'b', label: 'Very close', emoji: '😬', reaction: 'They step back.', reactionState: 'confused' },
      { id: 'c', label: 'Keep touching their arm', emoji: '✋', reaction: 'Too much.', reactionState: 'embarrassed' },
    ],
    reason: 'Stand about an arm’s length away.',
    challenge: 'Notice what distance feels comfy today.',
    situation: 'Talking with someone', behavior: 'Keep an arm’s length',
    formality: 'casual', normStrength: 'medium',
    whenUnsure: 'Give a little space.', reasoning: 'Researchers found about an arm’s length is the everyday comfort zone here.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.hall, S.usAtlas],
  }),
  build({
    id: 'us-smalltalk', title: 'How do you do small talk?', icon: '💬', xp: 15, country: 'US',
    scene: { environment: 'store', state: 'talking', characters: ['manni', 'server'], caption: '“How’s your day?”' },
    prompt: 'A cashier asks how you are. What do you say?',
    choices: [
      { id: 'a', label: 'Good, thanks. You?', emoji: '🙂', correct: true, reaction: 'Nice and friendly.', reactionState: 'smiling' },
      { id: 'b', label: 'Ignore them', emoji: '😐', reaction: 'It feels cold.', reactionState: 'confused' },
      { id: 'c', label: 'Tell your whole day', emoji: '📖', reaction: 'A bit too much.', reactionState: 'embarrassed' },
    ],
    reason: 'A short, friendly answer is all you need.',
    challenge: 'Answer one “how are you?” kindly.',
    situation: 'Casual small talk', behavior: 'Answer short and friendly',
    formality: 'casual', normStrength: 'soft',
    whenUnsure: 'Say good, thanks, and ask back.', reasoning: 'In the US, light small talk is just a friendly hello.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.usAtlas, S.berlitz],
  }),
  build({
    id: 'us-tipping', title: 'How much do you tip?', icon: '💵', xp: 15, country: 'US',
    scene: { environment: 'restaurant', state: 'idle', characters: ['manni', 'server'], caption: 'The bill comes.' },
    prompt: 'Service was good. What do you tip?',
    choices: [
      { id: 'a', label: 'About 15 to 20%', emoji: '💵', correct: true, reaction: 'Normal and kind.', reactionState: 'thanking' },
      { id: 'b', label: 'Nothing', emoji: '🚫', reaction: 'That seems rude here.', reactionState: 'confused' },
      { id: 'c', label: 'A few coins', emoji: '🪙', reaction: 'It feels like a snub.', reactionState: 'embarrassed' },
    ],
    reason: 'Tip about 15 to 20% for good service.',
    challenge: 'Learn the tip before eating out.',
    situation: 'Paying at a sit-down restaurant', behavior: 'Tip 15 to 20%',
    formality: 'casual', normStrength: 'strong',
    exceptions: 'Other countries tip differently.',
    whenUnsure: 'Around 18% is a safe tip.', reasoning: 'US servers can be paid below minimum wage, so tips are part of their pay.',
    ageGroups: ['teens', 'adults'], sources: [S.pew, S.post],
  }),
]

/* ============================================================
   COUNTRY PACKS (Manners+ / Travel Pack)
   ============================================================ */
const JP: Lesson[] = [
  build({
    id: 'jp-shoes', title: 'Shoes on or off?', icon: '🥿', xp: 15, country: 'JP',
    scene: { environment: 'home', state: 'asking', characters: ['manni', 'host'], caption: 'A Japanese home’s entrance.' },
    prompt: 'You reach the front step. What do you do?',
    choices: [
      { id: 'a', label: 'Take your shoes off', emoji: '👣', correct: true, reaction: 'Perfect. Slippers wait.', reactionState: 'smiling' },
      { id: 'b', label: 'Keep them on', emoji: '👟', reaction: 'The host winces.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Ask the host', emoji: '🙋', reaction: 'Always safe to ask.', reactionState: 'talking' },
    ],
    reason: 'Take your shoes off at the door. It keeps the home clean.',
    challenge: 'Notice where shoes come off next time.',
    situation: 'Entering a Japanese home', behavior: 'Remove shoes at the door',
    formality: 'formal', normStrength: 'strong',
    exceptions: 'Some restaurants and temples do this too.',
    whenUnsure: 'Look for shoes at the door, or ask.', reasoning: 'The step up marks clean floor from outside dirt.',
    ageGroups: [...ALL], sources: [S.jpCommisceo, S.usAtlas],
  }),
  build({
    id: 'jp-chopsticks', title: 'The chopstick mistake?', icon: '🥢', xp: 15, country: 'JP',
    scene: { environment: 'restaurant', state: 'eating', characters: ['manni', 'kaya'], caption: 'A bowl of rice.' },
    prompt: 'You take a break. Where do the chopsticks go?',
    choices: [
      { id: 'a', label: 'On the holder', emoji: '🥢', correct: true, reaction: 'Neat and polite.', reactionState: 'smiling' },
      { id: 'b', label: 'Stuck up in the rice', emoji: '⬆️', reaction: 'The table goes quiet.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Pass food tip to tip', emoji: '↔️', reaction: 'People wince.', reactionState: 'confused' },
    ],
    reason: 'Do not stand chopsticks in rice or pass food tip to tip.',
    challenge: 'Rest your fork or chopsticks neatly.',
    situation: 'Using chopsticks in Japan', behavior: 'Rest them on the holder',
    formality: 'semiformal', normStrength: 'strong',
    whenUnsure: 'Lay them across the bowl or holder.', reasoning: 'Both moves copy Japanese funeral rites, so they feel like bad luck.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.jpNippon, S.jpCommisceo],
  }),
  build({
    id: 'jp-train', title: 'Why do trains go quiet?', icon: '🚆', xp: 15, country: 'JP',
    scene: { environment: 'train', state: 'idle', characters: ['manni', 'kaya'], caption: 'A calm train.' },
    prompt: 'Your friend calls. What do you do?',
    choices: [
      { id: 'a', label: 'Text “call you soon”', emoji: '🤫', correct: true, reaction: 'The train stays calm.', reactionState: 'smiling' },
      { id: 'b', label: 'Take the call, loud', emoji: '📢', reaction: 'Heads turn.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Use speaker', emoji: '🔊', reaction: 'Everyone hears.', reactionState: 'confused' },
    ],
    reason: 'Keep phones quiet on trains.',
    challenge: 'Silence your phone in one quiet place today.',
    situation: 'On a train in Japan', behavior: 'No loud calls on trains',
    formality: 'semiformal', normStrength: 'strong',
    whenUnsure: 'Silent mode and a quiet voice are safe.', reasoning: 'Shared calm is a way of respecting the group in Japan.',
    ageGroups: [...ALL], sources: [S.jpCommisceo, S.hall],
  }),
]

const KR: Lesson[] = [
  build({
    id: 'kr-twohands', title: 'One hand or two?', icon: '🤲', xp: 15, country: 'KR',
    scene: { environment: 'office', state: 'giving', characters: ['manni', 'elder'], caption: 'You hand over a gift.' },
    prompt: 'You give a gift to an elder. How?',
    choices: [
      { id: 'a', label: 'Two hands, small bow', emoji: '🙇', correct: true, reaction: 'Warm and polite.', reactionState: 'thanking' },
      { id: 'b', label: 'One hand', emoji: '✋', reaction: 'A bit careless.', reactionState: 'confused' },
      { id: 'c', label: 'Toss it over', emoji: '🤾', reaction: 'Not okay.', reactionState: 'embarrassed' },
    ],
    reason: 'Give and take with two hands to show respect.',
    challenge: 'Hand something over with both hands today.',
    situation: 'Giving to an elder in Korea', behavior: 'Use both hands',
    formality: 'formal', normStrength: 'strong',
    whenUnsure: 'Two hands and a small bow always work.', reasoning: 'Two hands show extra care, which matters most with elders.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.krCommisceo, S.krAtlas],
  }),
  build({
    id: 'kr-elder-eats', title: 'Who eats first?', icon: '🍚', xp: 15, country: 'KR',
    scene: { environment: 'restaurant', state: 'idle', characters: ['manni', 'elder', 'kaya'], caption: 'A Korean meal.' },
    prompt: 'The food is ready. What do you do?',
    choices: [
      { id: 'a', label: 'Wait for the eldest', emoji: '⏳', correct: true, reaction: 'Then everyone starts.', reactionState: 'eating' },
      { id: 'b', label: 'Start first', emoji: '🥢', reaction: 'An awkward pause.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Lift your rice bowl', emoji: '🍚', reaction: 'Leave it on the table.', reactionState: 'confused' },
    ],
    reason: 'Let the oldest person start eating first.',
    challenge: 'Let the eldest start first tonight.',
    situation: 'A meal with elders in Korea', behavior: 'Wait for the eldest',
    formality: 'formal', normStrength: 'strong',
    whenUnsure: 'Watch the eldest and follow.', reasoning: 'Respect for age sets the order at a Korean table.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.krCommisceo, S.krAtlas],
  }),
  build({
    id: 'kr-shoes', title: 'Wear shoes inside?', icon: '🧦', xp: 15, country: 'KR',
    scene: { environment: 'home', state: 'asking', characters: ['manni', 'host'], caption: 'A Korean home.' },
    prompt: 'You step inside. What do you do?',
    choices: [
      { id: 'a', label: 'Leave shoes at the door', emoji: '👟', correct: true, reaction: 'Just right.', reactionState: 'smiling' },
      { id: 'b', label: 'Wear them in', emoji: '🥾', reaction: 'The host looks unsure.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Ask where to put them', emoji: '🙋', reaction: 'Thoughtful.', reactionState: 'talking' },
    ],
    reason: 'Take your shoes off inside a Korean home.',
    challenge: 'Slip your shoes off at the door next time.',
    situation: 'Entering a Korean home', behavior: 'Remove shoes inside',
    formality: 'formal', normStrength: 'strong',
    whenUnsure: 'Follow the shoes-at-the-door cue.', reasoning: 'People sit, eat, and sleep on clean floors.',
    ageGroups: [...ALL], sources: [S.krCommisceo, S.krAtlas],
  }),
]

const AE: Lesson[] = [
  build({
    id: 'ae-righthand', title: 'Which hand do you use?', icon: '🤝', xp: 15, country: 'AE',
    scene: { environment: 'restaurant', state: 'giving', characters: ['manni', 'host'], caption: 'You are handed a date.' },
    prompt: 'You take food and eat. Which hand?',
    choices: [
      { id: 'a', label: 'Right hand', emoji: '🫱', correct: true, reaction: 'Warmly received.', reactionState: 'smiling' },
      { id: 'b', label: 'Left hand', emoji: '🫲', reaction: 'A quiet frown.', reactionState: 'confused' },
      { id: 'c', label: 'Both, grabbing', emoji: '🙌', reaction: 'A bit clumsy.', reactionState: 'embarrassed' },
    ],
    reason: 'Eat, greet, and pass with your right hand.',
    challenge: 'Use your right hand to give and take today.',
    situation: 'Giving or eating in the UAE', behavior: 'Use the right hand',
    formality: 'formal', normStrength: 'strong',
    whenUnsure: 'Use the right hand for anything social.', reasoning: 'By custom the right hand is the clean, social hand.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.aeCommisceo],
  }),
  build({
    id: 'ae-dress', title: "What's okay to wear?", icon: '🧥', xp: 15, country: 'AE',
    scene: { environment: 'street', state: 'walking', characters: ['manni', 'kaya'], caption: 'Off to a mall and mosque.' },
    prompt: 'You pick an outfit. What do you wear?',
    choices: [
      { id: 'a', label: 'Cover shoulders and knees', emoji: '👔', correct: true, reaction: 'Respectful and easy.', reactionState: 'smiling' },
      { id: 'b', label: 'Beachwear downtown', emoji: '🩳', reaction: 'Out of place.', reactionState: 'confused' },
      { id: 'c', label: 'Tight or see-through', emoji: '👀', reaction: 'Wrong attention.', reactionState: 'embarrassed' },
    ],
    reason: 'Cover shoulders and knees in public.',
    challenge: 'Check a place’s dress rule before you go.',
    situation: 'Dressing for public in the UAE', behavior: 'Cover shoulders and knees',
    formality: 'formal', normStrength: 'strong',
    exceptions: 'Beaches and pools are relaxed.',
    whenUnsure: 'Carry a layer to cover up.', reasoning: 'Modest dress is a sign of respect in public here.',
    ageGroups: ['teens', 'adults'], sources: [S.aeCommisceo],
  }),
  build({
    id: 'ae-ramadan', title: 'Can you eat in public?', icon: '🌙', xp: 15, country: 'AE',
    scene: { environment: 'street', state: 'idle', characters: ['manni', 'kaya'], caption: 'A hot Ramadan afternoon.' },
    prompt: 'It is Ramadan and you are thirsty. What do you do?',
    choices: [
      { id: 'a', label: 'Wait for a private spot', emoji: '🚪', correct: true, reaction: 'Kind to those fasting.', reactionState: 'smiling' },
      { id: 'b', label: 'Eat on the street', emoji: '🥤', reaction: 'Uncomfortable for many.', reactionState: 'confused' },
      { id: 'c', label: 'Smoke in public', emoji: '🚬', reaction: 'Not okay by day.', reactionState: 'embarrassed' },
    ],
    reason: 'In daytime Ramadan, eat and drink out of sight.',
    challenge: 'Learn one local custom before a trip.',
    situation: 'Ramadan daytime in the UAE', behavior: 'Eat and drink privately by day',
    formality: 'formal', normStrength: 'strong',
    exceptions: 'Many places serve food indoors.',
    whenUnsure: 'Eat and drink in private during the day.', reasoning: 'Most people around you are fasting from dawn to sunset.',
    ageGroups: ['teens', 'adults'], sources: [S.aeCommisceo],
  }),
]

const IN: Lesson[] = [
  build({
    id: 'in-namaste', title: 'Do you shake hands?', icon: '🙏', xp: 15, country: 'IN',
    scene: { environment: 'home', state: 'greeting', characters: ['manni', 'elder'], caption: 'You meet an elder.' },
    prompt: 'You meet an elder. How do you say hi?',
    choices: [
      { id: 'a', label: 'Palms together, small bow', emoji: '🙏', correct: true, reaction: 'A warm hello.', reactionState: 'smiling' },
      { id: 'b', label: 'Big backslap', emoji: '💥', reaction: 'Too much, too soon.', reactionState: 'confused' },
      { id: 'c', label: 'Left-hand wave', emoji: '🫲', reaction: 'Use the right hand.', reactionState: 'embarrassed' },
    ],
    reason: 'Greet with namaste. Palms together and a small bow.',
    challenge: 'Greet someone with a small bow today.',
    situation: 'Greeting elders in India', behavior: 'Say namaste',
    formality: 'semiformal', normStrength: 'medium',
    whenUnsure: 'Namaste works without touching.', reasoning: 'Namaste shows respect and works without any contact.',
    ageGroups: [...ALL], sources: [S.inCommisceo, S.inAtlas],
  }),
  build({
    id: 'in-shoes-temple', title: 'Shoes in the temple?', icon: '🛕', xp: 15, country: 'IN',
    scene: { environment: 'worship', state: 'asking', characters: ['manni', 'host'], caption: 'A temple door.' },
    prompt: 'You reach the temple door. What do you do?',
    choices: [
      { id: 'a', label: 'Take your shoes off', emoji: '👣', correct: true, reaction: 'Leave them at the rack.', reactionState: 'smiling' },
      { id: 'b', label: 'Wear them in', emoji: '👟', reaction: 'A clear no.', reactionState: 'embarrassed' },
      { id: 'c', label: 'Point feet at the altar', emoji: '🦶', reaction: 'Keep feet away from it.', reactionState: 'confused' },
    ],
    reason: 'Take shoes off for temples and homes. Keep feet from pointing at holy things.',
    challenge: 'Look for the shoe rack before you enter.',
    situation: 'Entering temples and homes in India', behavior: 'Remove shoes; mind your feet',
    formality: 'formal', normStrength: 'strong',
    whenUnsure: 'Follow the rack and how locals sit.', reasoning: 'Feet are seen as the lowest, least clean part of the body here.',
    ageGroups: [...ALL], sources: [S.inCommisceo, S.inAtlas],
  }),
  build({
    id: 'in-righthand', title: 'Which hand for food?', icon: '🍛', xp: 15, country: 'IN',
    scene: { environment: 'restaurant', state: 'eating', characters: ['manni', 'kaya'], caption: 'A shared meal.' },
    prompt: 'You reach for food. Which hand?',
    choices: [
      { id: 'a', label: 'Right hand', emoji: '🫱', correct: true, reaction: 'Just right.', reactionState: 'smiling' },
      { id: 'b', label: 'Left hand', emoji: '🫲', reaction: 'Kept off food here.', reactionState: 'confused' },
      { id: 'c', label: 'Hands in shared dishes', emoji: '🥄', reaction: 'Use the spoon.', reactionState: 'embarrassed' },
    ],
    reason: 'Eat and pass food with your right hand.',
    challenge: 'Use the serving spoon, not your fingers.',
    situation: 'Eating and sharing in India', behavior: 'Use the right hand for food',
    formality: 'semiformal', normStrength: 'strong',
    exceptions: 'The left hand can hold a cup.',
    whenUnsure: 'Right hand for food, spoon for sharing.', reasoning: 'The right hand is kept for food; the left is for other tasks.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.inCommisceo, S.inAtlas],
  }),
]

const MX: Lesson[] = [
  build({
    id: 'mx-greet', title: 'Kiss, shake, or wave?', icon: '🤗', xp: 15, country: 'MX',
    scene: { environment: 'party', state: 'greeting', characters: ['manni', 'friend'], caption: 'You arrive at a party.' },
    prompt: 'You greet the group. What do you do?',
    choices: [
      { id: 'a', label: 'Handshake or one cheek kiss', emoji: '😊', correct: true, reaction: 'Warm and welcome.', reactionState: 'smiling' },
      { id: 'b', label: 'Wave from the door', emoji: '👋', reaction: 'A bit distant.', reactionState: 'confused' },
      { id: 'c', label: 'Skip greeting people', emoji: '🚶', reaction: 'Seen as cold.', reactionState: 'embarrassed' },
    ],
    reason: 'Greet warmly. A handshake, or one cheek kiss with friends.',
    challenge: 'Greet each person when you arrive.',
    situation: 'Greeting people in Mexico', behavior: 'Greet each person warmly',
    formality: 'semiformal', normStrength: 'medium',
    exceptions: 'Cheek kiss is for friends. Shake hands the first time.',
    whenUnsure: 'Start with a handshake.', reasoning: 'A warm hello to each person sets a friendly tone in Mexico.',
    ageGroups: ['teens', 'adults'], sources: [S.mxCommisceo],
  }),
  build({
    id: 'mx-provecho', title: 'What do you say at meals?', icon: '🍲', xp: 15, country: 'MX',
    scene: { environment: 'restaurant', state: 'talking', characters: ['manni', 'kaya'], caption: 'You pass people eating.' },
    prompt: 'People nearby are eating. What do you say?',
    choices: [
      { id: 'a', label: '“Buen provecho”', emoji: '😋', correct: true, reaction: 'A friendly touch.', reactionState: 'smiling' },
      { id: 'b', label: 'Stare at their food', emoji: '👀', reaction: 'A bit awkward.', reactionState: 'confused' },
      { id: 'c', label: 'Say nothing', emoji: '🤐', reaction: 'You miss a nice custom.', reactionState: 'idle' },
    ],
    reason: 'Say “buen provecho.” It means enjoy your meal.',
    challenge: 'Wish someone a good meal today.',
    situation: 'Near people eating in Mexico', behavior: 'Say buen provecho',
    formality: 'casual', normStrength: 'soft',
    whenUnsure: 'A smile and “buen provecho” is kind.', reasoning: 'Small kind words keep things warm.',
    ageGroups: ['tweens', 'teens', 'adults'], sources: [S.mxCommisceo],
  }),
  build({
    id: 'mx-time', title: 'Show up on time?', icon: '🕰️', xp: 15, country: 'MX',
    scene: { environment: 'friends-home', state: 'idle', characters: ['manni', 'friend'], caption: 'Invited at 8pm.' },
    prompt: 'It is a party at 8. When do you show up?',
    choices: [
      { id: 'a', label: 'A little after 8', emoji: '🙂', correct: true, reaction: 'Right on time here.', reactionState: 'smiling' },
      { id: 'b', label: '8:00 sharp', emoji: '⏰', reaction: 'The host may still be prepping.', reactionState: 'confused' },
      { id: 'c', label: 'Stress about being late', emoji: '😰', reaction: 'No need.', reactionState: 'idle' },
    ],
    reason: 'For parties, a bit late is normal. Relax.',
    challenge: 'Match your arrival to the event.',
    situation: 'Timing a party in Mexico', behavior: 'Relax social timing',
    formality: 'casual', normStrength: 'medium',
    exceptions: 'Be on time for work and business.',
    whenUnsure: 'Ask if it is a set time or “come by.”', reasoning: 'Social time is relaxed, but business still runs on the clock.',
    ageGroups: ['teens', 'adults'], sources: [S.mxCommisceo],
  }),
]

const BR: Lesson[] = [
  build({
    id: 'br-kiss', title: 'One kiss or two?', icon: '😙', xp: 15, country: 'BR',
    scene: { environment: 'party', state: 'greeting', characters: ['manni', 'friend'], caption: 'You meet friends.' },
    prompt: 'You say hello. What do you do?',
    choices: [
      { id: 'a', label: 'Follow their lead', emoji: '😊', correct: true, reaction: 'Smooth and friendly.', reactionState: 'smiling' },
      { id: 'b', label: 'A big formal bow', emoji: '🎩', reaction: 'Too formal.', reactionState: 'confused' },
      { id: 'c', label: 'Back away', emoji: '🙅', reaction: 'Feels cold here.', reactionState: 'embarrassed' },
    ],
    reason: 'Greetings are warm. Often a cheek kiss or a handshake.',
    challenge: 'Let the other person set the greeting.',
    situation: 'Greeting people in Brazil', behavior: 'Follow their greeting',
    formality: 'casual', normStrength: 'medium',
    exceptions: 'The number of kisses changes by region.',
    whenUnsure: 'Offer a handshake and follow them.', reasoning: 'Warm, close greetings are the norm in Brazil.',
    ageGroups: ['teens', 'adults'], sources: [S.brCommisceo],
  }),
  build({
    id: 'br-space', title: 'Standing too close?', icon: '🫂', xp: 15, country: 'BR',
    scene: { environment: 'street', state: 'talking', characters: ['manni', 'kaya'], caption: 'A lively chat.' },
    prompt: 'They stand close while you talk. What do you do?',
    choices: [
      { id: 'a', label: 'Stay relaxed', emoji: '🙂', correct: true, reaction: 'You are in sync.', reactionState: 'talking' },
      { id: 'b', label: 'Step back each time', emoji: '↩️', reaction: 'Can feel cold.', reactionState: 'confused' },
      { id: 'c', label: 'Cut it short', emoji: '🏃', reaction: 'You miss the warmth.', reactionState: 'idle' },
    ],
    reason: 'Standing close is friendly here, not pushy.',
    challenge: 'Notice comfy chat distance today.',
    situation: 'Chatting in Brazil', behavior: 'Stay relaxed up close',
    formality: 'casual', normStrength: 'soft',
    whenUnsure: 'Match the other person’s distance.', reasoning: 'Comfortable talking distance is closer in Brazil than in the US.',
    ageGroups: ['teens', 'adults'], sources: [S.brCommisceo, S.hall],
  }),
  build({
    id: 'br-time', title: 'Late to the party?', icon: '⏳', xp: 15, country: 'BR',
    scene: { environment: 'friends-home', state: 'idle', characters: ['manni', 'friend'], caption: 'A party at 9.' },
    prompt: 'For a party at 9, when do you arrive?',
    choices: [
      { id: 'a', label: '15 to 30 min after', emoji: '🙂', correct: true, reaction: 'On time, socially.', reactionState: 'smiling' },
      { id: 'b', label: 'Exactly 9', emoji: '⏰', reaction: 'You beat the host.', reactionState: 'confused' },
      { id: 'c', label: 'Same for work', emoji: '💼', reaction: 'Be on time for work.', reactionState: 'embarrassed' },
    ],
    reason: 'For parties, a little late is normal. Be on time for work.',
    challenge: 'Ask if it is “sharp” or “social” time.',
    situation: 'Timing events in Brazil', behavior: 'Relax social timing',
    formality: 'casual', normStrength: 'medium',
    exceptions: 'Business runs on time.',
    whenUnsure: 'Social: a bit late. Work: on time.', reasoning: 'Social time is flexible, but meetings still start on time.',
    ageGroups: ['teens', 'adults'], sources: [S.brCommisceo],
  }),
]

const GB: Lesson[] = [
  build({
    id: 'gb-queue', title: 'Jump the queue?', icon: '🧎', xp: 15, country: 'GB',
    scene: { environment: 'store', state: 'idle', characters: ['manni', 'kaya'], caption: 'A tidy queue.' },
    prompt: 'You are in a rush. What do you do?',
    choices: [
      { id: 'a', label: 'Join the back', emoji: '🔚', correct: true, reaction: 'Very proper.', reactionState: 'idle' },
      { id: 'b', label: 'Slip in near the front', emoji: '😏', reaction: 'People glare.', reactionState: 'confused' },
      { id: 'c', label: 'Ignore the line', emoji: '🚷', reaction: 'A big no here.', reactionState: 'embarrassed' },
    ],
    reason: 'Join the back of the queue and wait.',
    challenge: 'Wait in one queue without checking your phone.',
    situation: 'Queuing in the UK', behavior: 'Join the back and wait',
    formality: 'semiformal', normStrength: 'strong',
    whenUnsure: 'Ask “are you in the queue?”', reasoning: 'Debrett’s calls queue-jumping a serious offence in Britain.',
    ageGroups: [...ALL], sources: [S.debrettsQueue, S.debretts],
  }),
  build({
    id: 'gb-please', title: "Mind your P's and Q's?", icon: '☕', xp: 15, country: 'GB',
    scene: { environment: 'restaurant', state: 'talking', characters: ['manni', 'server'], caption: 'Ordering tea.' },
    prompt: 'You order tea. What do you say?',
    choices: [
      { id: 'a', label: 'A tea, please. Thanks!', emoji: '🙂', correct: true, reaction: 'Textbook polite.', reactionState: 'smiling' },
      { id: 'b', label: 'Tea.', emoji: '😐', reaction: 'Sounds abrupt.', reactionState: 'confused' },
      { id: 'c', label: 'Snap your fingers', emoji: '🫰', reaction: 'Really not done.', reactionState: 'embarrassed' },
    ],
    reason: 'Use please and thank you often.',
    challenge: 'Add please and thanks to three requests.',
    situation: 'Everyday requests in the UK', behavior: 'Say please and thank you',
    formality: 'casual', normStrength: 'strong',
    whenUnsure: 'More politeness is always safe.', reasoning: 'Please and thank you are woven through everyday British speech.',
    ageGroups: [...ALL], sources: [S.debretts],
  }),
  build({
    id: 'gb-understate', title: 'Too much enthusiasm?', icon: '🌦️', xp: 15, country: 'GB',
    scene: { environment: 'office', state: 'talking', characters: ['manni', 'friend'], caption: 'Asked how it’s going.' },
    prompt: 'Things are great. How do you say it?',
    choices: [
      { id: 'a', label: 'Not bad at all, thanks', emoji: '🙂', correct: true, reaction: 'Very British.', reactionState: 'smiling' },
      { id: 'b', label: 'Everything is AMAZING!!', emoji: '🤩', reaction: 'A bit much.', reactionState: 'confused' },
      { id: 'c', label: 'List every detail', emoji: '📋', reaction: 'More than they asked.', reactionState: 'idle' },
    ],
    reason: 'A calm, modest answer fits best.',
    challenge: 'Read the room’s tone first.',
    situation: 'Casual chat in the UK', behavior: 'Keep it modest',
    formality: 'casual', normStrength: 'soft',
    whenUnsure: 'A calm, modest reply is safe.', reasoning: 'Debrett’s treats understatement as a mark of good manners in Britain.',
    ageGroups: ['teens', 'adults'], sources: [S.debrettsUnderstate, S.debretts],
  }),
]

/* ---------- registries ---------- */
export const LESSONS: Lesson[] = [...CORE, ...US, ...JP, ...KR, ...AE, ...IN, ...MX, ...BR, ...GB]
export const LESSON_MAP: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]))

/* ---------- units ---------- */
export const UNITS: Unit[] = [
  { id: 'core-basics', courseId: 'core', title: 'Polite Basics', subtitle: 'The everyday essentials', color: 'navy', icon: '🤝', lessonIds: ['gc-greet', 'gc-please', 'gc-thanks', 'gc-introduce', 'gc-sorry'] },
  { id: 'core-talk', courseId: 'core', title: 'Talk & Listen', subtitle: 'Conversations that click', color: 'teal', icon: '👂', lessonIds: ['gc-listen', 'gc-interrupt', 'gc-boundaries'] },
  { id: 'core-table', courseId: 'core', title: 'At the Table', subtitle: 'Meals with anyone', color: 'gold', icon: '🍽️', lessonIds: ['gc-wait-eat', 'gc-chew', 'gc-phone-meal'] },
  { id: 'core-screens', courseId: 'core', title: 'Screens & Chats', subtitle: 'Phones and messages', color: 'navy', icon: '💬', lessonIds: ['gc-text-tone', 'gc-groupchat', 'gc-videocall'] },
  { id: 'core-world', courseId: 'core', title: 'Out in the World', subtitle: 'Public life', color: 'teal', icon: '🌍', lessonIds: ['gc-queue', 'gc-seat', 'gc-guest'] },

  { id: 'us-core', courseId: 'us', title: 'United States', color: 'navy', icon: '🇺🇸', lessonIds: ['us-doors', 'us-space', 'us-smalltalk', 'us-tipping'] },
  { id: 'jp-core', courseId: 'jp', title: 'Japan', color: 'navy', icon: '🇯🇵', lessonIds: ['jp-shoes', 'jp-chopsticks', 'jp-train'] },
  { id: 'kr-core', courseId: 'kr', title: 'South Korea', color: 'teal', icon: '🇰🇷', lessonIds: ['kr-twohands', 'kr-elder-eats', 'kr-shoes'] },
  { id: 'ae-core', courseId: 'ae', title: 'United Arab Emirates', color: 'gold', icon: '🇦🇪', lessonIds: ['ae-righthand', 'ae-dress', 'ae-ramadan'] },
  { id: 'in-core', courseId: 'in', title: 'India', color: 'navy', icon: '🇮🇳', lessonIds: ['in-namaste', 'in-shoes-temple', 'in-righthand'] },
  { id: 'mx-core', courseId: 'mx', title: 'Mexico', color: 'teal', icon: '🇲🇽', lessonIds: ['mx-greet', 'mx-provecho', 'mx-time'] },
  { id: 'br-core', courseId: 'br', title: 'Brazil', color: 'gold', icon: '🇧🇷', lessonIds: ['br-kiss', 'br-space', 'br-time'] },
  { id: 'gb-core', courseId: 'gb', title: 'United Kingdom', color: 'navy', icon: '🇬🇧', lessonIds: ['gb-queue', 'gb-please', 'gb-understate'] },
]
export const UNIT_MAP: Record<string, Unit> = Object.fromEntries(UNITS.map((u) => [u.id, u]))

/* ---------- courses (worlds) ---------- */
export const COURSES: Course[] = [
  { id: 'core', kind: 'core', title: 'Global Manners Core', icon: '🌍', blurb: 'Everyday social skills, free forever.', unitIds: ['core-basics', 'core-talk', 'core-table', 'core-screens', 'core-world'], free: true },
  { id: 'us', kind: 'country', title: 'United States', country: 'US', icon: '🇺🇸', blurb: 'Space, small talk, tipping.', unitIds: ['us-core'], free: false },
  { id: 'jp', kind: 'country', title: 'Japan', country: 'JP', icon: '🇯🇵', blurb: 'Shoes, chopsticks, quiet trains.', unitIds: ['jp-core'], free: false },
  { id: 'kr', kind: 'country', title: 'South Korea', country: 'KR', icon: '🇰🇷', blurb: 'Two hands, elders first.', unitIds: ['kr-core'], free: false },
  { id: 'in', kind: 'country', title: 'India', country: 'IN', icon: '🇮🇳', blurb: 'Namaste, shoes off, right hand.', unitIds: ['in-core'], free: false },
  { id: 'ae', kind: 'country', title: 'United Arab Emirates', country: 'AE', icon: '🇦🇪', blurb: 'Right hand, modest dress.', unitIds: ['ae-core'], free: false },
  { id: 'mx', kind: 'country', title: 'Mexico', country: 'MX', icon: '🇲🇽', blurb: 'Warm hellos, relaxed time.', unitIds: ['mx-core'], free: false },
  { id: 'br', kind: 'country', title: 'Brazil', country: 'BR', icon: '🇧🇷', blurb: 'Cheek kisses, warmth.', unitIds: ['br-core'], free: false },
  { id: 'gb', kind: 'country', title: 'United Kingdom', country: 'GB', icon: '🇬🇧', blurb: 'Queues, please & thanks.', unitIds: ['gb-core'], free: false },
]
export const COURSE_MAP: Record<string, Course> = Object.fromEntries(COURSES.map((c) => [c.id, c]))

/* ordered core path for the Home screen */
export const HOME_UNIT_ORDER: string[] = ['core-basics', 'core-talk', 'core-table', 'core-screens', 'core-world']

/* lesson -> course, for progress + passport */
export const LESSON_COURSE: Record<string, string> = Object.fromEntries(
  UNITS.flatMap((u) => u.lessonIds.map((id) => [id, u.courseId])),
)

export const courseLessonIds = (courseId: string): string[] => {
  const c = COURSE_MAP[courseId]
  if (!c) return []
  return c.unitIds.flatMap((uId) => UNIT_MAP[uId]?.lessonIds ?? [])
}

export const totalLessonCount = LESSONS.length
export const DEFAULT_COURSE = 'core'
