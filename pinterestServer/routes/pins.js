import express from 'express';
import * as dbFunctions from '../../pinterestDatabase/database.js';

const router = express.Router();

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

// POST create new pin
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, mediaUrl, mediaType } = req.body;
    const pinId = await dbFunctions.createPin(userId, title, description, mediaUrl, mediaType);
    res.status(201).json({ pinId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create pin', error: error.message });
  }
});

// GET pins by board id
router.get('/board/:boardId', async (req, res) => {
  try {
    const pins = await dbFunctions.getPinsByBoardId(req.params.boardId);
      res.json(pins);
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