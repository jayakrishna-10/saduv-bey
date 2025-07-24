-- app/databases/spaced_repetition_sessions.sql
create table public.spaced_repetition_sessions (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,
  paper character varying(50) null,
  questions_reviewed integer not null default 0,
  correct_answers integer not null default 0,
  session_duration integer not null default 0,
  average_response_time numeric(6, 2) null,
  cards_graduated integer not null default 0,
  cards_failed integer not null default 0,
  session_type character varying(20) not null default 'review',
  completed_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  constraint spaced_repetition_sessions_pkey primary key (id),
  constraint spaced_repetition_sessions_user_id_fkey foreign key (user_id) references users (id) on delete cascade,
  constraint spaced_repetition_sessions_questions_reviewed_check check (questions_reviewed >= 0),
  constraint spaced_repetition_sessions_correct_answers_check check (correct_answers >= 0 and correct_answers <= questions_reviewed),
  constraint spaced_repetition_sessions_session_duration_check check (session_duration >= 0),
  constraint spaced_repetition_sessions_cards_graduated_check check (cards_graduated >= 0),
  constraint spaced_repetition_sessions_cards_failed_check check (cards_failed >= 0),
  constraint spaced_repetition_sessions_session_type_check check (session_type in ('review', 'new', 'mixed', 'overdue'))
) tablespace pg_default;

-- Indexes for performance
create index if not exists idx_spaced_repetition_sessions_user_id on public.spaced_repetition_sessions using btree (user_id) tablespace pg_default;

create index if not exists idx_spaced_repetition_sessions_completed_at on public.spaced_repetition_sessions using btree (completed_at desc) tablespace pg_default;

create index if not exists idx_spaced_repetition_sessions_user_completed on public.spaced_repetition_sessions using btree (user_id, completed_at desc) tablespace pg_default;

create index if not exists idx_spaced_repetition_sessions_paper on public.spaced_repetition_sessions using btree (paper) tablespace pg_default;

create index if not exists idx_spaced_repetition_sessions_session_type on public.spaced_repetition_sessions using btree (session_type) tablespace pg_default;

-- Function to get user's daily review streak
create or replace function get_spaced_repetition_streak(p_user_id uuid)
returns table(current_streak integer, longest_streak integer, total_days integer) as $$
declare
    current_streak_count integer := 0;
    longest_streak_count integer := 0;
    temp_streak integer := 0;
    total_days_count integer := 0;
    session_date date;
    prev_date date := null;
    day_diff integer;
begin
    -- Get unique session dates ordered by date desc
    for session_date in
        select distinct date(completed_at) as session_date
        from spaced_repetition_sessions
        where user_id = p_user_id
        order by session_date desc
    loop
        total_days_count := total_days_count + 1;
        
        if prev_date is null then
            -- First iteration
            temp_streak := 1;
            prev_date := session_date;
        else
            day_diff := prev_date - session_date;
            
            if day_diff = 1 then
                -- Consecutive day
                temp_streak := temp_streak + 1;
            else
                -- Streak broken, check if this was the current streak
                if current_streak_count = 0 then
                    current_streak_count := temp_streak;
                end if;
                
                -- Update longest streak
                longest_streak_count := greatest(longest_streak_count, temp_streak);
                temp_streak := 1;
            end if;
            
            prev_date := session_date;
        end if;
    end loop;
    
    -- Handle the final streak
    if current_streak_count = 0 then
        current_streak_count := temp_streak;
    end if;
    longest_streak_count := greatest(longest_streak_count, temp_streak);
    
    -- Check if current streak is still active (last session within 2 days)
    if exists (
        select 1 from spaced_repetition_sessions 
        where user_id = p_user_id 
        and date(completed_at) >= current_date - interval '1 day'
    ) then
        current_streak := current_streak_count;
    else
        current_streak := 0;
    end if;
    
    longest_streak := longest_streak_count;
    total_days := total_days_count;
    return next;
end;
$$ language plpgsql;
