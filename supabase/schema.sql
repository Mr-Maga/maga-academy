-- ============================================================================
-- Maga Academy — full database schema (Supabase / Postgres)
-- Run this once in the Supabase SQL Editor. Safe to re-run.
--
-- Security model:
--   * Roles are claimed ONCE via claim_role() (SECURITY DEFINER) — codes live
--     here in the database, never in the app, so users cannot self-escalate.
--   * A BEFORE UPDATE guard trigger blocks non-admins from changing
--     role / access / level / group / code_claimed on their profile.
--   * RLS makes every role see only what it should (parents see only their
--     linked child).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin create type public.user_role as enum ('admin','teacher','student','parent'); exception when duplicate_object then null; end $$;
do $$ begin create type public.level_key as enum ('a1','a2','b1','b2','cefr','ielts'); exception when duplicate_object then null; end $$;
do $$ begin create type public.skill as enum ('listening','reading','writing','speaking'); exception when duplicate_object then null; end $$;
do $$ begin create type public.access_status as enum ('pending','active','locked'); exception when duplicate_object then null; end $$;
do $$ begin create type public.feedback_kind as enum ('complaint','feedback','placement','system'); exception when duplicate_object then null; end $$;
do $$ begin create type public.feedback_source as enum ('telegram','web'); exception when duplicate_object then null; end $$;
do $$ begin create type public.submission_status as enum ('submitted','graded'); exception when duplicate_object then null; end $$;

-- add 'suggestion' to feedback_kind (covers databases created before this value existed)
alter type public.feedback_kind add value if not exists 'suggestion';

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  full_name text,
  role public.user_role,
  level public.level_key,
  group_id uuid,
  access_status public.access_status not null default 'pending',
  access_expires_at timestamptz,
  daily_goal int not null default 20,
  code_claimed boolean not null default false,
  learning_path text check (learning_path in ('ielts','general')),
  target_bands jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level public.level_key not null,
  teacher_id uuid references public.profiles(id) on delete set null,
  schedule text,
  created_at timestamptz not null default now()
);

do $$ begin
  alter table public.profiles
    add constraint profiles_group_fk foreign key (group_id)
    references public.groups(id) on delete set null;
exception when duplicate_object then null; end $$;

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level public.level_key not null,
  skill public.skill not null,
  group_id uuid references public.groups(id) on delete set null,
  file_path text,
  video_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.homework (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level public.level_key not null,
  skill public.skill,
  group_id uuid references public.groups(id) on delete set null,
  due_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.homework(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  body text,
  file_path text,
  status public.submission_status not null default 'submitted',
  score numeric,
  max_score numeric default 100,
  comment text,
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  graded_by uuid references public.profiles(id) on delete set null,
  unique (homework_id, student_id)
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  skill public.skill,
  homework_id uuid references public.homework(id) on delete set null,
  value numeric not null,
  max_value numeric not null default 100,
  comment text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (parent_id, student_id)
);

create table if not exists public.streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active date,
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  kind public.feedback_kind not null default 'feedback',
  source public.feedback_source not null default 'web',
  message text not null,
  telegram_username text,
  level public.level_key,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- evaluations (AI Writing + Speaking history)
do $$ begin
  create type public.eval_kind as enum ('writing', 'speaking');
exception when duplicate_object then null; end $$;

create table if not exists public.evaluations (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  kind          public.eval_kind not null,
  sub_type      text,
  question      text,
  answer        text,
  overall_band  numeric(3,1) not null,
  result        jsonb not null,
  created_at    timestamptz not null default now()
);

-- app settings: a single editable row holding academy info (prices, schedule,
-- contact) so the admin can change it in-app without editing code.
create table if not exists public.app_settings (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint app_settings_single_row check (id = 1)
);
insert into public.app_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_group on public.profiles(group_id);
create index if not exists idx_profiles_level on public.profiles(level);
create index if not exists idx_materials_level_skill on public.materials(level, skill);
create index if not exists idx_homework_level on public.homework(level);
create index if not exists idx_submissions_student on public.submissions(student_id);
create index if not exists idx_scores_student on public.scores(student_id);
create index if not exists idx_parent_links_parent on public.parent_links(parent_id);
create index if not exists idx_parent_links_student on public.parent_links(student_id);
create index if not exists idx_feedback_kind_created on public.feedback(kind, created_at desc);
create index if not exists idx_evaluations_student_kind on public.evaluations(student_id, kind, created_at desc);

-- ----------------------------------------------------------------------------
-- SECURITY DEFINER helpers (used inside RLS — they bypass RLS on profiles, so
-- there is no recursion).
-- ----------------------------------------------------------------------------
create or replace function public.get_my_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','teacher'));
$$;

create or replace function public.has_active_access()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        p.role in ('admin','teacher')
        or (p.access_status = 'active' and (p.access_expires_at is null or p.access_expires_at > now()))
      )
  );
