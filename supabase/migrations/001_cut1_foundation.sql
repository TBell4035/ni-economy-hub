-- ============================================================================
-- Migration 001: Cut 1 Foundation  (APPLIED to project kiwtvsvpfalekgzpclms)
-- Controller: Lough Signal Ltd
-- This file documents what is LIVE. It was applied via the Supabase connector
-- on 2026-08-24. Committed here so the repo is the source of truth.
--
-- NOTE: Migration 002 later restructured several of these tables. This file is
-- kept as the historical first migration; do not "fix" it to match current
-- state — 002 is what brings the schema to its current shape.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- wording_version: immutable registry of legal/consent wording shown to users.
create table public.wording_version (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null check (kind in ('privacy_notice','marketing_consent','research_consent','brief_terms')),
  version_label text not null,
  body          text not null,
  controller    text not null default 'Lough Signal Ltd',
  effective_from timestamptz not null default now(),
  is_current    boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (kind, version_label)
);

-- contact: a person in the funnel. (RESTRUCTURED in 002 — org link added.)
create table public.contact (
  id                 uuid primary key default gen_random_uuid(),
  email              citext not null,
  name               text,
  company_name       text,
  job_title          text,
  confirm_status     text not null default 'pending' check (confirm_status in ('pending','confirmed','bounced','unsubscribed')),
  confirm_token      uuid not null default gen_random_uuid(),
  confirm_sent_at    timestamptz,
  confirmed_at       timestamptz,
  wants_bespoke      boolean not null default false,
  last_brief_sent_at timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz
);
create unique index contact_email_live_uidx on public.contact (email) where deleted_at is null;
create index contact_confirm_token_idx on public.contact (confirm_token);
create index contact_confirm_status_idx on public.contact (confirm_status);

-- consent_event: append-only consent ledger.
create table public.consent_event (
  id                 uuid primary key default gen_random_uuid(),
  contact_id         uuid not null references public.contact(id) on delete cascade,
  purpose            text not null check (purpose in ('marketing','research')),
  action             text not null check (action in ('granted','withdrawn')),
  wording_version_id uuid references public.wording_version(id),
  source             text,
  ip_address         inet,
  user_agent         text,
  occurred_at        timestamptz not null default now()
);
create index consent_event_contact_idx on public.consent_event (contact_id, purpose, occurred_at desc);

-- profile_answer / brief / bespoke_interest: (DROPPED in 002 — funnel-specific.)
create table public.profile_answer (
  id           uuid primary key default gen_random_uuid(),
  contact_id   uuid not null references public.contact(id) on delete cascade,
  survey_wave  text not null default 'intake_v1',
  question_key text not null,
  answer       jsonb not null,
  created_at   timestamptz not null default now()
);
create index profile_answer_contact_idx on public.profile_answer (contact_id);
create index profile_answer_wave_key_idx on public.profile_answer (survey_wave, question_key);

create table public.brief (
  id                uuid primary key default gen_random_uuid(),
  contact_id        uuid not null references public.contact(id) on delete cascade,
  status            text not null default 'draft' check (status in ('draft','in_review','approved','sent','failed')),
  blocks_used       jsonb,
  content           jsonb,
  generated_at      timestamptz,
  review_started_at timestamptz,
  approved_at       timestamptz,
  approved_by       text,
  sent_at           timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index brief_contact_idx on public.brief (contact_id);
create index brief_status_idx on public.brief (status);

create table public.bespoke_interest (
  id           uuid primary key default gen_random_uuid(),
  contact_id   uuid not null references public.contact(id) on delete cascade,
  status       text not null default 'new' check (status in ('new','contacted','scoping','won','lost')),
  note         text,
  source       text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index bespoke_interest_contact_idx on public.bespoke_interest (contact_id);
create index bespoke_interest_status_idx on public.bespoke_interest (status);

-- audit_log: append-only accountability log.
create table public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor       text,
  action      text not null,
  entity_type text,
  entity_id   uuid,
  detail      jsonb,
  occurred_at timestamptz not null default now()
);
create index audit_log_entity_idx on public.audit_log (entity_type, entity_id);
create index audit_log_occurred_idx on public.audit_log (occurred_at desc);

-- updated_at trigger function (reused by 002).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger contact_set_updated_at before update on public.contact
  for each row execute function public.set_updated_at();
create trigger brief_set_updated_at before update on public.brief
  for each row execute function public.set_updated_at();
create trigger bespoke_interest_set_updated_at before update on public.bespoke_interest
  for each row execute function public.set_updated_at();

-- RLS: deny-all (no policies). Server-side service role only.
alter table public.wording_version   enable row level security;
alter table public.contact           enable row level security;
alter table public.consent_event     enable row level security;
alter table public.profile_answer    enable row level security;
alter table public.brief             enable row level security;
alter table public.bespoke_interest  enable row level security;
alter table public.audit_log         enable row level security;
