import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// Demo-only credentials — replace this mock with a database/auth provider in production.
const demoUser = {
  email: 'demo@streamline.com',
  password: 'stream123',
  name: 'Alex',
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  if (email.trim().toLowerCase() !== demoUser.email || password !== demoUser.password) {
    return res.status(401).json({ message: 'That email or password does not match our records.' })
  }

  return res.status(200).json({
    message: 'Welcome back!',
    user: { name: demoUser.name, email: demoUser.email },
    token: 'demo-session-token',
  })
})

const fallbackTamilSeries = [
  { id: 'suzhal', name: 'Suzhal: The Vortex', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80', genres: ['Crime', 'Thriller'], rating: 8.2, year: 2022 },
  { id: 'village', name: 'The Village', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=80', genres: ['Horror', 'Drama'], rating: 6.8, year: 2023 },
  { id: 'ayali', name: 'Ayali', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=700&q=80', genres: ['Drama'], rating: 8.1, year: 2023 },
  { id: 'vadhandhi', name: 'Vadhandhi', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80', genres: ['Mystery', 'Crime'], rating: 7.9, year: 2022 },
  { id: 'time', name: 'Time Enna Boss!?', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7452?auto=format&fit=crop&w=700&q=80', genres: ['Comedy', 'Sci-Fi'], rating: 7.2, year: 2020 },
  { id: 'mansion', name: 'Mansion 24', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80', genres: ['Horror', 'Mystery'], rating: 7.1, year: 2023 },
]

const fallbackTamilMovies = [
  { id: 'm1', title: 'Vikram', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80', year: 2022, genre: 'Action | Thriller', rating: 'U/A', description: 'A high-octane Tamil action thriller about a black-ops squad on a dangerous mission.' },
  { id: 'm2', title: 'Jai Bhim', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80', year: 2021, genre: 'Drama | Courtroom', rating: 'U/A', description: 'A moving Tamil legal drama inspired by the fight for justice.' },
  { id: 'm3', title: '96', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=80', year: 2018, genre: 'Romance | Drama', rating: 'U', description: 'Two school sweethearts meet again after years apart in this beloved Tamil romance.' },
  { id: 'm4', title: 'Soorarai Pottru', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80', year: 2020, genre: 'Drama | Inspiring', rating: 'U', description: 'An ambitious dreamer takes flight against all odds in this Tamil drama.' },
  { id: 'm5', title: 'Kaithi', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80', year: 2019, genre: 'Action | Thriller', rating: 'U/A', description: 'A former prisoner races through one unforgettable night to reach his daughter.' },
  { id: 'm6', title: 'Kadaisi Vivasayi', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80', year: 2021, genre: 'Drama | Rural', rating: 'U', description: 'A warm, human story about a farmer and a village at a crossroads.' },
]

// Uses TVMaze's public search API; fallback keeps the catalogue available offline.
app.get('/api/tamil-series', async (_req, res) => {
  try {
    const response = await fetch('https://api.tvmaze.com/search/shows?q=tamil')
    if (!response.ok) throw new Error('TVMaze request failed')
    const results = await response.json()
    const shows = results.map(({ show }) => ({
      id: show.id, name: show.name, image: show.image?.original || show.image?.medium,
      genres: show.genres?.length ? show.genres : ['Tamil series'],
      rating: show.rating?.average || 'New', year: show.premiered ? new Date(show.premiered).getFullYear() : 'New',
    })).filter((show) => show.image)
    res.json({ source: 'TVMaze', shows: shows.length ? shows : fallbackTamilSeries })
  } catch {
    res.json({ source: 'Streamline collection', shows: fallbackTamilSeries })
  }
})

app.get('/api/tamil-movies', async (_req, res) => {
  try {
    const response = await fetch('https://itunes.apple.com/search?term=tamil+movies&entity=movie&limit=24&country=IN')
    if (!response.ok) throw new Error('iTunes request failed')
    const data = await response.json()
    const movies = data.results.filter((movie) => movie.artworkUrl100).map((movie) => ({
      id: movie.trackId,
      title: movie.trackName,
      image: movie.artworkUrl100.replace('100x100bb', '600x600bb'),
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'New',
      genre: movie.primaryGenreName || 'Tamil cinema',
      rating: movie.contentAdvisoryRating || 'U/A',
      description: movie.longDescription || movie.shortDescription || 'A Tamil cinema experience curated for Streamline.',
    }))
    res.json({ source: movies.length ? 'iTunes' : 'Streamline Tamil collection', movies: movies.length ? movies : fallbackTamilMovies })
  } catch {
    res.json({ source: 'Streamline Tamil collection', movies: fallbackTamilMovies })
  }
})

app.listen(PORT, () => console.log(`API ready at http://localhost:${PORT}`))