$$;

create or replace function public.my_level()
returns public.level_key language sql stable security definer set search_path = public as $$
  select level from public.profiles where id = auth.uid();
$$;

create or replace function public.my_group()
returns uuid language sql stable security definer set search_path = public as $$
  select group_id from public.profiles where id = auth.uid();
$$;

-- ----------------------------------------------------------------------------
-- New-user trigger: every auth.users row gets a profile (role unset, pending).
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Guard trigger: non-admins cannot change privileged profile fields. The
-- claim_role() function sets a transaction-local bypass so the one-time claim
-- is allowed.
-- ----------------------------------------------------------------------------
create or replace function public.guard_profile_changes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() or coalesce(current_setting('app.bypass_profile_guard', true), '') = 'on' then
    return new;
  end if;

  if new.role is distinct from old.role
     or new.access_status is distinct from old.access_status
     or new.access_expires_at is distinct from old.access_expires_at
     or new.level is distinct from old.level
     or new.group_id is distinct from old.group_id
     or new.code_claimed is distinct from old.code_claimed
     or new.id is distinct from old.id
     or new.email is distinct from old.email then
    raise exception 'Not allowed to change role/access fields.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_profile_update on public.profiles;
create trigger guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_changes();

-- Guard trigger: students cannot modify grading fields on their submissions.
create or replace function public.guard_submission()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and not public.is_staff() then
    if new.score is distinct from old.score
       or new.max_score is distinct from old.max_score
       or new.status is distinct from old.status
       or new.comment is distinct from old.comment
       or new.graded_by is distinct from old.graded_by
       or new.graded_at is distinct from old.graded_at
       or new.student_id is distinct from old.student_id
       or new.homework_id is distinct from old.homework_id then
      raise exception 'Students cannot modify grading fields.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_submission_update on public.submissions;
create trigger guard_submission_update
  before update on public.submissions
  for each row execute function public.guard_submission();

-- ----------------------------------------------------------------------------
-- RPC: claim_role — the ONE place codes map to roles. SECURITY DEFINER.
-- ----------------------------------------------------------------------------
create or replace function public.claim_role(p_code text, p_is_parent boolean default false)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_role public.user_role;
  v_status public.access_status;
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_profile from public.profiles where id = v_uid for update;
  if v_profile.code_claimed then
    raise exception 'Role already claimed';
  end if;

  if p_code = '99maga00' then
    v_role := 'admin'; v_status := 'active';
  elsif p_code = 'askelad' then
    v_role := 'teacher'; v_status := 'active';
  elsif p_code = 'kuroku' then
    if p_is_parent then v_role := 'parent'; else v_role := 'student'; end if;
    v_status := 'pending';
  else
    raise exception 'Invalid code';
  end if;

  perform set_config('app.bypass_profile_guard', 'on', true);

  update public.profiles
     set role = v_role,
         access_status = v_status,
         code_claimed = true
   where id = v_uid
  returning * into v_profile;

  return v_profile;
end;
$$;

-- ----------------------------------------------------------------------------
-- RPC: touch_streak — call once per day when the student practises.
-- ----------------------------------------------------------------------------
create or replace function public.touch_streak()
returns public.streaks language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_row public.streaks;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;

  insert into public.streaks as s (user_id, current_streak, longest_streak, last_active)
  values (v_uid, 1, 1, current_date)
  on conflict (user_id) do update
    set current_streak = case
          when s.last_active = current_date then s.current_streak
          when s.last_active = current_date - 1 then s.current_streak + 1
          else 1
        end,
        last_active = current_date,
        updated_at = now()
  returning * into v_row;

  update public.streaks
     set longest_streak = greatest(longest_streak, current_streak)
   where user_id = v_uid
  returning * into v_row;

  return v_row;
end;
$$;

-- ----------------------------------------------------------------------------
-- RPC: get_leaderboard — overall + within-group ranks from teacher scores.
-- Staff see everyone; a student sees only their own level.
-- ----------------------------------------------------------------------------
create or replace function public.get_leaderboard(p_level public.level_key default null)
returns table (
  student_id uuid,
  full_name text,
  level public.level_key,
  group_id uuid,
  group_name text,
  total_score numeric,
  avg_percent numeric,
  rank_overall int,
  rank_in_group int
) language plpgsql stable security definer set search_path = public as $$
declare
  v_is_staff boolean := public.is_staff();
  v_my_level public.level_key := (select level from public.profiles where id = auth.uid());
