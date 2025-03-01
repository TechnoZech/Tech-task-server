const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    login(email: String!, password: String!): AuthPayload
  }

  type Mutation {
    register(firstName: String!, lastName: String!, email: String!, password: String!, role: String!): String
  }
`);
