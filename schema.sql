-- FACEHOOK DATABASE SCHEMA
-- Run this entire file in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'New member',
  username text unique,
  avatar_url text,
  bio text default '',
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text default '',
  media_url text,
  media_type text,
  created_at timestamptz not null default now(),
  constraint post_has_content_or_media check (length(trim(coalesce(content,''))) > 0 or media_url is not null)
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id,user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (length(trim(content)) > 0 and length(content) <= 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','blocked')),
  created_at timestamptz not null default now(),
  check (user_id <> friend_id),
  unique(user_id,friend_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (length(trim(content)) > 0 and length(content) <= 5000),
  created_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now()
);

-- Automatically create a profile after signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.friendships enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;

-- Public profiles; only the owner can change their own profile.
create policy "Profiles are viewable by authenticated users" on public.profiles for select to authenticated using (true);
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Authenticated users read posts" on public.posts for select to authenticated using (true);
create policy "Users create own posts" on public.posts for insert to authenticated with check (auth.uid() = user_id);
create policy "Owners delete own posts" on public.posts for delete to authenticated using (auth.uid() = user_id);

create policy "Authenticated users read likes" on public.likes for select to authenticated using (true);
create policy "Users like as themselves" on public.likes for insert to authenticated with check (auth.uid() = user_id);
create policy "Users remove own likes" on public.likes for delete to authenticated using (auth.uid() = user_id);

create policy "Authenticated users read comments" on public.comments for select to authenticated using (true);
create policy "Users add own comments" on public.comments for insert to authenticated with check (auth.uid() = user_id);
create policy "Users delete own comments" on public.comments for delete to authenticated using (auth.uid() = user_id);

create policy "Users see relevant friendships" on public.friendships for select to authenticated using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Users send friend requests" on public.friendships for insert to authenticated with check (auth.uid() = user_id and status = 'pending');
create policy "Recipient accepts or updates request" on public.friendships for update to authenticated using (auth.uid() = friend_id) with check (auth.uid() = friend_id and status in ('accepted','blocked'));
create policy "Request sender can cancel" on public.friendships for delete to authenticated using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users read their messages" on public.messages for select to authenticated using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users send messages as themselves" on public.messages for insert to authenticated with check (auth.uid() = sender_id);

create policy "Users create reports" on public.reports for insert to authenticated with check (auth.uid() = reporter_id);
create policy "Users see own reports" on public.reports for select to authenticated using (auth.uid() = reporter_id);

-- Storage buckets. Post media and avatars are public for rendering;
-- uploads are restricted to a folder named with the authenticated user's UUID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('post-media','post-media',true,52428800,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']),
  ('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "Public read post media" on storage.objects for select using (bucket_id in ('post-media','avatars'));
create policy "Users upload own media" on storage.objects for insert to authenticated
with check (bucket_id in ('post-media','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update own media" on storage.objects for update to authenticated
using (bucket_id in ('post-media','avatars') and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id in ('post-media','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own media" on storage.objects for delete to authenticated
using (bucket_id in ('post-media','avatars') and (storage.foldername(name))[1] = auth.uid()::text);

-- Enable realtime for chat (optional, app can also refresh messages manually).
alter publication supabase_realtime add table public.messages;
