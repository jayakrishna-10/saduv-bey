create table public.processing_history (
  id uuid not null default gen_random_uuid (),
  question_id uuid null,
  stage character varying(50) not null,
  status character varying(20) not null,
  attempt_number integer null default 1,
  error_message text null,
  processing_time_ms integer null,
  metadata jsonb null,
  created_at timestamp with time zone null default now(),
  constraint processing_history_pkey primary key (id),
  constraint processing_history_question_id_fkey foreign KEY (question_id) references kind_of_old_questions (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_processing_history_question on public.processing_history using btree (question_id) TABLESPACE pg_default;

create index IF not exists idx_processing_history_stage on public.processing_history using btree (stage) TABLESPACE pg_default;

create index IF not exists idx_processing_history_status on public.processing_history using btree (status) TABLESPACE pg_default;
