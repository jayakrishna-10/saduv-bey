create table public.user_learning_analytics (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  total_questions_attempted integer not null default 0,
  total_correct_answers integer not null default 0,
  overall_accuracy numeric(5, 2) not null default 0,
  predicted_paper1_score numeric(5, 2) null default 0,
  predicted_paper2_score numeric(5, 2) null default 0,
  predicted_paper3_score numeric(5, 2) null default 0,
  predicted_total_score numeric(5, 2) null default 0,
  strongest_chapter character varying(255) null,
  weakest_chapter character varying(255) null,
  improvement_rate numeric(5, 2) null default 0,
  consistency_score numeric(5, 2) null default 0,
  last_calculated timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_learning_analytics_pkey primary key (id),
  constraint user_learning_analytics_user_id_key unique (user_id),
  constraint user_learning_analytics_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger update_user_learning_analytics_updated_at BEFORE
update on user_learning_analytics for EACH row
execute FUNCTION update_updated_at_column ();
