import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
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
        res.status(200).json(pins);
      }
     catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // GET pins with start and offset
router.get('/start=:start&offset=:offset', async (req, res) => {
  try {
      const { start, offset } = req.params;
      const pins = await dbFunctions.getPinsWithOffset(start, offset);
      res.status(200).json(pins);
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
      res.status(200).json(pin);
    } else {
      res.status(404).json({ message: 'Pin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//GET pin by user id
router.get('/user/:userId', async (req, res) => {
  try {
    const pins = await dbFunctions.getPinsByUserId(req.params.userId);
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET pin likes
router.get('/:id/likes', async (req, res) => {
  try {
    const count = await dbFunctions.getLikesCountForPin(req.params.id);
    console.log(count);
    res.status(200).json(count);
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
    res.status(201).json("like added successfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE pin like
router.delete('/:pinId/like/user/:userId', async (req, res) => {
  try {
    await dbFunctions.removeLike(req.params.userId, req.params.pinId);
    res.status(201).json("like removed successfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create new pin
router.post('/', upload.single('file'), async (req, res) => {
  const { username, password } = req.body;
  if (!username ||!password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }
  const user = await dbFunctions.getUserByNameAndPassword(username, password);
  if(!user || user.role != "creator"){
    return res.status(401).json({ message: 'Unauthorized user' });
  }
  if (!req.file) {
    return res.status(400).send('file not found');
  }
  const filePath = req.file.path;
  const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';

  try {
    const {  title, description} = req.body;
    const pinId = await dbFunctions.createPin(user.id, title, description, filePath, fileType);
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
  const { username, password } = req.body;
  if (!username ||!password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }
  const user = await dbFunctions.getUserByNameAndPassword(username, password);
  if(!user || user.role != "creator"){
    return res.status(401).json({ message: 'Unauthorized user' });
  }
  try {
    const { title, description } = req.body;
    await dbFunctions.updatePin(req.params.id, title, description);
    res.status(201).json({ message: 'Pin updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update pin', error: error.message });
  }
});

// DELETE pin
router.delete('/:id', async (req, res) => {
  const { username, password } = req.body;
  if (!username ||!password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }
  const user = await dbFunctions.getUserByNameAndPassword(username, password);
  if(!user || user.role != "creator"){
    return res.status(401).json({ message: 'Unauthorized user' });
  }
  try {
    const pin = await dbFunctions.getPinById(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }
    try {
      await fs.unlink(pin.media_url);
      console.log(`the file ${pin.media_url} deleted successfully`);
    } catch (fileError) {
      console.error(`error deleting file: ${pin.media_url}:`, fileError);
    }
    await dbFunctions.deletePin(req.params.id);
    res.status(201).json({ message: 'Pin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete pin', error: error.message });
  }
});

// GET comments for pin
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await dbFunctions.getCommentsForPin(req.params.id);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST comment for pin
router.post('/:id/comment', async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const commentId = await dbFunctions.addComment(req.params.id, user_id, content);
    const comment = await dbFunctions.getCommentById(commentId);
    const user = await dbFunctions.getUserById(user_id);
    comment.username = user.username;
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
});

// GET search pins
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const pins = await dbFunctions.searchPins(query);
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search pins', error: error.message });
  }
});

export default router;