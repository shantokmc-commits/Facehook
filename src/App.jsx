import React, { useEffect, useMemo, useState } from 'react'
import {
  Home, Users, Video, MessageCircle, Bell, Search, Plus, Image, Smile,
  ThumbsUp, MessageSquare, Share2, Menu, X, Globe2, LogOut, UserRound,
  Settings, Send, Camera, Heart, ShieldCheck, LoaderCircle, Languages
} from 'lucide-react'
import { supabase, isConfigured } from './supabase'

const copy = {
  en: {
    tagline: 'Connect with everyone', home: 'Home', friends: 'Friends', videos: 'Videos',
    messages: 'Messages', notifications: 'Notifications', profile: 'Profile', search: 'Search Facehook',
    whats: "What's on your mind?", post: 'Post', stories: 'Stories', createStory: 'Create story',
    like: 'Like', comment: 'Comment', share: 'Share', comments: 'Comments', writeComment: 'Write a comment...',
    login: 'Log in', signup: 'Create account', email: 'Email address', password: 'Password',
    name: 'Full name', welcome: 'Welcome to Facehook', loginHint: 'Connect with friends and the world around you.',
    noPosts: 'No posts yet. Be the first to share something!', addPhoto: 'Add photo',
    sendRequest: 'Add friend', pending: 'Request sent', accept: 'Accept', sent: 'Friend request sent',
    findFriends: 'Find people', emailToFind: 'Enter a person’s email', send: 'Send',
    chatSoon: 'Choose a friend to start a conversation.', yourAccount: 'Your account', signOut: 'Sign out',
    setup: 'Connect your Supabase project to activate Facehook.', setupDetail: 'Follow the README setup steps, then add your project URL and anon key.',
    loading: 'Loading...', postFailed: 'Could not publish post', authError: 'Please check your details and try again.',
    emptyComments: 'No comments yet.', photoVideo: 'Photo / Video', language: 'Language', admin: 'Admin',
    profileUpdated: 'Profile', people: 'People', save: 'Save', bio: 'Tell people about yourself',
    delete: 'Delete', report: 'Report', accountCreated: 'Account created! Check your email if confirmation is enabled.'
  },
  bn: {
    tagline: 'সবার সঙ্গে যুক্ত থাকুন', home: 'হোম', friends: 'বন্ধু', videos: 'ভিডিও',
    messages: 'মেসেজ', notifications: 'নোটিফিকেশন', profile: 'প্রোফাইল', search: 'Facehook-এ খুঁজুন',
    whats: 'আপনার মনে কী আছে?', post: 'পোস্ট', stories: 'স্টোরিজ', createStory: 'স্টোরি তৈরি',
    like: 'লাইক', comment: 'মন্তব্য', share: 'শেয়ার', comments: 'মন্তব্য', writeComment: 'মন্তব্য লিখুন...',
    login: 'লগইন', signup: 'অ্যাকাউন্ট খুলুন', email: 'ইমেইল ঠিকানা', password: 'পাসওয়ার্ড',
    name: 'পুরো নাম', welcome: 'Facehook-এ স্বাগতম', loginHint: 'বন্ধু ও সারা বিশ্বের মানুষের সঙ্গে যুক্ত থাকুন।',
    noPosts: 'এখনো কোনো পোস্ট নেই। প্রথম পোস্টটি আপনিই করুন!', addPhoto: 'ছবি যোগ করুন',
    sendRequest: 'বন্ধু করুন', pending: 'রিকোয়েস্ট পাঠানো হয়েছে', accept: 'গ্রহণ করুন', sent: 'ফ্রেন্ড রিকোয়েস্ট পাঠানো হয়েছে',
    findFriends: 'মানুষ খুঁজুন', emailToFind: 'ব্যক্তির ইমেইল লিখুন', send: 'পাঠান',
    chatSoon: 'কথা শুরু করতে একজন বন্ধুকে বেছে নিন।', yourAccount: 'আপনার অ্যাকাউন্ট', signOut: 'লগআউট',
    setup: 'Facehook চালু করতে Supabase প্রজেক্ট সংযুক্ত করুন।', setupDetail: 'README-এর নির্দেশনা অনুসরণ করে প্রজেক্ট URL ও anon key যোগ করুন।',
    loading: 'লোড হচ্ছে...', postFailed: 'পোস্ট প্রকাশ করা যায়নি', authError: 'তথ্য যাচাই করে আবার চেষ্টা করুন।',
    emptyComments: 'এখনো কোনো মন্তব্য নেই।', photoVideo: 'ছবি / ভিডিও', language: 'ভাষা', admin: 'অ্যাডমিন',
    profileUpdated: 'প্রোফাইল', people: 'মানুষ', save: 'সংরক্ষণ', bio: 'নিজের সম্পর্কে লিখুন',
    delete: 'মুছুন', report: 'রিপোর্ট', accountCreated: 'অ্যাকাউন্ট তৈরি হয়েছে! ইমেইল কনফার্ম করুন।'
  }
}