begin
  return query
  with agg as (
    select s.student_id,
           sum(s.value) as total_score,
           round(avg(s.value / nullif(s.max_value, 0) * 100)::numeric, 1) as avg_percent
    from public.scores s
    group by s.student_id
  ),
  joined as (
    select p.id as student_id, p.full_name, p.level, p.group_id, g.name as group_name,
           coalesce(a.total_score, 0) as total_score,
           coalesce(a.avg_percent, 0) as avg_percent
    from public.profiles p
    left join agg a on a.student_id = p.id
    left join public.groups g on g.id = p.group_id
    where p.role = 'student'
      and (
        v_is_staff
        or (p_level is not null and p.level = p_level)
        or (p_level is null and p.level is not distinct from v_my_level)
      )
  )
  select j.student_id, j.full_name, j.level, j.group_id, j.group_name,
         j.total_score, j.avg_percent,
         rank() over (order by j.avg_percent desc, j.total_score desc)::int,
         rank() over (partition by j.group_id order by j.avg_percent desc, j.total_score desc)::int
  from joined j
  order by j.avg_percent desc, j.total_score desc;
end;
$$;

-- ----------------------------------------------------------------------------
-- RPC: student_progress — JSON progress for a student. A student sees their
-- own; staff see anyone; a parent sees only their linked child.
-- ----------------------------------------------------------------------------
create or replace function public.student_progress(p_student uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_target uuid := coalesce(p_student, v_uid);
  v_allowed boolean;
  v_points jsonb;
  v_completion numeric;
  v_weakest public.skill;
  v_streak int;
  v_goal int;
  v_level public.level_key;
  v_group uuid;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;

  v_allowed := (
    v_target = v_uid
    or public.is_staff()
    or exists (select 1 from public.parent_links pl where pl.parent_id = v_uid and pl.student_id = v_target)
  );
  if not v_allowed then raise exception 'Not allowed'; end if;

  select level, group_id into v_level, v_group from public.profiles where id = v_target;

  select coalesce(jsonb_agg(jsonb_build_object('bucket', b, 'avg_percent', ap, 'total', t) order by b), '[]'::jsonb)
  into v_points
  from (
    select to_char(date_trunc('week', created_at), 'YYYY-MM-DD') as b,
           round(avg(value / nullif(max_value, 0) * 100)::numeric, 1) as ap,
           count(*)::int as t
    from public.scores
    where student_id = v_target and created_at > now() - interval '12 weeks'
    group by date_trunc('week', created_at)
  ) q;

  select case when count(h.*) = 0 then 0
              else round(100.0 * count(sub.id) / count(h.*)) end
  into v_completion
  from public.homework h
  left join public.submissions sub on sub.homework_id = h.id and sub.student_id = v_target
  where h.level is not distinct from v_level
    and (h.group_id is null or h.group_id = v_group);

  select skill into v_weakest
  from public.scores
  where student_id = v_target and skill is not null
  group by skill
  order by avg(value / nullif(max_value, 0)) asc
  limit 1;

  select coalesce(current_streak, 0) into v_streak from public.streaks where user_id = v_target;
  select coalesce(daily_goal, 20) into v_goal from public.profiles where id = v_target;

  return jsonb_build_object(
    'points', v_points,
    'homework_completion', coalesce(v_completion, 0),
    'weakest_skill', v_weakest,
    'current_streak', coalesce(v_streak, 0),
    'daily_goal', coalesce(v_goal, 20)
  );
end;
$$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.groups        enable row level security;
alter table public.materials     enable row level security;
alter table public.homework      enable row level security;
alter table public.submissions   enable row level security;
alter table public.scores        enable row level security;
alter table public.parent_links  enable row level security;
alter table public.streaks       enable row level security;
alter table public.feedback      enable row level security;
alter table public.evaluations   enable row level security;
alter table public.app_settings  enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (
  id = auth.uid()
  or public.is_staff()
  or exists (select 1 from public.parent_links pl where pl.parent_id = auth.uid() and pl.student_id = profiles.id)
);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin on public.profiles for delete using (public.is_admin());

-- groups
drop policy if exists groups_select on public.groups;
create policy groups_select on public.groups for select using (
  public.is_staff()
  or id = public.my_group()
  or exists (
    select 1 from public.parent_links pl
    join public.profiles c on c.id = pl.student_id
    where pl.parent_id = auth.uid() and c.group_id = groups.id
  )
);
drop policy if exists groups_insert_admin on public.groups;
create policy groups_insert_admin on public.groups for insert with check (public.is_admin());
drop policy if exists groups_update_staff on public.groups;
create policy groups_update_staff on public.groups for update using (public.is_admin() or teacher_id = auth.uid()) with check (public.is_admin() or teacher_id = auth.uid());
drop policy if exists groups_delete_admin on public.groups;
create policy groups_delete_admin on public.groups for delete using (public.is_admin());

-- materials
drop policy if exists materials_select on public.materials;
create policy materials_select on public.materials for select using (
  public.is_staff()
  or (
    public.has_active_access()
    and level = public.my_level()
    and (group_id is null or group_id = public.my_group())
  )
);
drop policy if exists materials_insert_staff on public.materials;
create policy materials_insert_staff on public.materials for insert with check (public.is_staff());
drop policy if exists materials_update_staff on public.materials;
create policy materials_update_staff on public.materials for update using (public.is_staff()) with check (public.is_staff());
drop policy if exists materials_delete_staff on public.materials;
create policy materials_delete_staff on public.materials for delete using (public.is_staff());

-- homework
drop policy if exists homework_select on public.homework;
create policy homework_select on public.homework for select using (
  public.is_staff()
  or (
    public.has_active_access()
    and level = public.my_level()
    and (group_id is null or group_id = public.my_group())
  )
);
drop policy if exists homework_insert_staff on public.homework;
create policy homework_insert_staff on public.homework for insert with check (public.is_staff());
drop policy if exists homework_update_staff on public.homework;
create policy homework_update_staff on public.homework for update using (public.is_staff()) with check (public.is_staff());
drop policy if exists homework_delete_staff on public.homework;
create policy homework_delete_staff on public.homework for delete using (public.is_staff());

-- submissions
drop policy if exists submissions_select on public.submissions;
create policy submissions_select on public.submissions for select using (
  student_id = auth.uid() or public.is_staff()
);
drop policy if exists submissions_insert_own on public.submissions;
create policy submissions_insert_own on public.submissions for insert with check (
  student_id = auth.uid() and public.has_active_access()
);
drop policy if exists submissions_update_own on public.submissions;
create policy submissions_update_own on public.submissions for update using (student_id = auth.uid()) with check (student_id = auth.uid());
drop policy if exists submissions_update_staff on public.submissions;
create policy submissions_update_staff on public.submissions for update using (public.is_staff()) with check (public.is_staff());
drop policy if exists submissions_delete on public.submissions;
create policy submissions_delete on public.submissions for delete using (public.is_staff() or student_id = auth.uid());

-- scores
drop policy if exists scores_select on public.scores;
create policy scores_select on public.scores for select using (
  student_id = auth.uid() or public.is_staff()
);
drop policy if exists scores_insert_staff on public.scores;
create policy scores_insert_staff on public.scores for insert with check (public.is_staff());
drop policy if exists scores_update_staff on public.scores;
create policy scores_update_staff on public.scores for update using (public.is_staff()) with check (public.is_staff());
drop policy if exists scores_delete_staff on public.scores;
create policy scores_delete_staff on public.scores for delete using (public.is_staff());

-- parent_links
drop policy if exists parent_links_select on public.parent_links;
create policy parent_links_select on public.parent_links for select using (
  parent_id = auth.uid() or student_id = auth.uid() or public.is_staff()
);
drop policy if exists parent_links_insert_admin on public.parent_links;
create policy parent_links_insert_admin on public.parent_links for insert with check (public.is_admin());
drop policy if exists parent_links_delete_admin on public.parent_links;
create policy parent_links_delete_admin on public.parent_links for delete using (public.is_admin());

-- streaks
drop policy if exists streaks_select on public.streaks;
create policy streaks_select on public.streaks for select using (
  user_id = auth.uid()
  or public.is_staff()
  or exists (select 1 from public.parent_links pl where pl.parent_id = auth.uid() and pl.student_id = streaks.user_id)
);
drop policy if exists streaks_insert_own on public.streaks;
create policy streaks_insert_own on public.streaks for insert with check (user_id = auth.uid());
drop policy if exists streaks_update_own on public.streaks;
create policy streaks_update_own on public.streaks for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- feedback
drop policy if exists feedback_insert on public.feedback;
create policy feedback_insert on public.feedback for insert with check (user_id = auth.uid());
drop policy if exists feedback_select on public.feedback;
create policy feedback_select on public.feedback for select using (public.is_staff() or user_id = auth.uid());
drop policy if exists feedback_update_staff on public.feedback;
create policy feedback_update_staff on public.feedback for update using (public.is_staff()) with check (public.is_staff());

-- evaluations (AI Writing/Speaking history): a student sees their own; staff see
-- all; a parent sees their linked child's. Students insert their own only.
drop policy if exists evaluations_select on public.evaluations;
create policy evaluations_select on public.evaluations for select using (
  student_id = auth.uid()
  or public.is_staff()
  or exists (select 1 from public.parent_links pl where pl.parent_id = auth.uid() and pl.student_id = evaluations.student_id)
);
drop policy if exists evaluations_insert_own on public.evaluations;
create policy evaluations_insert_own on public.evaluations for insert with check (
  student_id = auth.uid() and public.has_active_access()
);
drop policy if exists evaluations_delete on public.evaluations;
create policy evaluations_delete on public.evaluations for delete using (
  student_id = auth.uid() or public.is_staff()
);

-- app_settings: anyone signed in can read; only admins can change.
drop policy if exists app_settings_select on public.app_settings;
create policy app_settings_select on public.app_settings for select using (true);
drop policy if exists app_settings_update_admin on public.app_settings;
create policy app_settings_update_admin on public.app_settings for update using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Vocabulary flashcards + spaced-repetition progress
-- ----------------------------------------------------------------------------
create table if not exists public.vocab_cards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade, -- null = curated/global deck
  word text not null,
  meaning text not null,
  example text,
  translation text,
  level public.level_key,
  created_at timestamptz not null default now()
);

