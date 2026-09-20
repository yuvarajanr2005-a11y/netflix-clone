const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

const mockUser = {
  email: 'admin@netflix.com',
  password: 'password123',
};

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.',
    });
  }

  if (
    email.trim().toLowerCase() !== mockUser.email ||
    password !== mockUser.password
  ) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    });
  }

  return res.status(200).json({
    message: 'Login successful',
    user: {
      email: mockUser.email,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
