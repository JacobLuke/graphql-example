const { ApolloServer } = require('apollo-server');
const { parse } = require('graphql');
const { readFileSync } = require('fs');
const { findById } = require('./utils');
const { Units, WorkOrders, Listings } = require('./data');

const typeDefs = parse(readFileSync('./schema.graphql', 'UTF-8'));

// TODO
const resolvers = {
    Query: {
        workOrder: (_, args) => findById(WorkOrders, args.id),
        listing: (_, args) => findById(Listings, args.id),
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.info(`Server listening at ${url}`)
})