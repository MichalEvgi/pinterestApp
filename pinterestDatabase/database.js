import pool from './dbconnection.js';

// users functions
export async function createUser(username, email, password, role = 'viewer') {
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, password, role]
  );
  return result.insertId;
}

export async function getUserById(userId) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

export async function getUserByNameAndPassword(username, password) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  return rows[0];
}

export async function updateUserRole(userId, newRole) {
  await pool.execute('UPDATE users SET role = ? WHERE id = ?', [newRole, userId]);
}

// pins functions
export async function createPin(userId, title, description, mediaUrl, mediaType) {
  const [result] = await pool.execute(
    'INSERT INTO pins (user_id, title, description, media_url, media_type) VALUES (?, ?, ?, ?, ?)',
    [userId, title, description, mediaUrl, mediaType]
  );
  return result.insertId;
}
export async function getPins() {
    const [rows] = await pool.execute('SELECT * FROM pins');
    return rows;
  }
export async function getPinById(pinId) {
  const [rows] = await pool.execute('SELECT * FROM pins WHERE id = ?', [pinId]);
  return rows[0];
} 
export async function getPinsByBoardId(boardId) {
  const [rows] = await pool.execute(`SELECT p.id as id, user_id, title, description, media_url, media_type, created_at 
    FROM pins p JOIN boards_pins b ON b.pin_id = p.id 
    WHERE board_id = ?`, [boardId]);
  return rows;
} 
export async function updatePin(pinId, title, description) {
  await pool.execute('UPDATE pins SET title = ?, description = ? WHERE id = ?', [title, description, pinId]);
}

export async function deletePin(pinId) {
  await pool.execute('DELETE FROM pins WHERE id = ?', [pinId]);
}

// boards functions
export async function createBoard(userId, title) {
  const [result] = await pool.execute('INSERT INTO boards (user_id, title) VALUES (?, ?)', [userId, title]);
  return result.insertId;
}

export async function getBoardsByUserId(userId) {
  const [rows] = await pool.execute('SELECT * FROM boards WHERE user_id = ?', [userId]);
  return rows;
}

export async function addPinToBoard(boardId, pinId) {
  await pool.execute('INSERT INTO board_pins (board_id, pin_id) VALUES (?, ?)', [boardId, pinId]);
}

export async function removePinFromBoard(boardId, pinId) {
  await pool.execute('DELETE FROM board_pins WHERE board_id = ? AND pin_id = ?', [boardId, pinId]);
}

// likes functions
export async function addLike(userId, pinId) {
  await pool.execute('INSERT INTO likes (user_id, pin_id) VALUES (?, ?)', [userId, pinId]);
}

export async function removeLike(userId, pinId) {
  await pool.execute('DELETE FROM likes WHERE user_id = ? AND pin_id = ?', [userId, pinId]);
}

export async function getLikesCountForPin(pinId) {
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM likes WHERE pin_id = ?', [pinId]);
  return rows[0].count;
}

// comments functions
export async function addComment(userId, pinId, content) {
  const [result] = await pool.execute(
    'INSERT INTO comments (user_id, pin_id, content) VALUES (?, ?, ?)',
    [userId, pinId, content]
  );
  return result.insertId;
}

export async function getCommentsForPin(pinId) {
  const [rows] = await pool.execute('SELECT * FROM comments WHERE pin_id = ? ORDER BY created_at DESC', [pinId]);
  return rows;
}

// search
export async function searchPins(query) {
  const [rows] = await pool.execute(
    'SELECT * FROM pins WHERE title LIKE ? OR description LIKE ?',
    [`%${query}%`, `%${query}%`]
  );
  return rows;
}