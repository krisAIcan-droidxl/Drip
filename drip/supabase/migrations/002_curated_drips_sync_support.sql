-- Supports syncing local MVP state to Supabase by mapping numeric local drip IDs
-- to remote UUID rows.

alter table public.drips
  add column if not exists local_id integer unique;

alter table public.user_drip_history
  add column if not exists local_entry_id text;

create unique index if not exists user_drip_history_local_entry_unique
  on public.user_drip_history(user_id, local_entry_id)
  where local_entry_id is not null;

insert into public.drip_categories (slug, label, description, sort_order)
values
  ('quote', 'Quote', 'Short words worth keeping.', 80),
  ('reflection', 'Reflection', 'Prompts for quiet reflection.', 90),
  ('question', 'Question', 'Questions that create useful pause.', 100),
  ('fact', 'Fact', 'Small facts that spark curiosity.', 110),
  ('insight', 'Insight', 'Compact perspective shifts.', 120)
on conflict (slug) do update
set label = excluded.label,
    description = excluded.description,
    sort_order = excluded.sort_order;

with curated(local_id, category_slug, body, author) as (
  values
  (1, 'question', 'If you could restart your life tomorrow, what would you keep exactly as it is?', null),
  (2, 'challenge', 'Send a message to someone you haven’t spoken to in over a year.', null),
  (3, 'insight', 'Most people wait for motivation before acting. The people who succeed act before motivation arrives.', null),
  (4, 'fact', 'Octopuses have three hearts and blue blood — and two of those hearts stop beating when they swim.', null),
  (5, 'reflection', 'What are you tolerating today that your future self will wish you had changed?', null),
  (6, 'quote', 'The quality of your life is determined by the quality of your questions.', null),
  (7, 'question', 'Who were you before the world told you who to be?', null),
  (8, 'challenge', 'Spend one hour today with your phone in another room.', null),
  (9, 'fact', 'Honey found sealed in ancient Egyptian tombs is still perfectly edible after 3,000 years.', null),
  (10, 'insight', 'You don’t find time for what matters. You make it — and the making is the proof that it matters.', null),
  (11, 'reflection', 'What would you attempt if you knew the attempt itself would change you?', null),
  (12, 'quote', 'We are what we repeatedly do.', 'Will Durant'),
  (13, 'question', 'What would you do differently if no one were watching?', null),
  (14, 'question', 'When did you last do something for the first time?', null),
  (15, 'question', 'What’s a belief you held five years ago that you no longer hold?', null),
  (16, 'question', 'If you had to teach one thing you know to a stranger, what would it be?', null),
  (17, 'question', 'What conversation have you been avoiding?', null),
  (18, 'question', 'What would your life look like if you trusted yourself completely?', null),
  (19, 'reflection', 'Notice the last time you felt fully present. What were you doing?', null),
  (20, 'reflection', 'What’s something you’ve outgrown but haven’t let go of?', null),
  (21, 'reflection', 'Where in your life are you choosing comfort over growth?', null),
  (22, 'reflection', 'What would you tell yourself at the start of this year?', null),
  (23, 'reflection', 'What’s the smallest thing that would make today better?', null),
  (24, 'reflection', 'Who in your life deserves more of your attention than they’re getting?', null),
  (25, 'reflection', 'What does ‘enough’ look like for you right now?', null),
  (26, 'challenge', 'Write down three things you’re grateful for before you check your phone tomorrow.', null),
  (27, 'challenge', 'Ask someone a question you actually want the answer to — and listen without planning your reply.', null),
  (28, 'challenge', 'Do the task you’ve been postponing for fifteen minutes today, even imperfectly.', null),
  (29, 'challenge', 'Compliment a stranger today, specifically and honestly.', null),
  (30, 'challenge', 'Take a walk with no destination and no headphones.', null),
  (31, 'challenge', 'Tell someone exactly how they helped you, even if it feels overdue.', null),
  (32, 'challenge', 'Spend ten minutes today learning something with no practical use.', null),
  (33, 'challenge', 'Say no to one thing today that you’d normally agree to out of habit.', null),
  (34, 'quote', 'Discipline is choosing between what you want now and what you want most.', null),
  (35, 'quote', 'Most regrets are not about what we did, but about what we never tried.', null),
  (36, 'quote', 'The questions you keep asking become the life you keep living.', null),
  (37, 'insight', 'Comfort and growth rarely share the same room.', null),
  (38, 'insight', 'The fastest way to feel behind is to compare your beginning to someone else’s middle.', null),
  (39, 'insight', 'What you tolerate, you teach the world to keep giving you.', null),
  (40, 'fact', 'A single bolt of lightning carries enough energy to toast about 100,000 slices of bread.', null),
  (41, 'fact', 'Bananas are botanically classified as berries — strawberries, surprisingly, are not.', null),
  (42, 'fact', 'The Eiffel Tower can grow more than six inches taller in summer from thermal expansion.', null),
  (43, 'fact', 'Wombat droppings are cube-shaped, which keeps them from rolling away and marks territory more effectively.', null),
  (44, 'happy', 'Think of one tiny thing that went right today. Let it count.', null),
  (45, 'happy', 'Play a song that makes you feel lighter, even if only for three minutes.', null),
  (46, 'happy', 'Your day does not need to be perfect to contain something worth smiling about.', null),
  (47, 'happy', 'Send someone a simple message: ‘I’m glad you exist.’', null),
  (48, 'happy', 'Step outside for one minute and notice the sky like you have never seen it before.', null),
  (49, 'happy', 'Name three ordinary things that quietly make your life better.', null),
  (50, 'happy', 'Do one small kind thing anonymously today. Let that be enough.', null),
  (51, 'happy', 'Remember a moment you laughed so hard you forgot everything else.', null),
  (52, 'happy', 'Take the scenic route for one tiny part of your day.', null),
  (53, 'happy', 'Someone, somewhere, is having a better day because you are in their life.', null),
  (54, 'grateful', 'Name one person who made your life easier this week. Let yourself feel that fully.', null),
  (55, 'grateful', 'What is something ordinary you would miss immediately if it disappeared tomorrow?', null),
  (56, 'grateful', 'Think of a problem you no longer have. That used to be something you wished for.', null),
  (57, 'grateful', 'Notice one comfort around you right now that past-you would have appreciated.', null),
  (58, 'grateful', 'Send a quiet thank-you to someone who helped shape the person you are becoming.', null),
  (59, 'grateful', 'What did your body do for you today without asking for credit?', null),
  (60, 'grateful', 'Look around and find three things that are silently supporting your day.', null),
  (61, 'grateful', 'Remember a kindness you received that you never fully thanked someone for.', null),
  (62, 'grateful', 'What is one small freedom in your life that you rarely stop to appreciate?', null),
  (63, 'grateful', 'Let today’s gratitude be specific: one face, one place, one moment.', null)
)
insert into public.drips (local_id, category_id, body, author, source, is_active, is_premium, safety_status)
select
  curated.local_id,
  categories.id,
  curated.body,
  curated.author,
  'curated',
  true,
  false,
  'approved'
from curated
join public.drip_categories categories on categories.slug = curated.category_slug
on conflict (local_id) do update
set category_id = excluded.category_id,
    body = excluded.body,
    author = excluded.author,
    source = excluded.source,
    is_active = excluded.is_active,
    is_premium = excluded.is_premium,
    safety_status = excluded.safety_status,
    updated_at = now();
