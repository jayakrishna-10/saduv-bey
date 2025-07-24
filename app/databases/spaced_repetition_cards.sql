-- app/databases/spaced_repetition_cards.sql
create table public.spaced_repetition_cards (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,
  question_id bigint not null,
  paper character varying(50) not null,
  ease_factor numeric(3, 2) not null default 2.50,
  interval_days integer not null default 1,
  repetitions integer not null default 0,
  next_review_date date not null default current_date,
  last_review_date timestamp with time zone null,
  total_reviews integer not null default 0,
  correct_reviews integer not null default 0,
  difficulty_rating numeric(2, 1) null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint spaced_repetition_cards_pkey primary key (id),
  constraint spaced_repetition_cards_user_question_paper_key unique (user_id, question_id, paper),
  constraint spaced_repetition_cards_user_id_fkey foreign key (user_id) references users (id) on delete cascade,
  constraint spaced_repetition_cards_ease_factor_check check (ease_factor >= 1.30 and ease_factor <= 2.50),
  constraint spaced_repetition_cards_interval_days_check check (interval_days >= 1),
  constraint spaced_repetition_cards_repetitions_check check (repetitions >= 0),
  constraint spaced_repetition_cards_total_reviews_check check (total_reviews >= 0),
  constraint spaced_repetition_cards_correct_reviews_check check (correct_reviews >= 0 and correct_reviews <= total_reviews),
  constraint spaced_repetition_cards_difficulty_rating_check check (difficulty_rating is null or (difficulty_rating >= 1.0 and difficulty_rating <= 5.0))
) tablespace pg_default;

-- Indexes for optimal query performance
create index if not exists idx_spaced_repetition_cards_user_id on public.spaced_repetition_cards using btree (user_id) tablespace pg_default;

create index if not exists idx_spaced_repetition_cards_next_review_date on public.spaced_repetition_cards using btree (next_review_date) tablespace pg_default;

create index if not exists idx_spaced_repetition_cards_user_next_review on public.spaced_repetition_cards using btree (user_id, next_review_date) tablespace pg_default;

create index if not exists idx_spaced_repetition_cards_paper on public.spaced_repetition_cards using btree (paper) tablespace pg_default;

create index if not exists idx_spaced_repetition_cards_ease_factor on public.spaced_repetition_cards using btree (ease_factor) tablespace pg_default;

create index if not exists idx_spaced_repetition_cards_question_id on public.spaced_repetition_cards using btree (question_id) tablespace pg_default;

-- Trigger for updated_at
create trigger update_spaced_repetition_cards_updated_at before update on spaced_repetition_cards for each row execute function update_updated_at_column();

-- Function to calculate retention rate
create or replace function calculate_card_retention_rate(card_id uuid)
returns numeric(5, 2) as $$
declare
    retention_rate numeric(5, 2);
begin
    select case 
        when total_reviews = 0 then 0.00
        else round((correct_reviews::numeric / total_reviews::numeric) * 100, 2)
    end into retention_rate
    from spaced_repetition_cards
    where id = card_id;
    
    return coalesce(retention_rate, 0.00);
end;
$$ language plpgsql;
