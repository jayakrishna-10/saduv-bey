create table public.chapter_mastery (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  paper character varying(50) not null,
  chapter_name character varying(255) not null,
  mastery_level character varying(20) not null default 'beginner'::character varying,
  mastery_percentage numeric(5, 2) not null default 0,
  questions_needed_for_next_level integer null default 0,
  last_practiced timestamp with time zone null,
  first_attempted timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint chapter_mastery_pkey primary key (id),
  constraint chapter_mastery_user_id_paper_chapter_name_key unique (user_id, paper, chapter_name),
  constraint chapter_mastery_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_chapter_mastery_user_id on public.chapter_mastery using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_chapter_mastery_paper on public.chapter_mastery using btree (paper) TABLESPACE pg_default;

create trigger update_chapter_mastery_updated_at BEFORE
update on chapter_mastery for EACH row
execute FUNCTION update_updated_at_column ();
