const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register a new user with email/password (always created as 'tenant')
const registerUser = async (req, res) => {
  try {
    const { name, email, password, photo } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).send({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      photo: photo || undefined,
      role: 'tenant',
      provider: 'password',
    });

    res.status(201).send({
      message: 'User registered successfully',
      user: { name: user.name, email: user.email, role: user.role, photo: user.photo },
    });
  } catch (error) {
    res.status(500).send({ message: 'Registration failed', error: error.message });
  }
};

// Validates email/password and returns user info (token is requested separately via /jwt)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.provider !== 'password') {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    res.send({
      message: 'Login successful',
      user: { name: user.name, email: user.email, role: user.role, photo: user.photo },
    });
  } catch (error) {
    res.status(500).send({ message: 'Login failed', error: error.message });
  }
};

// Called after successful Firebase login (email/pass or Google) to mint our own API JWT.
// If the user does not exist yet (first Google login) it is created with role 'tenant'.
const issueToken = async (req, res) => {
  try {
    const { email, name, photo } = req.body;
    if (!email) return res.status(400).send({ message: 'Email is required' });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || 'New User',
        email,
        photo,
        role: 'tenant',
        provider: 'google',
      });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '7d',
    });

    res.send({ token, user: { name: user.name, email: user.email, role: user.role, photo: user.photo } });
  } catch (error) {
    res.status(500).send({ message: 'Could not issue token', error: error.message });
  }
};

module.exports = { registerUser, loginUser, issueToken };