function Avatar({ name = 'User', url, size = 'h-10 w-10' }) {
  return url
    ? <img src={url} alt="" className={`${size} rounded-full object-cover bg-slate-100`} />
    : <div className={`${size} rounded-full bg-blue-100 text-blue-700 grid place-items-center font-bold`}>{(name || 'U').slice(0,1).toUpperCase()}</div>
}

function AuthScreen({ lang, setLang }) {
  const t = copy[lang]
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
        if (error) throw error
        alert(t.accountCreated)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) { setError(err.message || t.authError) } finally { setBusy(false) }
  }
  return <div className="min-h-screen bg-slate-50 flex flex-col">
    <header className="w-full max-w-6xl mx-auto px-5 py-6 flex justify-between items-center">
      <div><div className="text-3xl font-black tracking-tight text-facehook">facehook<span className="text-blue-300">.</span></div><p className="text-xs text-slate-500">{t.tagline}</p></div>
      <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="pill"><Languages size={16}/>{lang === 'en' ? 'বাংলা' : 'English'}</button>
    </header>
    <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-10 grid md:grid-cols-2 gap-10 items-center">
      <section className="hidden md:block">
        <h1 className="text-5xl font-black leading-tight text-facehook">facehook<span className="text-blue-300">.</span></h1>
        <p className="text-2xl mt-4 text-slate-700 max-w-md">{t.loginHint}</p>
        <div className="mt-8 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-soft">
          <div className="flex gap-3 text-4xl"><span>💬</span><span>🌍</span><span>❤️</span></div>
          <p className="mt-5 text-xl font-bold">Share moments. Build friendships. Stay connected.</p>
        </div>
      </section>
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold">{mode === 'login' ? t.login : t.signup}</h2>
        <p className="text-sm text-slate-500 mt-1">{t.welcome}</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === 'signup' && <input className="field" placeholder={t.name} value={name} onChange={e=>setName(e.target.value)} required />}
          <input className="field" type="email" placeholder={t.email} value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="field" type="password" minLength="8" placeholder={t.password} value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={busy} className="w-full bg-facehook hover:bg-blue-700 text-white font-bold rounded-xl py-3 flex justify-center items-center gap-2">{busy && <LoaderCircle className="animate-spin" size={17}/ >}{mode === 'login' ? t.login : t.signup}</button>
        </form>
        <div className="text-center text-sm text-slate-500 mt-5">{mode === 'login' ? "New to Facehook?" : 'Already have an account?'} <button className="text-facehook font-bold" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}}>{mode === 'login' ? t.signup : t.login}</button></div>
      </section>
    </main>
    <footer className="text-center text-xs text-slate-400 py-6">Facehook © {new Date().getFullYear()} · Connect with care</footer>
  </div>
}

