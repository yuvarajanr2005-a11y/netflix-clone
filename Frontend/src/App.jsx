import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/login';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await axios.post(API_URL, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <header className="topbar">
        <div className="logo">NETFLIX</div>
      </header>

      <main className="login-container">
        <form className="login-box" onSubmit={handleSubmit} noValidate>
          <h1>Sign In</h1>

          {serverError && <div className="error-banner">{serverError}</div>}

          <div className="field-group">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email or phone number"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="demo-login-box">
            <strong>Demo Login</strong>
            <span>Email: admin@netflix.com</span>
            <span>Password: password123</span>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#">Need help?</a>
          </div>

          <div className="signup-text">
            New to Netflix? <a href="#">Sign up now.</a>
          </div>

          <p className="recaptcha-text">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <a href="#">Learn more.</a>
          </p>
        </form>
      </main>
    </div>
  );
}

const demoTrailerClip = 'https://videos.pexels.com/video-files/857195/857195-hd_1920_1080_25fps.mp4';

const homeMovies = [
  { id: 1, title: 'Stranger Things', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 2, title: 'Dark', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 3, title: 'The Witcher', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 4, title: 'Money Heist', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 5, title: 'Wednesday', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 6, title: 'Squid Game', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
];

const tvShows = [
  { id: 1, title: 'The Crown', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 2, title: 'Black Mirror', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 3, title: 'Breaking Bad', image: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 4, title: 'You', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 5, title: 'The Last Kingdom', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 6, title: 'The Originals', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
];

const movieList = [
  { id: 1, title: 'Inception', image: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 2, title: 'Interstellar', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 3, title: 'Dune', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 4, title: 'Arrival', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 5, title: 'Blade Runner', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 6, title: 'Matrix', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
];

const myList = [
  { id: 1, title: 'The Witcher', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 2, title: 'Dark', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 3, title: 'Money Heist', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 4, title: 'Wednesday', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 5, title: 'Stranger Things', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
  { id: 6, title: 'Black Mirror', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=80', trailer: demoTrailerClip },
];

const categoryData = {
  Home: homeMovies,
  'TV Shows': tvShows,
  Movies: movieList,
  'My List': myList,
};

const quickPages = {
  Search: { title: 'Search', items: homeMovies.slice(0, 6) },
  Kids: { title: 'Kids', items: tvShows.slice(0, 6) },
  Bell: { title: 'Notifications', items: myList.slice(0, 6) },
};

function DashboardPage({ selectedTab = 'Home' }) {
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const openTrailer = (movie) => {
    setSelectedTrailer({
      title: movie.title,
      poster: movie.image,
      src: movie.trailer,
    });
  };

  const movies = categoryData[selectedTab] || homeMovies;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="nav-left">
          <div className="logo">NETFLIX</div>
          <nav className="main-nav">
            {[
              { label: 'Home', path: '/dashboard' },
              { label: 'TV Shows', path: '/dashboard/tv-shows' },
              { label: 'Movies', path: '/dashboard/movies' },
              { label: 'My List', path: '/dashboard/my-list' },
            ].map((tab) => (
              <a
                key={tab.label}
                href={tab.path}
                className={selectedTab === tab.label ? 'nav-box active' : 'nav-box'}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="nav-right">
          {Object.keys(quickPages).map((page) => (
            <a key={page} href={`/dashboard/${page.toLowerCase()}`} className="nav-box">
              {page}
            </a>
          ))}
          <div className="profile-pill">A</div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-tag">Trending Now</p>
          <h1>{movies[0].title}</h1>
          <p className="hero-description">
            When a young boy vanishes, a small town uncovers a mystery involving secret experiments,
            terrifying supernatural forces, and one very unusual girl.
          </p>

          <div className="hero-actions">
            <button className="play-btn" onClick={() => openTrailer(movies[0])}>▶ Play</button>
            <button className="info-btn">ⓘ More Info</button>
          </div>
        </div>
      </section>

      <main className="content-section">
        <div className="row">
          <h2>{selectedTab}</h2>
          <div className="movie-row poster-row">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card poster-card" onClick={() => openTrailer(movie)}>
                <img src={movie.image} alt={movie.title} />
                <span>{movie.title}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedTrailer && (
        <div className="video-modal" onClick={() => setSelectedTrailer(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedTrailer(null)}>✕</button>
            <div className="video-header">
              <h3>{selectedTrailer.title}</h3>
            </div>
            <video className="modal-video" src={selectedTrailer.src} poster={selectedTrailer.poster} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  );
}

function QuickPage({ pageName }) {
  const page = quickPages[pageName];
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const openTrailer = (movie) => {
    setSelectedTrailer({
      title: movie.title,
      poster: movie.image,
      src: movie.trailer,
    });
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="nav-left">
          <div className="logo">NETFLIX</div>
          <nav className="main-nav">
            {[
              { label: 'Home', path: '/dashboard' },
              { label: 'TV Shows', path: '/dashboard/tv-shows' },
              { label: 'Movies', path: '/dashboard/movies' },
              { label: 'My List', path: '/dashboard/my-list' },
            ].map((tab) => (
              <a key={tab.label} href={tab.path} className="nav-box">
                {tab.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="nav-right">
          {Object.keys(quickPages).map((page) => (
            <a key={page} href={`/dashboard/${page.toLowerCase()}`} className={pageName === page ? 'nav-box active' : 'nav-box'}>
              {page}
            </a>
          ))}
          <div className="profile-pill">A</div>
        </div>
      </header>

      <main className="content-section quick-page-content">
        <div className="row">
          <h2>{page.title}</h2>
          <div className="movie-row poster-row">
            {page.items.map((movie) => (
              <div key={movie.id} className="movie-card poster-card" onClick={() => openTrailer(movie)}>
                <img src={movie.image} alt={movie.title} />
                <span>{movie.title}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedTrailer && (
        <div className="video-modal" onClick={() => setSelectedTrailer(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedTrailer(null)}>✕</button>
            <div className="video-header">
              <h3>{selectedTrailer.title}</h3>
            </div>
            <video className="modal-video" src={selectedTrailer.src} poster={selectedTrailer.poster} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const location = window.location.pathname;
  const selectedTab =
    location.includes('/dashboard/tv-shows')
      ? 'TV Shows'
      : location.includes('/dashboard/movies')
        ? 'Movies'
        : location.includes('/dashboard/my-list')
          ? 'My List'
          : location.includes('/dashboard/search')
            ? 'Search'
            : location.includes('/dashboard/kids')
              ? 'Kids'
              : location.includes('/dashboard/bell')
                ? 'Bell'
                : 'Home';

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage selectedTab={selectedTab} />} />
      <Route path="/dashboard/tv-shows" element={<DashboardPage selectedTab="TV Shows" />} />
      <Route path="/dashboard/movies" element={<DashboardPage selectedTab="Movies" />} />
      <Route path="/dashboard/my-list" element={<DashboardPage selectedTab="My List" />} />
      <Route path="/dashboard/search" element={<QuickPage pageName="Search" />} />
      <Route path="/dashboard/kids" element={<QuickPage pageName="Kids" />} />
      <Route path="/dashboard/bell" element={<QuickPage pageName="Bell" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
