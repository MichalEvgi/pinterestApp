import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// קריאת פרטי החיבור מקובץ .env
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

async function createTables() {
  try {
    // connect to the database
    const connection = await mysql.createConnection(dbConfig);

    // create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('viewer', 'creator') DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // create pins table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        media_url VARCHAR(255) NOT NULL,
        media_type ENUM('image', 'video') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // create boards table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS boards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // connect table between boards and pins
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS board_pins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        board_id INT NOT NULL,
        pin_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
        FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE,
        UNIQUE KEY unique_board_pin (board_id, pin_id)
      )
    `);

    // create likes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        pin_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_pin_like (user_id, pin_id)
      )
    `);

    // Create comments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        pin_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE
      )
    `);

    console.log('tables created successfuly!');

    await connection.end();

  } catch (error) {
    console.error('error when creating the tables:', error);
  }
}

createTables();