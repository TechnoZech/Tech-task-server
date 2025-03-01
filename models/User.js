const db = require("../config/db");

const createUser = async (firstName, lastName, email, password, role) => {
  return db.execute(
    "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, email, password, role]
  );
};

const getUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

module.exports = { createUser, getUserByEmail };
