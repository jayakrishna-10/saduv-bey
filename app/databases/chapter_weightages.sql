create table public.chapter_weightages (
  id uuid not null default extensions.uuid_generate_v4 (),
  paper character varying(50) not null,
  chapter_name character varying(255) not null,
  weightage_percentage numeric(5, 2) not null,
  total_marks integer not null default 50,
  based_on_year_range character varying(20) null,
  last_updated timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  constraint chapter_weightages_pkey primary key (id),
  constraint chapter_weightages_paper_chapter_name_key unique (paper, chapter_name)
) TABLESPACE pg_default;

create index IF not exists idx_chapter_weightages_paper on public.chapter_weightages using btree (paper) TABLESPACE pg_default;