function Sidebar({ active, setActive, t, profile, onSignOut }) {
  const items = [[Home,'home',t.home],[Users,'friends',t.friends],[Video,'videos',t.videos],[MessageCircle,'messages',t.messages],[Bell,'notifications',t.notifications],[UserRound,'profile',t.profile]]
  return <aside className="hidden lg:block w-64 shrink-0 pt-5">
    <div className="sticky top-24 space-y-1">
      {items.map(([Icon,id,label])=><button key={id} onClick={()=>setActive(id)} className={`side-link ${active===id?'side-active':''}`}><Icon size={21}/>{label}</button>)}
      <div className="border-t mt-4 pt-4 px-3 flex items-center gap-3"><Avatar name={profile?.full_name} url={profile?.avatar_url}/><div className="min-w-0"><p className="font-semibold text-sm truncate">{profile?.full_name}</p><p className="text-xs text-slate-500">{t.yourAccount}</p></div></div>
      <button onClick={onSignOut} className="side-link text-slate-500"><LogOut size={20}/>{t.signOut}</button>
    </div>
  </aside>
}

function PostCard({ post, user, t, onRefresh }) {
  const [comment, setComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const liked = post.likes?.some(x => x.user_id === user.id)
  async function toggleLike() {
    if (liked) await supabase.from('likes').delete().eq('post_id',post.id).eq('user_id',user.id)
    else await supabase.from('likes').insert({post_id:post.id,user_id:user.id})
    onRefresh()
  }
  async function addComment(e) {
    e.preventDefault(); if (!comment.trim()) return
    const { error } = await supabase.from('comments').insert({post_id:post.id,user_id:user.id,content:comment.trim()})
    if (!error) { setComment(''); onRefresh() }
  }
  async function deletePost() {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id',post.id); onRefresh()
  }
  return <article className="surface p-4">
    <div className="flex items-center gap-3">
      <Avatar name={post.author?.full_name} url={post.author?.avatar_url}/>
      <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{post.author?.full_name || 'Facehook member'}</p><p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleString()}</p></div>
      {post.user_id === user.id && <button onClick={deletePost} className="text-xs text-slate-400 hover:text-red-500">•••</button>}
    </div>
    {post.content && <p className="whitespace-pre-wrap text-[15px] leading-6 my-3">{post.content}</p>}
    {post.media_url && (post.media_type?.startsWith('video') ? <video src={post.media_url} controls className="w-full max-h-[520px] rounded-xl bg-black"/> : <img src={post.media_url} alt="Post attachment" className="w-full max-h-[520px] object-cover rounded-xl"/>)}
    <div className="flex justify-between text-xs text-slate-500 py-3 border-b border-slate-100"><span>{post.likes?.length || 0} {t.like}</span><button onClick={()=>setShowComments(!showComments)}>{post.comments?.length || 0} {t.comments}</button></div>
    <div className="grid grid-cols-3 pt-2">
      <button onClick={toggleLike} className={`action ${liked?'text-blue-600':''}`}><ThumbsUp size={18}/>{liked?'Liked':t.like}</button>
      <button onClick={()=>setShowComments(!showComments)} className="action"><MessageSquare size={18}/>{t.comment}</button>
      <button onClick={()=>navigator.share?.({title:'Facehook',text:post.content||'See this post',url:location.href})} className="action"><Share2 size={18}/>{t.share}</button>
    </div>
    {showComments && <div className="mt-3 border-t pt-3 space-y-3">
      {(post.comments||[]).map(c=><div key={c.id} className="flex gap-2 text-sm"><Avatar size="h-8 w-8" name={c.author?.full_name}/><div className="bg-slate-100 rounded-2xl px-3 py-2"><b>{c.author?.full_name}</b><p>{c.content}</p></div></div>)}
      {!post.comments?.length && <p className="text-xs text-slate-400">{t.emptyComments}</p>}
      <form onSubmit={addComment} className="flex gap-2"><input className="field !rounded-full !py-2" value={comment} onChange={e=>setComment(e.target.value)} placeholder={t.writeComment}/><button className="text-facehook px-2"><Send size={19}/></button></form>
    </div>}
  </article>
}