create table if not exists public.vocab_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid not null references public.vocab_cards(id) on delete cascade,
  box int not null default 0,            -- Leitner box 0..5 -> intervals 1,2,4,8,16,30 days
  due_at date not null default current_date,
  ease int not null default 0,
  wrong_count int not null default 0,    -- times marked "didn't know"
  status text not null default 'new',    -- new | learning | known | hard
  last_reviewed_at timestamptz,
  unique (student_id, card_id)
);

create index if not exists idx_vocab_cards_owner on public.vocab_cards(owner_id);
create index if not exists idx_vocab_cards_level on public.vocab_cards(level);
create index if not exists idx_vocab_progress_due on public.vocab_progress(student_id, due_at);
create index if not exists idx_vocab_progress_hard on public.vocab_progress(student_id, wrong_count);

alter table public.vocab_cards enable row level security;
alter table public.vocab_progress enable row level security;

drop policy if exists vocab_cards_select on public.vocab_cards;
create policy vocab_cards_select on public.vocab_cards for select using (
  owner_id is null or owner_id = auth.uid() or public.is_staff()
);
drop policy if exists vocab_cards_insert on public.vocab_cards;
create policy vocab_cards_insert on public.vocab_cards for insert with check (
  owner_id = auth.uid() or public.is_staff()
);
drop policy if exists vocab_cards_delete on public.vocab_cards;
create policy vocab_cards_delete on public.vocab_cards for delete using (
  owner_id = auth.uid() or public.is_admin()
);

