const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/User");

module.exports = {
  Query: {
    login: async (_, { email, password }) => {
      const user = await getUserByEmail(email);
      if (!user) throw new Error("User not found");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Invalid credentials");

      if (user.role !== "admin") throw new Error("You are not allowed to login from here");

      const token = jwt.sign({ userId: user.id, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });

      return { token, user };
    },
  },
  Mutation: {
    register: async (_, { firstName, lastName, email, password, role }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await createUser(firstName, lastName, email, hashedPassword, role);
      return "User registered successfully! Please verify your email.";
    },
  },
};
