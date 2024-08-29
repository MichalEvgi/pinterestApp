import express from 'express';
import * as dbFunctions from '../../pinterestDatabase/database.js';

const router = express.Router();

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await dbFunctions.getUserById(req.params.id);
    if (user) {
      user.role = roleConverter(user.role);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error.stack);  
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET user by name and password
router.get('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await dbFunctions.getUserByNameAndPassword(username, password);
    if (user) {
      user.role = roleConverter(user.role);
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
    switch (role) {
      case 'whatcher': role = 1; break;
      case 'creator': role = 2; break;
      case 'manager': role = 3; break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }
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
    switch (role) {
      case 'whatcher': role = 1; break;
      case 'creator': role = 2; break;
      case 'manager': role = 3; break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }
    await dbFunctions.updateUserRole(req.params.id, role);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
});

const roleConverter= (role)=>{
  switch (role) {
    case 1: return 'whatcher'; break;
    case 2: return 'creator'; break;
    case 3: return'manager'; break;
    default:
      return 'Unknown';
  }
}

export default router;