const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Multer Config ─────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const allowedTypes = /pdf|doc|docx|png|jpg|jpeg|gif|txt/;
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Only PDF, Word, images, and text files are allowed'));
  },
});

// ── Auth Middleware ───────────────────────────────────────────
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ── AUTH ROUTES ───────────────────────────────────────────────

app.post('/api/auth/signup', async (req, res) => {
  const { username, phone, password } = req.body;
  if (!username || !phone || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername)
      return res.status(400).json({ error: 'Username already taken' });

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone)
      return res.status(400).json({ error: 'Phone number already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, phone, password: hashedPassword }
    });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, phone: user.phone } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { phone: username.trim() }
        ]
      }
    });

    if (!user)
      return res.status(400).json({ error: 'Invalid username/phone or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: 'Invalid username/phone or password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, phone: user.phone } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, phone: true }
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// ── ORDER ROUTES ──────────────────────────────────────────────

app.post('/api/orders', authenticate, async (req, res) => {
  const { title, subject, pages, deadline, instructions } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        title, subject,
        pages: Number(pages),
        deadline: new Date(deadline),
        instructions,
        cost: Number(pages) * 10
      }
    });
    res.json({ data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ── FILE ROUTES ───────────────────────────────────────────────

// Upload a file
app.post('/api/files/upload', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const file = await prisma.file.create({
      data: {
        userId: req.user.id,
        originalName: req.file.originalname,
        filepath: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
        status: 'Pending',
      }
    });
    res.json({ data: file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save file info' });
  }
});

// Get all files for the logged-in user
app.get('/api/files', authenticate, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Update file status (admin / internal use)
app.patch('/api/files/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Printing', 'Out for Delivery', 'Delivered'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ error: 'Invalid status value' });

  try {
    const file = await prisma.file.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ data: file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
