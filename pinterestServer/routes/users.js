import express from 'express';
import * as dbFunctions from '../../pinterestDatabase/database.js';

const router = express.Router();

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    //todo by name and password
    const user = await dbFunctions.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error.stack);  
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const userId = await dbFunctions.createUser(username, email, password, role);
    const user = await dbFunctions.getUserById(userId);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// PUT update user role
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    await dbFunctions.updateUserRole(req.params.id, role);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
});

export default router;