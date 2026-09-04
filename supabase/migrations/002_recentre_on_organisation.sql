-- ============================================================================
-- Migration 002: Re-centre on organisation -> opportunity -> engagement
-- (APPLIED to project kiwtvsvpfalekgzpclms on 2026-08-24)
--
-- Lough Signal is an evidence-led transformation consultancy; the Hub is the
-- acquisition engine. This migration moves the data model's centre from
-- contact/subscription to organisation/opportunity. Applied when all data
-- tables were empty except wording_version (4 seeded rows, preserved).
-- ============================================================================

-- Drop the funnel-specific tables (were empty). Keep wording_version, audit_log.
drop view if exists public.consent_current;
drop table if exists public.brief cascade;
drop table if exists public.bespoke_interest cascade;
drop table if exists public.profile_answer cascade;
drop table if exists public.consent_event cascade;
drop table if exists public.contact cascade;

-- service: productised offerings (lookup). Seeded with the 3 entry products.
create table public.service (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  name          text not null,
  tier          text not null default 'entry' check (tier in ('entry','core','major','retainer')),
  typical_min_gbp integer,
  typical_max_gbp integer,
  description   text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

insert into public.service (code, name, tier, typical_min_gbp, typical_max_gbp, description, sort_order) values
('economic_evidence_brief','Economic Evidence Brief','entry',500,1500,
  'Fixed-scope economic analysis of a specific business question, grounded in evidence and transparent sourcing.',1),
('market_opportunity_snapshot','Market Opportunity Snapshot','entry',1000,4000,
  'Assessment of a market/expansion opportunity: size, conditions, competition, costs, risks, investment.',2),
('data_process_systems_review','Data, Process & Systems Review','core',1500,4000,
  'Diagnostic of how an organisation operates: workflows, systems, MI, manual effort, automation and AI opportunities.',3),
('larger_research_transformation','Larger Research / Transformation','major',5000,15000,
  'Deeper research, business case, transformation advisory or implementation oversight. Scoped per engagement.',4),
('ongoing_advisory','Ongoing Advisory / Retainer','retainer',null,null,
  'Repeat or retained advisory relationship following an initial engagement.',5);

-- organisation: the centre of the model.
create table public.organisation (
  id            uuid primary key default gen_random_uuid(),
  name          text,
  sector        text,
  size_band     text check (size_band in ('sole','micro_1_9','small_10_49','medium_50_249','large_250_plus','public_sector','third_sector')),
  location      text,
  website       text,
  source        text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index organisation_sector_idx on public.organisation (sector);
create index organisation_size_idx on public.organisation (size_band);

-- contact: a person, hanging off an organisation. Compliance spine attaches here.
create table public.contact (
  id                 uuid primary key default gen_random_uuid(),
  organisation_id    uuid references public.organisation(id) on delete set null,
  email              citext not null,
  name               text,
  job_title          text,
  relationship       text default 'prospect' check (relationship in ('subscriber','prospect','client','past_client','partner')),
  confirm_status     text not null default 'pending' check (confirm_status in ('pending','confirmed','bounced','unsubscribed')),
  confirm_token      uuid not null default gen_random_uuid(),
  confirm_sent_at    timestamptz,
  confirmed_at       timestamptz,
  lead_source        text,
  lead_source_detail text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz
);
create unique index contact_email_live_uidx on public.contact (email) where deleted_at is null;
create index contact_org_idx on public.contact (organisation_id);
create index contact_confirm_token_idx on public.contact (confirm_token);
create index contact_relationship_idx on public.contact (relationship);

-- consent_event: append-only (rebuilt against new contact).
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

-- consent_current: current consent per (contact,purpose). security_invoker so
-- the caller's RLS applies (clears the Supabase advisor warning).
create view public.consent_current
with (security_invoker = true) as
select distinct on (contact_id, purpose)
       contact_id, purpose, action, wording_version_id, occurred_at
from public.consent_event
order by contact_id, purpose, occurred_at desc;

-- opportunity: a recognised chance to do paid work. The heart of "who pays".
create table public.opportunity (
  id                uuid primary key default gen_random_uuid(),
  organisation_id   uuid not null references public.organisation(id) on delete cascade,
  primary_contact_id uuid references public.contact(id) on delete set null,
  service_id        uuid references public.service(id),
  title             text,
  problem           text,
  trigger           text,
  source            text,
  status            text not null default 'new' check (status in ('new','qualifying','proposal','won','lost','on_hold')),
  estimated_value_gbp integer,
  proposal_value_gbp  integer,
  won_lost_reason   text,
  next_action       text,
  next_action_date  date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index opportunity_org_idx on public.opportunity (organisation_id);
create index opportunity_status_idx on public.opportunity (status);
create index opportunity_service_idx on public.opportunity (service_id);

-- engagement: a won opportunity delivered as paid work. Commercial facts only;
-- baseline/recommendation/outcome measurement DEFERRED until first real work.
create table public.engagement (
  id                uuid primary key default gen_random_uuid(),
  opportunity_id    uuid references public.opportunity(id) on delete set null,
  organisation_id   uuid not null references public.organisation(id) on delete cascade,
  service_id        uuid references public.service(id),
  title             text,
  status            text not null default 'scoped' check (status in ('scoped','in_progress','delivered','closed')),
  quoted_fee_gbp    integer,
  accepted_fee_gbp  integer,
  hours_spent       numeric(6,1),
  subcontractor_cost_gbp integer,
  follow_on_revenue_gbp  integer,
  stripe_payment_ref text,
  paid_at            timestamptz,
  started_on        date,
  delivered_on      date,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index engagement_org_idx on public.engagement (organisation_id);
create index engagement_opportunity_idx on public.engagement (opportunity_id);
create index engagement_status_idx on public.engagement (status);

-- updated_at triggers (set_updated_at() defined in 001).
create trigger organisation_set_updated_at before update on public.organisation
  for each row execute function public.set_updated_at();
create trigger contact_set_updated_at before update on public.contact
  for each row execute function public.set_updated_at();
create trigger opportunity_set_updated_at before update on public.opportunity
  for each row execute function public.set_updated_at();
create trigger engagement_set_updated_at before update on public.engagement
  for each row execute function public.set_updated_at();

-- RLS: deny-all on every table. Server-side service role only.
alter table public.service        enable row level security;
alter table public.organisation   enable row level security;
alter table public.contact        enable row level security;
alter table public.consent_event  enable row level security;
alter table public.opportunity    enable row level security;
alter table public.engagement     enable row level security;
