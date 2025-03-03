const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLBoolean } = require('graphql');
const db = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../config/mailer');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        role: { type: GraphQLString },
        isVerified: { type: GraphQLBoolean }
    })
});

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        registerUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                role: { type: GraphQLString }
            },
            resolve: async (_, { firstName, lastName, email, password, role }) => {
                const hashedPassword = await bcrypt.hash(password, 10);
                const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

                const sql = "INSERT INTO users (firstName, lastName, email, password, role, verificationToken) VALUES (?, ?, ?, ?, ?, ?)";
                db.query(sql, [firstName, lastName, email, hashedPassword, role, verificationToken]);

                sendVerificationEmail(email, verificationToken);
                return { firstName, lastName, email, role, isVerified: false };
            }
        },
        verifyEmail: {
            type: GraphQLBoolean,
            args: { token: { type: GraphQLString } },
            resolve: async (_, { token }) => {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const sql = "UPDATE users SET isVerified = true WHERE email = ?";
                db.query(sql, [decoded.email]);
                return true;
            }
        }
    }
});

module.exports = new GraphQLSchema({ mutation: RootMutation });
