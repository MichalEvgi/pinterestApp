import express from 'express';
import * as dbFunctions from '../../pinterestDatabase/database.js';

const router = express.Router();

// GET user by ID
router.get('/byId/:id', async (req, res) => {
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
    const { username, password } = req.query;
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
    let convertedrole = converFromRole(role);
    const userId = await dbFunctions.createUser(username, email, password, convertedrole);
    const user = await dbFunctions.getUserById(userId);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// PUT update user role
router.put('/:id/role', async (req, res) => {
  try {
    let { role } = req.body;
    role = converFromRole(role);
    await dbFunctions.updateUserRole(req.params.id, role);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
});

const roleConverter= (role)=>{
  switch (role) {
    case 'viewer': return 'whatcher'; break;
    case 'creator': return 'creator'; break;
    default:
      return 'Unknown';
  }
}

const converFromRole = (role)=>{
  switch (role) {
    case 'whatcher': return 1; break;
    case 'creator': return 2; break;
    default:
      return 0;
  }
}

export default router;