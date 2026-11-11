create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Yoran's e-mailadres krijgt automatisch beheerrechten bij aanmaken account
create or replace function public.grant_owner_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = 'vanmeerhaegheyoran@gmail.com' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
  for each row execute function public.grant_owner_admin();

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  phone text not null check (char_length(phone) between 1 and 50),
  car text check (char_length(car) <= 200),
  package text check (char_length(package) <= 200),
  message text check (char_length(message) <= 4000),
  handled boolean not null default false
);
grant insert on public.quotes to anon, authenticated;
grant select, update, delete on public.quotes to authenticated;
grant all on public.quotes to service_role;
alter table public.quotes enable row level security;
create policy "anyone can send" on public.quotes for insert to anon, authenticated with check (handled = false);
create policy "admin read" on public.quotes for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.quotes for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.quotes for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;
create policy "public read" on public.site_content for select to anon, authenticated using (true);
create policy "admin insert" on public.site_content for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.site_content for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.site_content for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.media (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('image','video')),
  url text not null,
  poster_url text,
  alt text not null default '',
  sort int not null default 0
);
grant select on public.media to anon, authenticated;
grant insert, update, delete on public.media to authenticated;
grant all on public.media to service_role;
alter table public.media enable row level security;
create policy "public read" on public.media for select to anon, authenticated using (true);
create policy "admin insert" on public.media for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.media for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.media for delete to authenticated using (public.has_role(auth.uid(),'admin'));

insert into public.media (kind, url, poster_url, alt, sort) values
('image','/__l5e/assets-v1/a6c4a991-8329-443a-af44-fc9d1d19907e/interieur-mercedes-cognac.jpg',null,'Gereinigd Mercedes-interieur met cognac lederen bekleding',1),
('image','/__l5e/assets-v1/28e37a6c-5253-4810-9f90-185d36ac80e2/exterieur-hoogglans-lak.jpg',null,'Hoogglans gepoetste lak met spiegelende weerspiegeling',2),
('image','/__l5e/assets-v1/3e6a9360-dff1-43b5-afd7-ab8cba9403b8/interieur-voetenruimte-amg.jpg',null,'Net gereinigde voetenruimte met AMG-vloermat',3),
('image','/__l5e/assets-v1/4f0c8f82-172e-4314-beb6-9643440603b6/interieur-range-rover-creme.jpg',null,'Crème lederen zetels en middenconsole, grondig gereinigd',4),
('image','/__l5e/assets-v1/04db9cfc-3020-4f6f-bd62-15267276714d/interieur-mg-voetenruimte.jpg',null,'Gereinigde voetenruimte met leder en oranje stiksels',5),
('video','/__l5e/assets-v1/21d3865e-deff-41b3-ba8b-00a99d371ad2/resultaat-video-1.mp4','/__l5e/assets-v1/4a0a13b0-9037-44ca-88f2-b8e45f221776/resultaat-video-1.jpg','Resultaat – filmpje 1',6),
('video','/__l5e/assets-v1/f4037ace-0d2a-4fd9-8e41-941e899e1aac/resultaat-video-2.mp4','/__l5e/assets-v1/02fd31d3-3e84-47c0-9dad-444d8e989bf9/resultaat-video-2.jpg','Resultaat – filmpje 2',7),
('video','/__l5e/assets-v1/57f01d05-c0a0-4ff8-a31b-e0978dd3d6b4/resultaat-video-3.mp4','/__l5e/assets-v1/4f7ad420-dd90-4571-9b27-0a22d266d01b/resultaat-video-3.jpg','Resultaat – filmpje 3',8),
('video','/__l5e/assets-v1/5ec92342-98db-4116-a5fb-d3e569228c84/resultaat-video-4.mp4','/__l5e/assets-v1/8790848c-fb4f-4adc-9d4a-853192430bf3/resultaat-video-4.jpg','Resultaat – filmpje 4',9);