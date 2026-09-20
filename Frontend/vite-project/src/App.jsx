import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/login';

const heroVideo = {
  title: 'Stranger Things',
  duration: '30 sec',
  src: 'https://videos.pexels.com/video-files/854995/854995-hd_1920_1080_25fps.mp4',
  poster:
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
};

const trailerRows = [
  {
    title: 'Continue Watching',
    items: [
      {
        id: 1,
        title: 'Stranger Things',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/854995/854995-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 2,
        title: 'Dark',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 3,
        title: 'The Witcher',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 4,
        title: 'Money Heist',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/850405/850405-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 5,
        title: 'Wednesday',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/852144/852144-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 6,
        title: 'Squid Game',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/853890/853890-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    title: 'Trending Now',
    items: [
      {
        id: 7,
        title: 'The Crown',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/854996/854996-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 8,
        title: 'Black Mirror',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/854994/854994-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 9,
        title: 'Breaking Bad',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/854993/854993-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 10,
        title: 'You',
        duration: '30 sec',
        src: 'https://videos.pexels.com/video-files/854996/854996-hd_1920_1080_25fps.mp4',
        poster: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
];

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

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="nav-left">
          <div className="logo">NETFLIX</div>
          <nav className="main-nav">
            <a href="#">Home</a>
            <a href="#">TV Shows</a>
            <a href="#">Movies</a>
            <a href="#">My List</a>
          </nav>
        </div>

        <div className="nav-right">
          <span>Search</span>
          <span>Kids</span>
          <span>Bell</span>
          <div className="profile-pill">A</div>
        </div>
      </header>

      <section className="hero-section">
        <video
          className="hero-video"
          src={heroVideo.src}
          poster={heroVideo.poster}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="hero-content">
          <p className="hero-tag">Trending Now</p>
          <h1>{heroVideo.title}</h1>
          <p className="hero-description">
            When a young boy vanishes, a small town uncovers a mystery involving secret experiments,
            terrifying supernatural forces, and one very unusual girl.
          </p>

          <div className="hero-actions">
            <button className="play-btn">▶ Play</button>
            <button className="info-btn">ⓘ More Info</button>
          </div>
        </div>
      </section>

      <main className="content-section">
        {trailerRows.map((row) => (
          <div key={row.title} className="row">
            <h2>{row.title}</h2>
            <div className="movie-row">
              {row.items.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <video
                    className="movie-video"
                    src={movie.src}
                    poster={movie.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="movie-info">
                    <span>{movie.title}</span>
                    <span className="movie-duration">{movie.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