drop policy if exists vocab_progress_select on public.vocab_progress;
create policy vocab_progress_select on public.vocab_progress for select using (
  student_id = auth.uid() or public.is_staff()
);
drop policy if exists vocab_progress_insert on public.vocab_progress;
create policy vocab_progress_insert on public.vocab_progress for insert with check (student_id = auth.uid());
drop policy if exists vocab_progress_update on public.vocab_progress;
create policy vocab_progress_update on public.vocab_progress for update using (student_id = auth.uid()) with check (student_id = auth.uid());

-- Named vocabulary sets ("day1", "for writing", ...) like Quizlet folders
create table if not exists public.vocab_sets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.vocab_cards add column if not exists set_id uuid references public.vocab_sets(id) on delete cascade;
create index if not exists idx_vocab_cards_set on public.vocab_cards(set_id);
create index if not exists idx_vocab_sets_owner on public.vocab_sets(owner_id);

alter table public.vocab_sets enable row level security;
drop policy if exists vocab_sets_select on public.vocab_sets;
create policy vocab_sets_select on public.vocab_sets for select using (owner_id = auth.uid() or public.is_staff());
drop policy if exists vocab_sets_insert on public.vocab_sets;
create policy vocab_sets_insert on public.vocab_sets for insert with check (owner_id = auth.uid() or public.is_staff());
drop policy if exists vocab_sets_delete on public.vocab_sets;
create policy vocab_sets_delete on public.vocab_sets for delete using (owner_id = auth.uid() or public.is_admin());

