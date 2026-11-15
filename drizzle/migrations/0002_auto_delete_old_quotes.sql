create extension if not exists pg_cron;
select cron.schedule('verwijder-oude-aanvragen', '0 3 * * *', $$ delete from public.quotes where created_at < now() - interval '1 month'; $$);