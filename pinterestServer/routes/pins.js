import express from 'express';
import multer from 'multer';
import path from 'node:path';
import * as dbFunctions from '../../pinterestDatabase/database.js';


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// GET pins
router.get('/', async (req, res) => {
    try {
      const pins = await dbFunctions.getPins();
        res.json(pins);
      }
     catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// GET pin by ID
router.get('/:id', async (req, res) => {
  try {
    const pin = await dbFunctions.getPinById(req.params.id);
    if (pin) {
      res.json(pin);
    } else {
      res.status(404).json({ message: 'Pin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET pin likes
router.get('/:id/likes', async (req, res) => {
  try {
    const count = await dbFunctions.getLikesCountForPin(req.params.id);
    console.log(count);
    res.status(202).json(count);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET pin liked by user
router.get('/:pinId/like/user/:userId', async (req, res) => {
  try {
    const count = await dbFunctions.getIsLikedByUser(req.params.userId, req.params.pinId);
    res.status(200).json(count);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST pin like
router.post('/:pinId/like/user/:userId', async (req, res) => {
  try {
    await dbFunctions.addLike(req.params.userId, req.params.pinId);
    res.status(200).json("like added successfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE pin like
router.delete('/:pinId/like/user/:userId', async (req, res) => {
  try {
    await dbFunctions.removeLike(req.params.userId, req.params.pinId);
    res.status(200).json("like removed successfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create new pin
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('file not found');
  }
  console.log(req.file);
  const filePath = req.file.path;
  const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';

  try {
    const {  title, description} = req.body;
    const pinId = await dbFunctions.createPin(2, title, description, filePath, fileType);
    res.status(201).json({ pinId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create pin', error: error.message });
  }
});

// GET pins by board id
router.get('/board/:boardId', async (req, res) => {
  try {
    const pins = await dbFunctions.getPinsByBoardId(req.params.boardId);
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update pin
router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    await dbFunctions.updatePin(req.params.id, title, description);
    res.json({ message: 'Pin updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update pin', error: error.message });
  }
});

// DELETE pin
router.delete('/:id', async (req, res) => {
  try {
    await dbFunctions.deletePin(req.params.id);
    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete pin', error: error.message });
  }
});

// GET search pins
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const pins = await dbFunctions.searchPins(query);
    res.json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search pins', error: error.message });
  }
});

export default router;