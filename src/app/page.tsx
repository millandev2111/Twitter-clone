import Link from 'next/link';
import { AuthButtonServer } from './components/auth-button-server';
import { ComposePost } from './components/compose-post';
import { PostCard } from './components/post-card';
import { PostList } from './components/posts-list';
import { createClient } from './utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession()

  if(session === null){
    redirect('/login')
  }

  const { data: posts } = await supabase.from("post").select("*, user:users(name, user_name, avatar_url)").order('created_at', {ascending: false});
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <section className='max-w-[600px] w-full mx-auto border-l border-r border-white/20 min-h-screen'>
      <ComposePost userAvatarUrl={session.user?.user_metadata?.avatar_url} />
      <PostList posts={posts}/>
      </section>
      <AuthButtonServer/>
    </div>
  );
}
