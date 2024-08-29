import express from 'express';
import * as dbFunctions from '../../pinterestDatabase/database.js';

const router = express.Router();

// GET boards by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const boards = await dbFunctions.getBoardsByUserId(req.params.userId);
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get boards', error: error.message });
  }
});

// POST create new board
router.post('/user/:userId', async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = await dbFunctions.createBoard(req.params.userId, title);
    res.status(201).json({ boardId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create board', error: error.message });
  }
});

// POST add pin to board
router.post('/:boardId', async (req, res) => {
  try {
    const  pinId = req.body;
    await dbFunctions.addPinToBoard(req.params.boardId, pinId);
    res.json({ message: 'Pin added to board successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add pin to board', error: error.message });
  }
});

// DELETE remove pin from board
router.delete('/:boardId/pins/:pinId', async (req, res) => {
  try {
    await dbFunctions.removePinFromBoard(req.params.boardId, req.params.pinId);
    res.json({ message: 'Pin removed from board successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove pin from board', error: error.message });
  }
});

export default router;