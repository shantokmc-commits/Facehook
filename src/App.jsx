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
    chatSoon: 'Choose a friend to start a conversation.', online: 'Online', offline: 'Offline', yourAccount: 'Your account', signOut: 'Sign out',
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
    chatSoon: 'কথা শুরু করতে একজন বন্ধুকে বেছে নিন।', online: 'অনলাইনে', offline: 'অফলাইনে', yourAccount: 'আপনার অ্যাকাউন্ট', signOut: 'লগআউট',
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

function Sidebar({ active, setActive, t, profile, onSignOut, unreadMessages }) {
  const items = [[Home,'home',t.home],[Users,'friends',t.friends],[Video,'videos',t.videos],[MessageCircle,'messages',t.messages],[Bell,'notifications',t.notifications],[UserRound,'profile',t.profile]]
  return <aside className="hidden lg:block w-64 shrink-0 pt-5">
    <div className="sticky top-24 space-y-1">
      {items.map(([Icon,id,label])=><button key={id} onClick={()=>setActive(id)} className={`side-link ${active===id?'side-active':''}`}><span className="relative"><Icon size={21}/>{id==='messages' && unreadMessages>0 && <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 font-bold">{unreadMessages>9?'9+':unreadMessages}</span>}</span>{label}</button>)}
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
    const { error } = liked
      ? await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      : await supabase.from('likes').insert({ post_id: post.id, user_id: user.id })
    if (error) {
      console.error('Like update error:', error)
      alert('Like error: ' + error.message)
      return
    }
    await onRefresh()
  }
  async function addComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    const { error } = await supabase.from('comments').insert({
      post_id: post.id,
      user_id: user.id,
      content: comment.trim()
    })
    if (error) {
      console.error('Comment insert error:', error)
      alert('Comment error: ' + error.message)
      return
    }
    setComment('')
    await onRefresh()
  }
  async function deletePost() {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Post delete error:', error)
      alert('Could not delete post: ' + error.message)
      return
    }

    await onRefresh()
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
  const [sentRequests,setSentRequests] = useState([])
  const [notifications,setNotifications] = useState([])
  const [friends,setFriends] = useState([])
  const [selectedFriend,setSelectedFriend] = useState(null)
  const [messages,setMessages] = useState([])
  const [unreadMessages,setUnreadMessages] = useState(0)
  const [onlineUsers,setOnlineUsers] = useState({})
  const [messageText,setMessageText] = useState('')
  const [query,setQuery] = useState('')
  const [stories,setStories] = useState([])
  const [viewingStory,setViewingStory] = useState(null)
  const [storyViewers,setStoryViewers] = useState([])
  const [storyViewsLoading,setStoryViewsLoading] = useState(false)
  const [storyReplies,setStoryReplies] = useState([])
  const [storyReplyText,setStoryReplyText] = useState('')
  const [storyReplySending,setStoryReplySending] = useState(false)
  const [storyUploading,setStoryUploading] = useState(false)

  useEffect(()=>{localStorage.setItem('fh-lang',lang)},[lang])
  useEffect(()=>{
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({data})=>setSession(data.session))
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,s)=>setSession(s))
    return ()=>subscription.unsubscribe()
  },[])
  useEffect(()=>{if(session?.user) loadAll(); else {setProfile(null);setPosts([]);setNotifications([]);setLoading(false)}},[session?.user?.id])
  useEffect(()=>{if(session?.user && active==='notifications') loadNotifications()},[active,session?.user?.id])
  useEffect(()=>{
    if (!supabase || !session?.user?.id) return
    const channel = supabase
      .channel(`facehook-notifications-${session.user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${session.user.id}`
      }, () => {
        loadNotifications()
        loadRequests()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },[session?.user?.id])
  useEffect(()=>{
    if (!supabase || !session?.user?.id) return
    const channel = supabase
      .channel(`facehook-presence-${session.user.id}`, { config: { presence: { key: session.user.id } } })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const online = {}
        Object.values(state).flat().forEach(presence => {
          if (presence.user_id) online[presence.user_id] = true
        })
        setOnlineUsers(online)
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: session.user.id, online_at: new Date().toISOString() })
        }
      })
    return () => {
      channel.untrack()
      supabase.removeChannel(channel)
      setOnlineUsers(current => { const next = { ...current }; delete next[session.user.id]; return next })
    }
  },[session?.user?.id])
  useEffect(()=>{
    if (!supabase || !session?.user?.id) return
    const channel = supabase
      .channel(`facehook-messages-${session.user.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `receiver_id=eq.${session.user.id}`
      }, payload => {
        loadUnreadMessages()
        if (selectedFriend?.id === payload.new.sender_id) openChat(selectedFriend)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },[session?.user?.id,selectedFriend?.id])
  async function loadProfile() {
    const u=session.user
    let {data}=await supabase.from('profiles').select('*').eq('id',u.id).maybeSingle()
    if (!data) {
      const {data:created}=await supabase.from('profiles').insert({id:u.id,full_name:u.user_metadata?.full_name||u.email?.split('@')[0]}).select().single()
      data=created
    }
    setProfile(data)
  }
  async function loadAll() { setLoading(true); await loadProfile(); await Promise.all([loadPosts(),loadFriends(),loadRequests(),loadSentRequests(),loadPeople(),loadNotifications(),loadUnreadMessages(),loadStories()]); setLoading(false) }
  async function loadStories() {
    const { data, error } = await supabase.from('stories').select('*').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false }).limit(50)
    if (error) { console.error('Stories loading error:', error); return }
    const ids = [...new Set((data || []).map(story => story.user_id).filter(Boolean))]
    let profilesById = {}
    if (ids.length) {
      const { data: profiles } = await supabase.from('profiles').select('id,full_name,avatar_url').in('id', ids)
      profilesById = Object.fromEntries((profiles || []).map(p => [p.id, p]))
    }
    setStories((data || []).map(story => ({ ...story, author: profilesById[story.user_id] || null })))
  }
  async function openStory(story) {
    setViewingStory(story)
    setStoryViewers([])
    setStoryReplies([])
    setStoryReplyText('')
    if (story.user_id === session.user.id) {
      setStoryViewsLoading(true)
      try {
        const { data, error } = await supabase.from('story_views').select('viewer_id, viewed_at').eq('story_id', story.id).order('viewed_at', { ascending: false })
        if (error) throw error
        const viewerIds = [...new Set((data || []).map(view => view.viewer_id).filter(Boolean))]
        let profilesById = {}
        if (viewerIds.length) {
          const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id,full_name,avatar_url').in('id', viewerIds)
          if (profilesError) throw profilesError
          profilesById = Object.fromEntries((profiles || []).map(person => [person.id, person]))
        }
        setStoryViewers((data || []).map(view => ({ ...view, profile: profilesById[view.viewer_id] || null })))
        const { data: replies, error: repliesError } = await supabase.from('story_replies').select('id,sender_id,content,created_at').eq('story_id', story.id).order('created_at', { ascending: false })
        if (repliesError) throw repliesError
        const senderIds = [...new Set((replies || []).map(reply => reply.sender_id).filter(Boolean))]
        let replyProfiles = {}
        if (senderIds.length) {
          const { data: people, error: peopleError } = await supabase.from('profiles').select('id,full_name,avatar_url').in('id', senderIds)
          if (peopleError) throw peopleError
          replyProfiles = Object.fromEntries((people || []).map(person => [person.id, person]))
        }
        setStoryReplies((replies || []).map(reply => ({ ...reply, author: replyProfiles[reply.sender_id] || null })))
      } catch (error) {
        console.error('Story viewers loading error:', error)
        alert('Could not load story viewers: ' + (error.message || 'Please try again.'))
      } finally {
        setStoryViewsLoading(false)
      }
      return
    }
    const { error } = await supabase.from('story_views').upsert(
      { story_id: story.id, viewer_id: session.user.id },
      { onConflict: 'story_id,viewer_id', ignoreDuplicates: true }
    )
    if (error) console.error('Story view recording error:', error)
  }
  async function sendStoryReply(e) {
    e.preventDefault()
    const content = storyReplyText.trim()
    if (!content || !viewingStory || viewingStory.user_id === session.user.id) return
    setStoryReplySending(true)
    try {
      const { error } = await supabase.from('story_replies').insert({
        story_id: viewingStory.id,
        sender_id: session.user.id,
        content
      })
      if (error) throw error
      setStoryReplyText('')
      alert('Story reply sent!')
    } catch (error) {
      console.error('Story reply error:', error)
      alert('Could not send story reply: ' + (error.message || 'Please try again.'))
    } finally {
      setStoryReplySending(false)
    }
  }
  async function uploadStory(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/') && !selected.type.startsWith('video/')) { alert('Choose an image or video.'); e.target.value = ''; return }
    if (selected.size > 50 * 1024 * 1024) { alert('Story file must be 50 MB or smaller.'); e.target.value = ''; return }
    setStoryUploading(true)
    try {
      const ext = (selected.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const path = session.user.id + '/' + Date.now() + '.' + ext
      const { error: uploadError } = await supabase.storage.from('story-media').upload(path, selected, { contentType: selected.type, cacheControl: '3600' })
      if (uploadError) throw uploadError
      const mediaUrl = supabase.storage.from('story-media').getPublicUrl(path).data.publicUrl
      const { error: insertError } = await supabase.from('stories').insert({ user_id: session.user.id, media_url: mediaUrl, media_type: selected.type })
      if (insertError) throw insertError
      await loadStories()
      alert('Story shared! It will disappear after 24 hours.')
    } catch (error) {
      console.error('Story upload error:', error)
      alert('Could not upload story: ' + (error.message || 'Please try again.'))
    } finally { setStoryUploading(false); e.target.value = '' }
  }
  async function deleteStory(story) {
    if (story.user_id !== session.user.id) return
    if (!confirm('Delete your story? This cannot be undone.')) return
    try {
      const marker = '/story-media/'
      const storagePath = story.media_url.includes(marker) ? decodeURIComponent(story.media_url.split(marker)[1].split('?')[0]) : null
      if (storagePath) {
        const { error: storageError } = await supabase.storage.from('story-media').remove([storagePath])
        if (storageError) throw storageError
      }
      const { error } = await supabase.from('stories').delete().eq('id', story.id).eq('user_id', session.user.id)
      if (error) throw error
      setViewingStory(null)
      await loadStories()
      alert('Story deleted successfully.')
    } catch (error) {
      console.error('Story delete error:', error)
      alert('Could not delete story: ' + (error.message || 'Please try again.'))
    }
  }
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
    const postIds = postsData.map(post => post.id)

    let commentsByPost = {}
    let likesByPost = {}
    let authorIds = [...new Set(postsData.map(post => post.user_id).filter(Boolean))]

    if (postIds.length) {
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('id, post_id, user_id, content, created_at')
        .in('post_id', postIds)
        .order('created_at', { ascending: true })

      if (commentsError) {
        console.error('Comments loading error:', commentsError)
        alert('Comments loading error: ' + commentsError.message)
      } else {
        for (const comment of comments || []) {
          if (!commentsByPost[comment.post_id]) commentsByPost[comment.post_id] = []
          commentsByPost[comment.post_id].push(comment)
          if (comment.user_id) authorIds.push(comment.user_id)
        }
      }

      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('post_id, user_id')
        .in('post_id', postIds)
      if (likesError) {
        console.error('Likes loading error:', likesError)
      } else {
        for (const like of likes || []) {
          if (!likesByPost[like.post_id]) likesByPost[like.post_id] = []
          likesByPost[like.post_id].push({ user_id: like.user_id })
        }
      }
    }

    authorIds = [...new Set(authorIds)]
    let profilesById = {}
    if (authorIds.length) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', authorIds)

      if (profileError) {
        console.error('Profile loading error:', profileError)
      } else {
        profilesById = Object.fromEntries((profiles || []).map(item => [item.id, item]))
      }
    }

    setPosts(postsData.map(post => ({
      ...post,
      author: profilesById[post.user_id] || (post.user_id === session.user.id ? { full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'My Profile', avatar_url: profile?.avatar_url || null } : null),
      likes: likesByPost[post.id] || [],
      comments: (commentsByPost[post.id] || []).map(comment => ({
        ...comment,
        author: profilesById[comment.user_id] || null
      }))
    })))
  }
  async function loadPeople() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .neq('id', session.user.id)
      .order('full_name', { ascending: true })
      .limit(100)

    if (error) {
      console.error('People loading error:', error)
      alert('Could not load people: ' + error.message)
      return
    }
    setPeople(data || [])
  }
  async function loadFriends() {
    const {data}=await supabase.from('friendships').select('*, friend:profiles!friendships_friend_id_fkey(id,full_name,avatar_url), requester:profiles!friendships_user_id_fkey(id,full_name,avatar_url)').or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`).eq('status','accepted')
    setFriends(data||[])
  }
  async function loadRequests() {
    const {data}=await supabase.from('friendships').select('*, requester:profiles!friendships_user_id_fkey(id,full_name,avatar_url)').eq('friend_id',session.user.id).eq('status','pending')
    setRequests(data||[])
  }
  async function loadSentRequests() {
    const { data, error } = await supabase
      .from('friendships')
      .select('*, recipient:profiles!friendships_friend_id_fkey(id,full_name,avatar_url)')
      .eq('user_id', session.user.id)
      .eq('status', 'pending')
    if (error) {
      console.error('Sent requests loading error:', error)
      return
    }
    setSentRequests(data || [])
  }
  async function loadUnreadMessages() {
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', session.user.id)
      .eq('is_read', false)
    if (error) {
      console.error('Unread messages loading error:', error)
      return
    }
    setUnreadMessages(count || 0)
  }

  async function loadNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, actor_id, type, post_id, friendship_id, is_read, created_at')
      .eq('recipient_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Notifications loading error:', error)
      return
    }

    const actorIds = [...new Set((data || []).map(item => item.actor_id).filter(Boolean))]
    let actors = {}
    if (actorIds.length) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', actorIds)
      actors = Object.fromEntries((profiles || []).map(item => [item.id, item]))
    }
    setNotifications((data || []).map(item => ({ ...item, actor: actors[item.actor_id] || null })))
  }

  async function markNotificationRead(id) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('recipient_id', session.user.id)
    if (error) {
      alert('Could not update notification: ' + error.message)
      return
    }
    setNotifications(current => current.map(item => item.id === id ? { ...item, is_read: true } : item))
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
    const { data: existing, error: checkError } = await supabase
      .from('friendships')
      .select('id, user_id, friend_id, status')
      .or(`and(user_id.eq.${session.user.id},friend_id.eq.${personId}),and(user_id.eq.${personId},friend_id.eq.${session.user.id})`)
      .limit(1)

    if (checkError) {
      console.error('Friend request check error:', checkError)
      alert('Friend request error: ' + checkError.message)
      return
    }

    if (existing?.length) {
      const relation = existing[0]
      if (relation.status === 'accepted') {
        alert('You are already friends.')
      } else if (relation.user_id === session.user.id) {
        alert('Friend request already sent.')
      } else {
        alert('This person has already sent you a request. Please accept it in Friends.')
      }
      return
    }

    const { error } = await supabase.from('friendships').insert({
      user_id: session.user.id,
      friend_id: personId,
      status: 'pending'
    })
    if (error) {
      console.error('Friend request insert error:', error)
      alert('Friend request error: ' + error.message)
      return
    }

    alert(t.sent)
    await Promise.all([loadPeople(), loadRequests(), loadSentRequests(), loadFriends()])
  }

  async function acceptRequest(id) {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', id)
      .eq('friend_id', session.user.id)

    if (error) {
      console.error('Accept request error:', error)
      alert('Accept request error: ' + error.message)
      return
    }
    await Promise.all([loadRequests(), loadSentRequests(), loadFriends(), loadPeople()])
  }
  async function removeFriendRequest(id, direction) {
    const column = direction === 'incoming' ? 'friend_id' : 'user_id'
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', id)
      .eq(column, session.user.id)
      .eq('status', 'pending')

    if (error) {
      console.error('Friend request removal error:', error)
      alert('Could not remove friend request: ' + error.message)
      return
    }
    await Promise.all([loadRequests(), loadSentRequests(), loadPeople()])
    alert(direction === 'incoming' ? 'Friend request declined.' : 'Friend request cancelled.')
  }

  async function openChat(friend) {
    if (!friend?.id) return
    setSelectedFriend(friend)
    const { error: readError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', friend.id)
      .eq('receiver_id', session.user.id)
      .eq('is_read', false)
    if (readError) console.error('Mark messages as read error:', readError)

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${session.user.id})`)
      .order('created_at', { ascending: true })
    if (error) {
      console.error('Load chat error:', error)
      alert('Could not load messages: ' + error.message)
      setMessages([])
      return
    }
    setMessages(data || [])
    await loadUnreadMessages()
  }

  async function sendMessage(e) {
    e.preventDefault()
    const content = messageText.trim()
    if (!content || !selectedFriend) return
    const { error } = await supabase.from('messages').insert({
      sender_id: session.user.id,
      receiver_id: selectedFriend.id,
      content
    })
    if (error) {
      console.error('Send message error:', error)
      alert('Could not send message: ' + error.message)
      return
    }
    setMessageText('')
    await openChat(selectedFriend)
  }
  async function uploadAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.')
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be 5 MB or smaller.')
      e.target.value = ''
      return
    }

    try {
      const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const path = `${session.user.id}/avatar-${Date.now()}.${extension}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' })
      if (uploadError) throw uploadError

      const url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
      const { data, error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', session.user.id)
        .select()
        .single()
      if (profileError) throw profileError

      setProfile(data)
      await loadPosts()
      alert('Profile photo updated successfully!')
    } catch (error) {
      console.error('Avatar upload error:', error)
      alert('Profile photo error: ' + (error.message || 'Please try again.'))
    } finally {
      e.target.value = ''
    }
  }
  async function uploadCover(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.')
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be 5 MB or smaller.')
      e.target.value = ''
      return
    }
    try {
      const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const path = `${session.user.id}/cover-${Date.now()}.${extension}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' })
      if (uploadError) throw uploadError
      const url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
      const { data, error: profileError } = await supabase.from('profiles').update({ cover_url: url }).eq('id', session.user.id).select().single()
      if (profileError) throw profileError
      setProfile(data)
      alert('Cover photo updated successfully!')
    } catch (error) {
      console.error('Cover upload error:', error)
      alert('Cover photo error: ' + (error.message || 'Please try again.'))
    } finally {
      e.target.value = ''
    }
  }

  async function saveProfile(e) {
    e.preventDefault()
    const form = e.currentTarget
    const fullName = form.full_name.value.trim()
    const bio = form.bio.value.trim()

    if (!fullName) {
      alert('Please enter your name.')
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, bio })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile save error:', error)
      alert('Profile update error: ' + error.message)
      return
    }

    setProfile(data)
    await loadPosts()
    alert('Profile updated successfully!')
  }
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
          <button className="icon-btn relative" title={t.notifications} onClick={()=>setActive('notifications')}><Bell size={19}/>{notifications.some(n=>!n.is_read) && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 font-bold">{notifications.filter(n=>!n.is_read).length>9?'9+':notifications.filter(n=>!n.is_read).length}</span>}</button>
          <button className="flex items-center gap-2 rounded-full hover:bg-slate-100 p-1" onClick={()=>setActive('profile')}><Avatar name={profile?.full_name} url={profile?.avatar_url} size="h-9 w-9"/><span className="hidden md:block text-sm font-semibold max-w-28 truncate">{profile?.full_name}</span></button>
          <button className="icon-btn hidden sm:flex" title={t.signOut} onClick={()=>supabase.auth.signOut()}><LogOut size={18}/></button>
        </div>
      </div>
    </header>
    <div className="max-w-7xl mx-auto px-3 sm:px-4 flex gap-5">
      <Sidebar active={active} setActive={setActive} t={t} profile={profile} unreadMessages={unreadMessages} onSignOut={()=>supabase.auth.signOut()}/>
      <main className="w-full max-w-2xl mx-auto lg:mx-0 py-5 pb-24 space-y-4 min-w-0">
        {active==='home' && <>
          <section className="surface p-4">
            <div className="flex gap-3"><Avatar name={profile?.full_name} url={profile?.avatar_url}/><textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t.whats} className="field resize-none min-h-12" rows="2"/></div>
            {file && <div className="mt-3 text-xs bg-blue-50 text-blue-700 rounded-lg p-2 flex justify-between">{file.name}<button onClick={()=>setFile(null)}><X size={15}/></button></div>}
            <div className="border-t mt-3 pt-3 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-semibold text-emerald-600 cursor-pointer"><Image size={19}/>{t.photoVideo}<input type="file" accept="image/*,video/*" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><button disabled={publishing} onClick={publish} className="primary-btn !py-2 !px-6">{publishing?t.loading:t.post}</button></div>
          </section>
          <section className="surface p-4"><div className="font-bold mb-3">{t.stories}</div><div className="flex gap-3 overflow-x-auto"><label className={`story-card bg-gradient-to-br from-blue-300 to-blue-600 cursor-pointer ${storyUploading?'opacity-60':''}`}><Plus size={25}/><span>{storyUploading?'Uploading...':t.createStory}</span><input type="file" accept="image/*,video/*" className="hidden" disabled={storyUploading} onChange={uploadStory}/></label>{stories.map(story=><button key={story.id} onClick={()=>openStory(story)} className="story-card bg-gradient-to-br from-pink-300 to-purple-600"><Avatar name={story.author?.full_name} url={story.author?.avatar_url} size="h-11 w-11 border-2 border-white"/><span className="text-white truncate max-w-full">{story.author?.full_name || 'Facehook member'}</span></button>)}</div>{stories.length===0 && <p className="text-xs text-slate-400 mt-2">No active stories yet. Share the first one!</p>}</section>
          {posts.length ? posts.map(p=><PostCard key={p.id} post={p} user={session.user} t={t} onRefresh={loadPosts}/>) : <div className="surface p-10 text-center text-slate-500">{t.noPosts}</div>}
        </>}
        {active==='friends' && <section className="surface p-5"><h2 className="text-xl font-bold mb-4">{t.friends}</h2>
          {requests.length>0 && <><h3 className="font-semibold mb-2">Friend requests</h3>{requests.map(r=><div key={r.id} className="flex items-center gap-3 py-2"><Avatar name={r.requester?.full_name}/><b className="flex-1 text-sm">{r.requester?.full_name}</b><button className="primary-btn !py-2" onClick={()=>acceptRequest(r.id)}>{t.accept}</button><button className="text-sm text-red-600" onClick={()=>removeFriendRequest(r.id,'incoming')}>Reject</button></div>)}</>}{sentRequests.length>0 && <><h3 className="font-semibold mt-4 mb-2">Sent requests</h3>{sentRequests.map(r=><div key={r.id} className="flex items-center gap-3 py-2"><Avatar name={r.recipient?.full_name} url={r.recipient?.avatar_url}/><b className="flex-1 text-sm">{r.recipient?.full_name}</b><span className="text-xs text-amber-600">Pending</span><button className="text-sm text-red-600" onClick={()=>removeFriendRequest(r.id,'outgoing')}>Cancel</button></div>)}</>}
          <h3 className="font-semibold mt-5 mb-3">{t.findFriends}</h3><input className="field mb-3" placeholder={t.search} value={query} onChange={e=>setQuery(e.target.value)}/>{filteredPeople.map(p=><div key={p.id} className="flex items-center gap-3 py-3 border-t"><Avatar name={p.full_name} url={p.avatar_url}/><b className="flex-1 text-sm">{p.full_name}</b><button className="primary-btn !py-2" onClick={()=>sendRequest(p.id)}>{t.sendRequest}</button></div>)}{filteredPeople.length===0 && <p className="text-sm text-slate-500 py-4">{people.length===0?'এখনো অন্য কেউ Facehook-এ অ্যাকাউন্ট খোলেনি। নতুন সদস্য যোগ হলে এখানে দেখা যাবে।':'আপনার খোঁজার সঙ্গে মিলে এমন কাউকে পাওয়া যায়নি।'}</p>}
          <h3 className="font-semibold mt-5 mb-2">Your friends</h3>{friends.map(f=>{const p=f.user_id===session.user.id?f.friend:f.requester;return <div key={f.id} className="flex items-center gap-3 py-2"><Avatar name={p?.full_name} url={p?.avatar_url}/><span className="font-semibold text-sm">{p?.full_name}</span><span className="text-xs text-emerald-600 ml-auto">Friends</span></div>})}{friends.length===0 && <p className="text-sm text-slate-500 py-3">এখনো আপনার কোনো বন্ধু নেই। Find people থেকে সদস্য খুঁজে Friend Request পাঠান।</p>}
        </section>}
        {active==='messages' && <section className="surface p-4"><h2 className="text-xl font-bold mb-4">{t.messages}</h2><div className="grid sm:grid-cols-[190px_1fr] gap-3 min-h-96"><div className="border-r pr-2 space-y-1">{friends.map(f=>{const p=f.user_id===session.user.id?f.friend:f.requester;return <button key={f.id} onClick={()=>openChat(p)} className={`w-full flex items-center gap-2 p-2 rounded-xl text-left ${selectedFriend?.id===p?.id?'bg-blue-50':''}`}><Avatar size="h-8 w-8" name={p?.full_name} url={p?.avatar_url}/><span className="min-w-0 flex-1"><span className="block text-sm font-semibold truncate">{p?.full_name}</span><span className={`block text-[10px] ${onlineUsers[p?.id]?'text-emerald-600':'text-slate-400'}`}>{onlineUsers[p?.id]?t.online:t.offline}</span></span></button>})}</div><div className="flex flex-col min-w-0">{selectedFriend?<><div className="font-bold border-b pb-2"><div>{selectedFriend.full_name}</div><div className={`text-xs font-normal ${onlineUsers[selectedFriend.id]?'text-emerald-600':'text-slate-400'}`}>{onlineUsers[selectedFriend.id]?t.online:t.offline}</div></div><div className="flex-1 py-3 space-y-2 max-h-80 overflow-auto">{messages.map(m=><div key={m.id} className={`flex ${m.sender_id===session.user.id?'justify-end':''}`}><p className={`rounded-2xl px-3 py-2 text-sm max-w-[85%] ${m.sender_id===session.user.id?'bg-facehook text-white':'bg-slate-100'}`}>{m.content}</p></div>)}</div><form onSubmit={sendMessage} className="flex gap-2"><input className="field" value={messageText} onChange={e=>setMessageText(e.target.value)} placeholder="Write a message..."/><button className="primary-btn"><Send size={17}/></button></form></>:<div className="flex-1 grid place-items-center text-slate-400 text-sm">{t.chatSoon}</div>}</div></div></section>}
        {active==='profile' && <section className="surface overflow-hidden"><div className="relative h-44 sm:h-56 bg-gradient-to-r from-blue-200 via-sky-100 to-indigo-200">{profile?.cover_url && <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover"/>}<label className="absolute right-3 bottom-3 bg-white text-slate-700 px-3 py-2 rounded-lg shadow cursor-pointer text-sm font-semibold flex items-center gap-2"><Camera size={16}/> Change cover<input type="file" accept="image/*" className="hidden" onChange={uploadCover}/></label></div><div className="px-5 pb-5"><div className="flex flex-wrap items-end gap-4 -mt-12 relative"><div className="relative rounded-full ring-4 ring-white"><Avatar name={profile?.full_name} url={profile?.avatar_url} size="h-24 w-24"/><label className="absolute -bottom-1 -right-1 bg-facehook text-white p-2 rounded-full cursor-pointer"><Camera size={15}/><input type="file" accept="image/*" className="hidden" onChange={uploadAvatar}/></label></div><div className="pb-1"><h2 className="text-xl font-bold">{profile?.full_name}</h2><p className="text-sm text-slate-500">{session.user.email}</p></div></div><form onSubmit={saveProfile} className="mt-6 space-y-3"><label className="text-sm font-semibold">{t.name}</label><input name="full_name" defaultValue={profile?.full_name||''} className="field" required maxLength="60"/><label className="text-sm font-semibold">{t.bio}</label><textarea name="bio" defaultValue={profile?.bio||''} className="field min-h-24" maxLength="250"/><button className="primary-btn">{t.save}</button></form><button onClick={()=>supabase.auth.signOut()} className="mt-6 text-red-600 text-sm flex gap-2 items-center"><LogOut size={17}/>{t.signOut}</button></div></section>}
        {active==='videos' && <><section className="surface p-4"><div className="flex items-center gap-2"><Video size={22} className="text-facehook"/><h2 className="font-bold text-xl">{t.videos}</h2></div><p className="text-sm text-slate-500 mt-1">All video posts shared by Facehook members.</p></section>{posts.filter(p=>p.media_type?.startsWith('video')).length ? posts.filter(p=>p.media_type?.startsWith('video')).map(p=><PostCard key={p.id} post={p} user={session.user} t={t} onRefresh={loadPosts}/>) : <section className="surface p-8 text-center"><Video size={35} className="mx-auto text-slate-300"/><h3 className="font-bold mt-3">No videos yet</h3><p className="text-sm text-slate-500 mt-2">When you or your friends share a video, it will appear here.</p><button className="primary-btn mt-4" onClick={()=>setActive('home')}>Create a post</button></section>}</>}
        {active==='notifications' && <section className="surface p-6"><div className="flex items-center justify-between"><h2 className="font-bold text-xl">{t.notifications}</h2><button className="text-sm text-facehook" onClick={loadNotifications}>Refresh</button></div>{notifications.length ? notifications.map(n=><div key={n.id} className={`py-3 border-t mt-2 flex items-center gap-3 ${n.is_read?'opacity-60':'bg-blue-50/60'}`}><Avatar name={n.actor?.full_name} url={n.actor?.avatar_url}/><div className="flex-1 min-w-0"><p className="text-sm"><b>{n.actor?.full_name || 'A Facehook member'}</b>{n.type==='friend_request'?' sent you a friend request.':n.type==='like'?' liked your post.':n.type==='comment'?' commented on your post.':' interacted with you.'}</p><p className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</p></div>{n.type==='friend_request' && requests.some(r=>r.id===n.friendship_id) && <button className="primary-btn !py-1" onClick={()=>acceptRequest(n.friendship_id)}>{t.accept}</button>}{!n.is_read && <button className="text-xs text-facehook" onClick={()=>markNotificationRead(n.id)}>Mark read</button>}</div>) : <p className="text-sm text-slate-500 mt-4">No notifications yet.</p>}{requests.filter(r=>!notifications.some(n=>n.friendship_id===r.id)).map(r=><div key={r.id} className="py-3 border-t mt-3 flex items-center gap-3"><Avatar name={r.requester?.full_name}/><span className="text-sm flex-1">{r.requester?.full_name} sent you a friend request.</span><button className="primary-btn !py-1" onClick={()=>acceptRequest(r.id)}>{t.accept}</button></div>)}</section>}
      </main>
      <aside className="hidden xl:block w-72 pt-6"><div className="surface p-4 sticky top-24"><h3 className="font-bold mb-3">{t.people}</h3>{people.slice(0,7).map(p=><div key={p.id} className="flex items-center gap-2 py-2"><Avatar name={p.full_name} url={p.avatar_url} size="h-8 w-8"/><span className="text-sm font-semibold truncate flex-1">{p.full_name}</span><button onClick={()=>sendRequest(p.id)} className="text-facehook"><Plus size={18}/></button></div>)}<div className="border-t mt-4 pt-3 text-xs text-slate-400">Facehook · {new Date().getFullYear()} · Community guidelines</div></div></aside>
    </div>
    {viewingStory && <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3" onClick={()=>setViewingStory(null)}><button className="absolute top-4 right-4 text-white text-3xl" onClick={()=>setViewingStory(null)} aria-label="Close story">×</button><div className="w-full max-w-md max-h-[90vh] flex flex-col items-center" onClick={e=>e.stopPropagation()}><div className="text-white text-sm mb-3 self-start">{viewingStory.author?.full_name || 'Facehook member'}</div>{viewingStory.media_type?.startsWith('video') ? <video src={viewingStory.media_url} controls autoPlay playsInline className="max-h-[78vh] max-w-full rounded-xl"/> : <img src={viewingStory.media_url} alt="Story" className="max-h-[78vh] max-w-full object-contain rounded-xl"/>}<p className="text-white/70 text-xs mt-3">Disappears after 24 hours</p>{viewingStory.user_id === session.user.id && <div className="w-full mt-3 rounded-xl bg-white/10 p-3 text-white"><div className="text-sm font-bold mb-2">Story viewers ({storyViewers.length})</div>{storyViewsLoading ? <p className="text-xs text-white/70">Loading viewers...</p> : storyViewers.length ? <div className="space-y-2 max-h-32 overflow-y-auto">{storyViewers.map(view=><div key={view.viewer_id} className="flex items-center gap-2 text-sm"><Avatar name={view.profile?.full_name || 'Facehook member'} url={view.profile?.avatar_url} size="h-7 w-7"/><span className="flex-1">{view.profile?.full_name || 'Facehook member'}</span><span className="text-[10px] text-white/60">{new Date(view.viewed_at).toLocaleString()}</span></div>)}</div> : <p className="text-xs text-white/70">No views yet.</p>}</div>}{viewingStory.user_id !== session.user.id && <form onSubmit={sendStoryReply} className="w-full mt-3 flex gap-2"><input value={storyReplyText} onChange={e=>setStoryReplyText(e.target.value)} maxLength={500} placeholder="Reply to this story..." className="flex-1 min-w-0 rounded-full bg-white/95 px-4 py-2 text-sm text-slate-900 outline-none" /><button disabled={storyReplySending || !storyReplyText.trim()} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{storyReplySending ? 'Sending...' : 'Send'}</button></form>}{viewingStory.user_id === session.user.id && <div className="w-full mt-3 rounded-xl bg-white/10 p-3 text-white"><div className="text-sm font-bold mb-2">Story replies ({storyReplies.length})</div>{storyReplies.length ? <div className="space-y-2 max-h-36 overflow-y-auto">{storyReplies.map(reply=><div key={reply.id} className="flex items-start gap-2 text-sm"><Avatar name={reply.author?.full_name || 'Facehook member'} url={reply.author?.avatar_url} size="h-7 w-7"/><div className="min-w-0 flex-1"><div className="font-semibold">{reply.author?.full_name || 'Facehook member'}</div><p className="text-white/90 break-words">{reply.content}</p><span className="text-[10px] text-white/60">{new Date(reply.created_at).toLocaleString()}</span></div></div>)}</div> : <p className="text-xs text-white/70">No replies yet.</p>}</div>}{viewingStory.user_id === session.user.id && <button onClick={()=>deleteStory(viewingStory)} className="mt-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2">Delete story</button>}</div></div>}
    <nav className="mobile-nav lg:hidden">{navItems.slice(0,5).map(([Icon,id,label])=><button key={id} onClick={()=>setActive(id)} className={active===id?'text-facehook':''}><span className="relative"><Icon size={21}/>{id==='notifications' && notifications.some(n=>!n.is_read) && <span className="absolute -top-2 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[9px] leading-3.5 font-bold">{notifications.filter(n=>!n.is_read).length>9?'9+':notifications.filter(n=>!n.is_read).length}</span>}{id==='messages' && unreadMessages>0 && <span className="absolute -top-2 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[9px] leading-3.5 font-bold">{unreadMessages>9?'9+':unreadMessages}</span>}</span><span>{label}</span></button>)}</nav>
  </div>
}
export default App
