const { ApolloServer } = require('apollo-server');
const { parse } = require('graphql');
const { readFileSync } = require('fs');
const { findById } = require('./utils');
const { Units, WorkOrders, Listings } = require('./data');

const typeDefs = parse(readFileSync('./schema.graphql', 'UTF-8'));

const resolvers = {
    Query: {
        workOrder: (_, args) => findById(WorkOrders, args.id),
        listing: (_, args) => findById(Listings, args.id),
    },
    WorkOrder: {
        unit: (parent) => findById(Units, parent.unit),
        activeListing: (parent) => Listings.find(l =>
            l.workOrder === parent.id &&
            l.status !== "Removed" &&
            l.status !== "Cancelled" &&
            l.status !== "NotSold"
        ),
    },
    Listing: {
        workOrder: (parent) => findById(WorkOrders, parent.workOrder),
    },
    Unit: {
        activeWorkOrder: (parent) => WorkOrders.find(w =>
            w.unit === parent.id && w.status !== "Inactive",
        ),
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.info(`Server listening at ${url}`)
})