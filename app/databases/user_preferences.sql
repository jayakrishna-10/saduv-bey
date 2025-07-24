create table public.user_preferences (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  preferred_papers text[] null default array['paper1'::text],
  daily_goal integer null default 10,
  study_streak integer null default 0,
  longest_streak integer null default 0,
  last_study_date date null,
  notifications_enabled boolean null default true,
  email_notifications boolean null default false,
  weekly_summary boolean null default true,
  theme_preference character varying(20) null default 'system'::character varying,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_preferences_pkey primary key (id),
  constraint user_preferences_user_id_key unique (user_id),
  constraint user_preferences_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger update_user_preferences_updated_at BEFORE
update on user_preferences for EACH row
execute FUNCTION update_updated_at_column ();
