import { useState } from 'react'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const trailerUrl = 'https://www.youtube-nocookie.com/embed/ZnH_2I0WoFQ?autoplay=1&rel=0'
const homeShows = [
  ['Vikram', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80'],
  ['Jai Bhim', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80'],
  ['96', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=80'],
  ['Soorarai Pottru', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80'],
  ['Kaithi', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80'],
]
const favourites = [
  { title: 'Vikram', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80', genre: 'Action | Thriller' },
  { title: 'Jai Bhim', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80', genre: 'Drama | Courtroom' },
  { title: '96', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=80', genre: 'Romance | Drama' },
]

function Logo() { return <div className="logo">NET<span>FLIX</span></div> }

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const update = (field, value) => { setForm((x) => ({ ...x, [field]: value })); setErrors((x) => ({ ...x, [field]: '' })); setApiError('') }
  const submit = async (event) => {
    event.preventDefault()
    const next = {}
    if (!form.email) next.email = 'Email is required.'
    else if (!emailPattern.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    try {
      const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      onLogin(data.user)
    } catch (error) { setApiError(error.message) } finally { setLoading(false) }
  }
  return <main className="auth-page"><div className="poster-wall" aria-hidden="true">{['NOVA', 'ECHO', 'RUSH', 'VOID', 'LUNA', 'CROWN', 'AURA', 'DRIFT', 'SILO', 'NORTH', 'WAVE', 'EMBER'].map((title, i) => <div className={`poster p${i + 1}`} key={title}><small>STREAMLINE ORIGINAL</small><b>{title}</b></div>)}</div><div className="page-shade" /><header className="auth-header"><Logo /><button className="header-help">Help center</button></header><section className="login-card"><div className="card-intro"><p className="eyebrow">YOUR STORIES ARE WAITING</p><h1>Welcome back</h1><p>Sign in to continue watching where you left off.</p></div>{apiError && <div className="alert">{apiError}</div>}<form onSubmit={submit}><label>Email address</label><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" className={errors.email ? 'invalid' : ''}/>{errors.email && <p className="field-error">{errors.email}</p>}<label>Password</label><input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Enter your password" className={errors.password ? 'invalid' : ''}/>{errors.password && <p className="field-error">{errors.password}</p>}<div className="form-options"><label className="check"><input type="checkbox" /> Remember me</label><button type="button" className="text-button">Forgot password?</button></div><button className="sign-in" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button></form><div className="demo-box"><div><span className="demo-tag">DEMO ACCESS</span><p><b>demo@streamline.com</b><br />Password: <b>stream123</b></p></div><button onClick={() => { update('email', 'demo@streamline.com'); update('password', 'stream123') }}>Use demo</button></div></section></main>
}

function Card({ item, onPlay, onInfo, saved, onSave }) {
  const [previewing, setPreviewing] = useState(false)
  return <article className="media-card" onMouseEnter={() => setPreviewing(true)} onMouseLeave={() => setPreviewing(false)} onFocus={() => setPreviewing(true)} onBlur={() => setPreviewing(false)}>
    <img src={item.image} alt={`${item.title || item.name} poster`} />
    {previewing && <video className="silent-preview" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" autoPlay muted loop playsInline aria-label={`Muted preview for ${item.title || item.name}`} />}
    <div className="preview-badge">Muted preview</div><div className="media-gradient" />
    <div className="media-card-body"><span>{item.year || '2024'} | {item.genre || item.genres?.join(' | ')}</span><h2>{item.title || item.name}</h2><div className="card-actions"><button onClick={() => onPlay(item)}>Play</button><button onClick={() => onInfo(item)} className="circle-btn">i</button>{onSave && <button onClick={() => onSave(item)} className="circle-btn">{saved ? 'Saved' : '+'}</button>}</div></div>
  </article>
}

function VideoModal({ title, onBack }) { return <div className="modal-backdrop"><section className="player-modal tamil-player"><button className="modal-close" onClick={onBack}>x</button><div className="video-title"><span>NOW PLAYING</span><strong>{title}</strong></div><iframe src={trailerUrl} title="Tamil movie trailer" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /><button className="return-home" onClick={onBack}>Back to home</button></section></div> }

function Dashboard({ user, onLogout }) {
  const [section, setSection] = useState('home')
  const [movies, setMovies] = useState([])
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState(null)
  const [playing, setPlaying] = useState(null)
  const [myList, setMyList] = useState(favourites)
  const playTamilTrailer = (item = {}) => { setSelected(null); setPlaying({ title: item.title || item.name || 'Retro - Tamil Movie Trailer' }) }
  const backHome = () => { setPlaying(null); setSection('home') }
  const openCatalogue = async (kind) => {
    setSection(kind)
    const existing = kind === 'movies' ? movies : series
    if (existing.length) return
    setLoading(true); setMessage('')
    try {
      const response = await fetch(kind === 'movies' ? '/api/tamil-movies' : '/api/tamil-series')
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      const items = kind === 'movies' ? data.movies : data.shows.map((show) => ({ ...show, title: show.name, genre: show.genres.join(' | ') }))
      kind === 'movies' ? setMovies(items) : setSeries(items)
    } catch (error) { setMessage(error.message || 'Could not load catalogue.') } finally { setLoading(false) }
  }
  const save = (item) => setMyList((old) => old.some((x) => (x.id || x.title) === (item.id || item.title)) ? old : [...old, { ...item, title: item.title || item.name }])
  const catalogue = section === 'movies' ? movies : series
  return <main className="dashboard"><header className="dash-header"><Logo /><nav><button className={section === 'home' ? 'active' : ''} onClick={() => setSection('home')}>Home</button><button className={section === 'series' ? 'active' : ''} onClick={() => openCatalogue('series')}>Tamil Series</button><button className={section === 'movies' ? 'active' : ''} onClick={() => openCatalogue('movies')}>Tamil Movies</button><button className={section === 'mylist' ? 'active' : ''} onClick={() => setSection('mylist')}>My List</button></nav><button onClick={onLogout} className="profile">{user.name[0]} <span>Sign out</span></button></header>{section === 'home' ? <><section className="hero"><div className="hero-copy"><p className="eyebrow">STREAMLINE ORIGINAL | TAMIL CINEMA</p><h1>THE<br /><em>HORIZON</em></h1><p>One crew. One final chance. Explore the unknown in the season everyone is talking about.</p><div><button className="play" onClick={() => playTamilTrailer({ title: 'Retro - Tamil Movie Trailer' })}>Play Tamil video</button><button className="details" onClick={() => playTamilTrailer({ title: 'Retro - Tamil Movie Trailer' })}>Watch trailer</button></div></div></section><section className="continue"><h2>Continue watching</h2><p>Streamline originals with cinematic poster images.</p><div className="show-row">{homeShows.map(([title, image]) => <Card key={title} item={{ title, image, year: 2026, genre: 'Streamline Original' }} onPlay={playTamilTrailer} onInfo={setSelected} />)}</div></section></> : <section className="catalogue"><div className="catalogue-heading"><div><p className="eyebrow">YOUR PERSONAL CINEMA</p><h1>{section === 'mylist' ? 'My Favourite List' : section === 'movies' ? 'Tamil Movies' : 'Tamil Series'}</h1><p>{section === 'mylist' ? 'Your saved Tamil favourites, ready whenever you are.' : 'Fresh Tamil stories with posters and details from a public API.'}</p></div><button className="back" onClick={() => setSection('home')}>Back to home</button></div>{loading && <div className="catalogue-message">Loading Tamil catalogue...</div>}{message && <div className="catalogue-message">{message}</div>}<div className="catalogue-grid">{(section === 'mylist' ? myList : catalogue).map((item) => <Card key={item.id || item.title} item={item} onPlay={playTamilTrailer} onInfo={setSelected} saved={myList.some((x) => (x.id || x.title) === (item.id || item.title))} onSave={section !== 'mylist' ? save : undefined} />)}</div></section>}{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="info-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>x</button><p className="eyebrow">TAMIL CINEMA SPOTLIGHT</p><h2>{selected.title || selected.name}</h2><span>{selected.year || '2024'} | {selected.genre || selected.genres?.join(' | ')}</span><p>{selected.description || 'A compelling Tamil story with unforgettable characters, rich emotions and a cinematic journey made for the big screen.'}</p><button className="play" onClick={() => playTamilTrailer(selected)}>Play trailer</button></section></div>}{playing && <VideoModal title={playing.title} onBack={backHome} />}</main>
}

export default function App() { const [user, setUser] = useState(null); return user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Login onLogin={setUser} /> }