function App() {
  const [lang,setLang] = useState(localStorage.getItem('fh-lang') || 'en')
  const t = copy[lang]
  const [session,setSession] = useState(null)
  const [profile,setProfile] = useState(null)
  const [active,setActive] = useState('home')
  const [posts,setPosts] = useState([])
  const [loading,setLoading] = useState(true)
  const [draft,setDraft] = useState('')
  const [file,setFile] = useState(null)
  const [publishing,setPublishing] = useState(false)
  const [people,setPeople] = useState([])
  const [friendEmail,setFriendEmail] = useState('')
  const [requests,setRequests] = useState([])
  const [friends,setFriends] = useState([])
  const [selectedFriend,setSelectedFriend] = useState(null)
  const [messages,setMessages] = useState([])
  const [messageText,setMessageText] = useState('')
  const [query,setQuery] = useState('')

  useEffect(()=>{localStorage.setItem('fh-lang',lang)},[lang])
  useEffect(()=>{
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({data})=>setSession(data.session))
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,s)=>setSession(s))
    return ()=>subscription.unsubscribe()
  },[])
  useEffect(()=>{if(session?.user) loadAll(); else {setProfile(null);setPosts([]);setLoading(false)}},[session?.user?.id])
  async function loadProfile() {
    const u=session.user
    let {data}=await supabase.from('profiles').select('*').eq('id',u.id).maybeSingle()
    if (!data) {
      const {data:created}=await supabase.from('profiles').insert({id:u.id,full_name:u.user_metadata?.full_name||u.email?.split('@')[0]}).select().single()
      data=created
    }
    setProfile(data)
  }
  async function loadAll() { setLoading(true); await loadProfile(); await Promise.all([loadPosts(),loadFriends(),loadRequests(),loadPeople()]); setLoading(false) }
  async function loadPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(40)

    if (error) {
      console.error('Feed loading error:', error)
      alert('Feed Error: ' + error.message)
      return
    }

    const postsData = data || []
    const userIds = [...new Set(postsData.map(post => post.user_id).filter(Boolean))]
    let profilesById = {}

    if (userIds.length) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)

      if (profileError) {
        console.error('Profile loading error:', profileError)
      } else {
        profilesById = Object.fromEntries((profiles || []).map(profile => [profile.id, profile]))
      }
    }

    setPosts(postsData.map(post => ({
      ...post,
      author: profilesById[post.user_id] || null,
      likes: [],
      comments: []
    })))
  }

  setPosts(data || [])
}
  async function loadPeople() {
    const {data}=await supabase.from('profiles').select('id,full_name,avatar_url').neq('id',session.user.id).limit(30)
    setPeople(data||[])
  }
  async function loadFriends() {
    const {data}=await supabase.from('friendships').select('*, friend:profiles!friendships_friend_id_fkey(id,full_name,avatar_url), requester:profiles!friendships_user_id_fkey(id,full_name,avatar_url)').or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`).eq('status','accepted')
    setFriends(data||[])
  }
  async function loadRequests() {
    const {data}=await supabase.from('friendships').select('*, requester:profiles!friendships_user_id_fkey(id,full_name,avatar_url)').eq('friend_id',session.user.id).eq('status','pending')
    setRequests(data||[])
  }
  async function publish() {
    if (!draft.trim() && !file) return
    setPublishing(true)
    try {
      let media_url=null,media_type=null
      if (file) {
        const ext=file.name.split('.').pop()
        const path=`${session.user.id}/${crypto.randomUUID()}.${ext}`
        const {error:upErr}=await supabase.storage.from('post-media').upload(path,file,{upsert:false})
        if (upErr) throw upErr
        media_url=supabase.storage.from('post-media').getPublicUrl(path).data.publicUrl
        media_type=file.type
      }
      const {error}=await supabase.from('posts').insert({user_id:session.user.id,content:draft.trim(),media_url,media_type})
      if (error) throw error
      setDraft('');setFile(null);await loadPosts()
    } catch(e) { alert(e.message || t.postFailed) } finally {setPublishing(false)}
  }
  async function sendRequest(personId) {
    const {error}=await supabase.from('friendships').insert({user_id:session.user.id,friend_id:personId,status:'pending'})
    if (error) alert(error.message); else { alert(t.sent); loadPeople() }
  }
  async function acceptRequest(id) {
    await supabase.from('friendships').update({status:'accepted'}).eq('id',id);loadRequests();loadFriends()
  }
  async function openChat(friend) {
    setSelectedFriend(friend)
    const {data}=await supabase.from('messages').select('*').or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${session.user.id})`).order('created_at')
    setMessages(data||[])
  }
  async function sendMessage(e) {
    e.preventDefault();if(!messageText.trim()||!selectedFriend)return
    const {error}=await supabase.from('messages').insert({sender_id:session.user.id,receiver_id:selectedFriend.id,content:messageText.trim()})
    if(!error){setMessageText('');openChat(selectedFriend)}
  }
  async function uploadAvatar(e) {
    const f=e.target.files?.[0];if(!f)return
    const path=`${session.user.id}/avatar-${Date.now()}.${f.name.split('.').pop()}`
    const {error}=await supabase.storage.from('avatars').upload(path,f,{upsert:true})
    if(error){alert(error.message);return}
    const url=supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
    await supabase.from('profiles').update({avatar_url:url}).eq('id',session.user.id)
    loadProfile()
  }
  async function saveBio(e){e.preventDefault();await supabase.from('profiles').update({bio:e.target.bio.value}).eq('id',session.user.id);loadProfile()}
  const filteredPeople=useMemo(()=>people.filter(p=>(p.full_name||'').toLowerCase().includes(query.toLowerCase())),[people,query])

  if (!isConfigured) return <div className="min-h-screen bg-slate-50 p-5 grid place-items-center"><div className="surface max-w-lg p-8 text-center"><div className="text-4xl font-black text-facehook">facehook.</div><div className="mx-auto my-5 w-16 h-16 rounded-2xl bg-blue-50 text-facehook grid place-items-center"><Settings size={30}/></div><h1 className="text-xl font-bold">{t.setup}</h1><p className="text-slate-500 mt-2 text-sm">{t.setupDetail}</p><p className="mt-5 text-xs text-slate-400">VITE_SUPABASE_URL · VITE_SUPABASE_ANON_KEY</p></div></div>
  if (!session) return <AuthScreen lang={lang} setLang={setLang}/>
  if (loading) return <div className="min-h-screen grid place-items-center text-facehook"><LoaderCircle className="animate-spin" size={32}/></div>

  const navItems=[[Home,'home',t.home],[Users,'friends',t.friends],[Video,'videos',t.videos],[MessageCircle,'messages',t.messages],[Bell,'notifications',t.notifications],[UserRound,'profile',t.profile]]
  return <div className="min-h-screen bg-[#f0f2f5]">
    <header className="bg-white/95 backdrop-blur sticky top-0 z-30 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <button className="text-2xl font-black tracking-tight text-facehook" onClick={()=>setActive('home')}>facehook<span className="text-blue-300">.</span></button>
        <div className="hidden sm:flex bg-slate-100 rounded-full px-4 py-2 items-center gap-2 flex-1 max-w-sm"><Search size={18} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} className="bg-transparent outline-none text-sm w-full"/></div>
        <div className="ml-auto flex items-center gap-2">
          <button className="icon-btn" title={t.language} onClick={()=>setLang(lang==='en'?'bn':'en')}><Globe2 size={19}/><span className="text-xs font-bold">{lang==='en'?'BN':'EN'}</span></button>
          <button className="icon-btn" title={t.notifications} onClick={()=>setActive('notifications')}><Bell size={19}/></button>
          <button className="flex items-center gap-2 rounded-full hover:bg-slate-100 p-1" onClick={()=>setActive('profile')}><Avatar name={profile?.full_name} url={profile?.avatar_url} size="h-9 w-9"/><span className="hidden md:block text-sm font-semibold max-w-28 truncate">{profile?.full_name}</span></button>
          <button className="icon-btn hidden sm:flex" title={t.signOut} onClick={()=>supabase.auth.signOut()}><LogOut size={18}/></button>
        </div>
      </div>
    </header>
    <div className="max-w-7xl mx-auto px-3 sm:px-4 flex gap-5">
      <Sidebar active={active} setActive={setActive} t={t} profile={profile} onSignOut={()=>supabase.auth.signOut()}/>
      <main className="w-full max-w-2xl mx-auto lg:mx-0 py-5 pb-24 space-y-4 min-w-0">
        {active==='home' && <>
          <section className="surface p-4">
            <div className="flex gap-3"><Avatar name={profile?.full_name} url={profile?.avatar_url}/><textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t.whats} className="field resize-none min-h-12" rows="2"/></div>
            {file && <div className="mt-3 text-xs bg-blue-50 text-blue-700 rounded-lg p-2 flex justify-between">{file.name}<button onClick={()=>setFile(null)}><X size={15}/></button></div>}
            <div className="border-t mt-3 pt-3 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-semibold text-emerald-600 cursor-pointer"><Image size={19}/>{t.photoVideo}<input type="file" accept="image/*,video/*" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><button disabled={publishing} onClick={publish} className="primary-btn !py-2 !px-6">{publishing?t.loading:t.post}</button></div>
          </section>
          <section className="surface p-4"><div className="font-bold mb-3">{t.stories}</div><div className="flex gap-3 overflow-x-auto"><button className="story-card bg-gradient-to-br from-blue-300 to-blue-600" onClick={()=>alert('Story upload is planned for the next release.')}><Plus size={25}/><span>{t.createStory}</span></button>{people.slice(0,5).map(p=><div key={p.id} className="story-card bg-gradient-to-br from-pink-200 to-purple-500"><Avatar name={p.full_name} url={p.avatar_url} size="h-11 w-11 border-2 border-white"/><span className="text-white truncate max-w-full">{p.full_name}</span></div>)}</div></section>
          {posts.length ? posts.map(p=><PostCard key={p.id} post={p} user={session.user} t={t} onRefresh={loadPosts}/>) : <div className="surface p-10 text-center text-slate-500">{t.noPosts}</div>}
        </>}
        {active==='friends' && <section className="surface p-5"><h2 className="text-xl font-bold mb-4">{t.friends}</h2>
          {requests.length>0 && <><h3 className="font-semibold mb-2">Friend requests</h3>{requests.map(r=><div key={r.id} className="flex items-center gap-3 py-2"><Avatar name={r.requester?.full_name}/><b className="flex-1 text-sm">{r.requester?.full_name}</b><button className="primary-btn !py-2" onClick={()=>acceptRequest(r.id)}>{t.accept}</button></div>)}</>}
          <h3 className="font-semibold mt-5 mb-3">{t.findFriends}</h3><input className="field mb-3" placeholder={t.search} value={query} onChange={e=>setQuery(e.target.value)}/>{filteredPeople.map(p=><div key={p.id} className="flex items-center gap-3 py-3 border-t"><Avatar name={p.full_name} url={p.avatar_url}/><b className="flex-1 text-sm">{p.full_name}</b><button className="primary-btn !py-2" onClick={()=>sendRequest(p.id)}>{t.sendRequest}</button></div>)}
          <h3 className="font-semibold mt-5 mb-2">Your friends</h3>{friends.map(f=>{const p=f.user_id===session.user.id?f.friend:f.requester;return <div key={f.id} className="flex items-center gap-3 py-2"><Avatar name={p?.full_name} url={p?.avatar_url}/><span className="font-semibold text-sm">{p?.full_name}</span><span className="text-xs text-emerald-600 ml-auto">Friends</span></div>})}
        </section>}
        {active==='messages' && <section className="surface p-4"><h2 className="text-xl font-bold mb-4">{t.messages}</h2><div className="grid sm:grid-cols-[190px_1fr] gap-3 min-h-96"><div className="border-r pr-2 space-y-1">{friends.map(f=>{const p=f.user_id===session.user.id?f.friend:f.requester;return <button key={f.id} onClick={()=>openChat(p)} className={`w-full flex items-center gap-2 p-2 rounded-xl text-left ${selectedFriend?.id===p?.id?'bg-blue-50':''}`}><Avatar size="h-8 w-8" name={p?.full_name} url={p?.avatar_url}/><span className="text-sm font-semibold truncate">{p?.full_name}</span></button>})}</div><div className="flex flex-col min-w-0">{selectedFriend?<><div className="font-bold border-b pb-2">{selectedFriend.full_name}</div><div className="flex-1 py-3 space-y-2 max-h-80 overflow-auto">{messages.map(m=><div key={m.id} className={`flex ${m.sender_id===session.user.id?'justify-end':''}`}><p className={`rounded-2xl px-3 py-2 text-sm max-w-[85%] ${m.sender_id===session.user.id?'bg-facehook text-white':'bg-slate-100'}`}>{m.content}</p></div>)}</div><form onSubmit={sendMessage} className="flex gap-2"><input className="field" value={messageText} onChange={e=>setMessageText(e.target.value)} placeholder="Write a message..."/><button className="primary-btn"><Send size={17}/></button></form></>:<div className="flex-1 grid place-items-center text-slate-400 text-sm">{t.chatSoon}</div>}</div></div></section>}
        {active==='profile' && <section className="surface p-5"><div className="flex items-center gap-4"><div className="relative"><Avatar name={profile?.full_name} url={profile?.avatar_url} size="h-20 w-20"/><label className="absolute -bottom-1 -right-1 bg-facehook text-white p-2 rounded-full cursor-pointer"><Camera size={15}/><input type="file" accept="image/*" className="hidden" onChange={uploadAvatar}/></label></div><div><h2 className="text-xl font-bold">{profile?.full_name}</h2><p className="text-sm text-slate-500">{session.user.email}</p></div></div><form onSubmit={saveBio} className="mt-6 space-y-3"><label className="text-sm font-semibold">{t.bio}</label><textarea name="bio" defaultValue={profile?.bio||''} className="field min-h-24"/><button className="primary-btn">{t.save}</button></form><button onClick={()=>supabase.auth.signOut()} className="mt-6 text-red-600 text-sm flex gap-2 items-center"><LogOut size={17}/>{t.signOut}</button></section>}
        {active==='videos' && <section className="surface p-8 text-center"><Video size={35} className="mx-auto text-facehook"/><h2 className="font-bold text-xl mt-3">{t.videos}</h2><p className="text-sm text-slate-500 mt-2">Video posts from your community will appear in the feed.</p></section>}
        {active==='notifications' && <section className="surface p-6"><h2 className="font-bold text-xl">{t.notifications}</h2><p className="text-sm text-slate-500 mt-3">Your friend requests and activity updates appear here.</p>{requests.map(r=><div key={r.id} className="py-3 border-t mt-3 flex items-center gap-3"><Avatar name={r.requester?.full_name}/><span className="text-sm">{r.requester?.full_name} sent you a friend request.</span><button className="primary-btn !py-1" onClick={()=>acceptRequest(r.id)}>{t.accept}</button></div>)}</section>}
      </main>
      <aside className="hidden xl:block w-72 pt-6"><div className="surface p-4 sticky top-24"><h3 className="font-bold mb-3">{t.people}</h3>{people.slice(0,7).map(p=><div key={p.id} className="flex items-center gap-2 py-2"><Avatar name={p.full_name} url={p.avatar_url} size="h-8 w-8"/><span className="text-sm font-semibold truncate flex-1">{p.full_name}</span><button onClick={()=>sendRequest(p.id)} className="text-facehook"><Plus size={18}/></button></div>)}<div className="border-t mt-4 pt-3 text-xs text-slate-400">Facehook · {new Date().getFullYear()} · Community guidelines</div></div></aside>
    </div>
    <nav className="mobile-nav lg:hidden">{navItems.slice(0,5).map(([Icon,id,label])=><button key={id} onClick={()=>setActive(id)} className={active===id?'text-facehook':''}><Icon size={21}/><span>{label}</span></button>)}</nav>
  </div>
}
export default App
