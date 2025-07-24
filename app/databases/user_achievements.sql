create table public.user_achievements (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  achievement_type character varying(50) not null,
  achievement_name character varying(255) not null,
  achievement_description text null,
  earned_at timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  constraint user_achievements_pkey primary key (id),
  constraint user_achievements_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_user_achievements_user_id on public.user_achievements using btree (user_id) TABLESPACE pg_default;
