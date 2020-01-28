const { ApolloServer } = require('apollo-server');
const { parse } = require('graphql');
const { readFileSync } = require('fs');
const { findById } = require('./utils');
const { Dealerships, Sites, Units, WorkOrders, Listings } = require('./data');

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
        owner: parent => {
            const site = Sites.find(s => s.private && parent.owner === s.id);
            if (site) {
                return { ...site, $type: "PrivateSite" };
            }
            const dealership = findById(Dealerships, parent.owner);
            return { ...dealership, $type: "Dealership" };
        }
    },
    Listing: {
        workOrder: (parent) => findById(WorkOrders, parent.workOrder),
        site: parent => findById(Sites, parent.site),
    },
    Unit: {
        activeWorkOrder: (parent) => WorkOrders.find(w =>
            w.unit === parent.id && w.status !== "Inactive",
        ),
    },
    Site: {
        __resolveType: (site) => {
            return site.private ? "PrivateSite" : "OpenSite";
        }
    },
    Owner: {
        __resolveType: (owner) => owner.$type,
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.info(`Server listening at ${url}`)
})