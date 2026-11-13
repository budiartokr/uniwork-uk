-- Run once in Supabase: SQL Editor > New query > paste > Run.
create table if not exists events (
  id bigint generated always as identity primary key,
  type text not null,
  partner text,
  sid text,
  page text,
  at timestamptz not null default now()
);
create table if not exists accounts (
  email text primary key,
  name text,
  country text,
  university text,
  city text,
  course_end date not null,
  consent boolean not null default false,
  verified boolean not null default false,
  token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists mentor_requests (
  id bigint generated always as identity primary key,
  name text, email text not null, country text, university text, city text,
  topic text, language text, times text, notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
create table if not exists reminders_sent (
  email text not null,
  kind text not null,
  sent_at timestamptz not null default now(),
  primary key (email, kind)
);
-- Lock the tables: only the server (service_role key) can read or write.
alter table events enable row level security;
alter table accounts enable row level security;
alter table mentor_requests enable row level security;
alter table reminders_sent enable row level security;

-- Fake-door results at a glance (SQL Editor):
-- select type, count(*) from events group by type order by 2 desc;

-- 13 Nov 2026: reminders for students who have not arrived yet.
-- Pre-departure sign-ups give a course start and/or flight date instead of a course end.
alter table accounts alter column course_end drop not null;
alter table accounts add column if not exists course_start date;
alter table accounts add column if not exists fly_date date;
alter table accounts add column if not exists source text;