-- AI translator history
create table if not exists public.vocab_lookups (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  query text not null,
  word text,
  result jsonb not null,
  added boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_vocab_lookups_student on public.vocab_lookups(student_id, created_at desc);

alter table public.vocab_lookups enable row level security;
drop policy if exists vocab_lookups_select on public.vocab_lookups;
create policy vocab_lookups_select on public.vocab_lookups for select using (student_id = auth.uid() or public.is_staff());
drop policy if exists vocab_lookups_insert on public.vocab_lookups;
create policy vocab_lookups_insert on public.vocab_lookups for insert with check (student_id = auth.uid());
drop policy if exists vocab_lookups_update on public.vocab_lookups;
create policy vocab_lookups_update on public.vocab_lookups for update using (student_id = auth.uid()) with check (student_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Storage buckets + policies
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('materials', 'materials', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('submissions', 'submissions', false)
  on conflict (id) do nothing;

-- materials: staff upload; students read their own level (path: <level>/<file>)
drop policy if exists "materials read" on storage.objects;
create policy "materials read" on storage.objects for select using (
  bucket_id = 'materials' and (
    public.is_staff()
    or (public.has_active_access() and (storage.foldername(name))[1] = public.my_level()::text)
  )
);
drop policy if exists "materials write staff" on storage.objects;
create policy "materials write staff" on storage.objects for insert with check (
  bucket_id = 'materials' and public.is_staff()
);
drop policy if exists "materials update staff" on storage.objects;
create policy "materials update staff" on storage.objects for update using (
  bucket_id = 'materials' and public.is_staff()
);
drop policy if exists "materials delete staff" on storage.objects;
create policy "materials delete staff" on storage.objects for delete using (
  bucket_id = 'materials' and public.is_staff()
);

-- submissions: each student writes/reads their own folder (path: <uid>/<file>)
drop policy if exists "submissions read" on storage.objects;
create policy "submissions read" on storage.objects for select using (
  bucket_id = 'submissions' and (
    public.is_staff() or (storage.foldername(name))[1] = auth.uid()::text
  )
);
drop policy if exists "submissions insert own" on storage.objects;
create policy "submissions insert own" on storage.objects for insert with check (
  bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text and public.has_active_access()
);
drop policy if exists "submissions update own" on storage.objects;
create policy "submissions update own" on storage.objects for update using (
  bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text
);
drop policy if exists "submissions delete own" on storage.objects;
create policy "submissions delete own" on storage.objects for delete using (
  bucket_id = 'submissions' and (public.is_staff() or (storage.foldername(name))[1] = auth.uid()::text)
);

-- ----------------------------------------------------------------------------
-- Grants (RLS still restricts rows; these grant the verbs)
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;

-- claim_role / RPCs available to signed-in users only
revoke all on function public.claim_role(text, boolean) from anon;
revoke all on function public.touch_streak() from anon;

-- ----------------------------------------------------------------------------
-- daily_tasks: a student's self-set study plan for a given day. Created via the
-- Maga planner ("tell Maga what you'll do today"); progress (done/total) shows
-- on the dashboard. RLS: students manage their own; staff may read.
-- ----------------------------------------------------------------------------
create table if not exists public.daily_tasks (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  tool        text check (tool in ('writing','speaking','vocab','exercises','reading','listening')),
  done        boolean not null default false,
  task_date   date not null default current_date,
  created_at  timestamptz not null default now()
);

create index if not exists idx_daily_tasks_student_date on public.daily_tasks(student_id, task_date);

alter table public.daily_tasks enable row level security;

drop policy if exists daily_tasks_select on public.daily_tasks;
create policy daily_tasks_select on public.daily_tasks for select using (student_id = auth.uid() or public.is_staff());
drop policy if exists daily_tasks_insert on public.daily_tasks;
create policy daily_tasks_insert on public.daily_tasks for insert with check (student_id = auth.uid());
drop policy if exists daily_tasks_update on public.daily_tasks;
create policy daily_tasks_update on public.daily_tasks for update using (student_id = auth.uid()) with check (student_id = auth.uid());
drop policy if exists daily_tasks_delete on public.daily_tasks;
create policy daily_tasks_delete on public.daily_tasks for delete using (student_id = auth.uid());
