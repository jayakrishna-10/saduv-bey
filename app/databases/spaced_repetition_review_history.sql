-- app/databases/spaced_repetition_review_history.sql
create table public.spaced_repetition_review_history (
  id uuid not null default extensions.uuid_generate_v4(),
  card_id uuid not null,
  session_id uuid null,
  user_response character varying(1) null,
  correct_answer character varying(1) not null,
  was_correct boolean not null,
  time_taken integer not null default 0,
  difficulty_rating integer null,
  previous_ease_factor numeric(3, 2) null,
  new_ease_factor numeric(3, 2) null,
  previous_interval integer null,
  new_interval integer null,
  review_type character varying(20) not null default 'normal',
  reviewed_at timestamp with time zone not null default now(),
  constraint spaced_repetition_review_history_pkey primary key (id),
  constraint spaced_repetition_review_history_card_id_fkey foreign key (card_id) references spaced_repetition_cards (id) on delete cascade,
  constraint spaced_repetition_review_history_session_id_fkey foreign key (session_id) references spaced_repetition_sessions (id) on delete set null,
  constraint spaced_repetition_review_history_user_response_check check (user_response is null or user_response in ('a', 'b', 'c', 'd')),
  constraint spaced_repetition_review_history_correct_answer_check check (correct_answer in ('a', 'b', 'c', 'd')),
  constraint spaced_repetition_review_history_time_taken_check check (time_taken >= 0),
  constraint spaced_repetition_review_history_difficulty_rating_check check (difficulty_rating is null or (difficulty_rating >= 1 and difficulty_rating <= 5)),
  constraint spaced_repetition_review_history_ease_factor_check check (
    (previous_ease_factor is null or (previous_ease_factor >= 1.30 and previous_ease_factor <= 2.50)) and
    (new_ease_factor is null or (new_ease_factor >= 1.30 and new_ease_factor <= 2.50))
  ),
  constraint spaced_repetition_review_history_interval_check check (
    (previous_interval is null or previous_interval >= 1) and
    (new_interval is null or new_interval >= 1)
  ),
  constraint spaced_repetition_review_history_review_type_check check (review_type in ('normal', 'overdue', 'manual', 'failed'))
) tablespace pg_default;

-- Indexes for performance
create index if not exists idx_spaced_repetition_review_history_card_id on public.spaced_repetition_review_history using btree (card_id) tablespace pg_default;

create index if not exists idx_spaced_repetition_review_history_session_id on public.spaced_repetition_review_history using btree (session_id) tablespace pg_default;

create index if not exists idx_spaced_repetition_review_history_reviewed_at on public.spaced_repetition_review_history using btree (reviewed_at desc) tablespace pg_default;

create index if not exists idx_spaced_repetition_review_history_was_correct on public.spaced_repetition_review_history using btree (was_correct) tablespace pg_default;

create index if not exists idx_spaced_repetition_review_history_card_reviewed on public.spaced_repetition_review_history using btree (card_id, reviewed_at desc) tablespace pg_default;

create index if not exists idx_spaced_repetition_review_history_review_type on public.spaced_repetition_review_history using btree (review_type) tablespace pg_default;

-- Function to get performance analytics for a card
create or replace function get_card_performance_analytics(p_card_id uuid)
returns table(
  total_reviews integer,
  correct_reviews integer,
  accuracy_percentage numeric(5, 2),
  average_time_taken numeric(6, 2),
  average_difficulty numeric(3, 2),
  last_review_date timestamp with time zone,
  review_frequency_days numeric(6, 2),
  improvement_trend character varying(20)
) as $$
declare
  recent_reviews_accuracy numeric(5, 2);
  older_reviews_accuracy numeric(5, 2);
begin
  -- Get basic statistics
  select 
    count(*)::integer,
    sum(case when was_correct then 1 else 0 end)::integer,
    case when count(*) > 0 then round((sum(case when was_correct then 1 else 0 end)::numeric / count(*)::numeric) * 100, 2) else 0 end,
    case when count(*) > 0 then round(avg(time_taken::numeric), 2) else 0 end,
    case when count(difficulty_rating) > 0 then round(avg(difficulty_rating::numeric), 2) else null end,
    max(reviewed_at),
    case when count(*) > 1 then 
      round(extract(epoch from (max(reviewed_at) - min(reviewed_at))) / (86400 * (count(*) - 1)), 2)
    else null end
  into total_reviews, correct_reviews, accuracy_percentage, average_time_taken, average_difficulty, last_review_date, review_frequency_days
  from spaced_repetition_review_history
  where card_id = p_card_id;
  
  -- Calculate improvement trend
  if total_reviews >= 6 then
    -- Compare recent 1/3 of reviews with older 1/3
    select round(avg(case when was_correct then 100.0 else 0.0 end), 2)
    into recent_reviews_accuracy
    from (
      select was_correct
      from spaced_repetition_review_history
      where card_id = p_card_id
      order by reviewed_at desc
      limit greatest(1, total_reviews / 3)
    ) recent;
    
    select round(avg(case when was_correct then 100.0 else 0.0 end), 2)
    into older_reviews_accuracy
    from (
      select was_correct
      from spaced_repetition_review_history
      where card_id = p_card_id
      order by reviewed_at asc
      limit greatest(1, total_reviews / 3)
    ) older;
    
    if recent_reviews_accuracy > older_reviews_accuracy + 10 then
      improvement_trend := 'improving';
    elsif recent_reviews_accuracy < older_reviews_accuracy - 10 then
      improvement_trend := 'declining';
    else
      improvement_trend := 'stable';
    end if;
  else
    improvement_trend := 'insufficient_data';
  end if;
  
  return next;
end;
$$ language plpgsql;
