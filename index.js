const { ApolloServer } = require('apollo-server');
const { parse } = require('graphql');
const { readFileSync } = require('fs');

const typeDefs = parse(readFileSync('./schema.graphql', 'UTF-8'));

// TODO
const resolvers = {};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.info(`Server listening at ${url}`)
})