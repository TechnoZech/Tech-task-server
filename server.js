const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/graphql", graphqlHTTP({ schema, rootValue: resolvers, graphiql: true }));

app.listen(8080, () => console.log("Server running on port 8080"));
