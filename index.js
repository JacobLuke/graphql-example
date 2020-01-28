const { ApolloServer } = require('apollo-server');
const { parse, GraphQLScalarType, Kind } = require('graphql');
const { readFileSync } = require('fs');
const { findById } = require('./utils');
const { Dealerships, Sites, Units, WorkOrders, Listings } = require('./data');

const typeDefs = parse(readFileSync('./schema.graphql', 'UTF-8'));

const resolvers = {
    ListingQuery: {
        id: (_, args) => findById(Listings, args.id),
        search: (_, args) => Listings.filter(l => !args.statuses || args.statuses.includes(l.status)),
    },
    ListingMutation: {
        create: (_, args) => {
            const workOrder = findById(WorkOrders, args.workOrder);
            if (!workOrder || workOrder.status !== "AwaitingAllocation" || !findById(Sites, args.site)) {
                throw new TypeError("Invalid Parameters");
            }
            workOrder.status = "EnteredIntoAuction";
            const listing = {
                id: `L${Listings.length + 1}`,
                workOrder: args.workOrder,
                site: args.site,
                scheduledStart: args.active.start,
                scheduledEnd: args.active.end,
                // TODO: determine based on start and end
                status: "Allocated",
            }
            Listings.push(listing);
            return listing;
        }
    },
    WorkOrderQuery: {
        id: (_, args) => findById(WorkOrders, args.id),
        search: (_, args) => args.showInactive ? WorkOrders : WorkOrders.filter(wo => wo.status !== "Inactive"),
    },
    Query: {
        workOrder: () => ({}),
        listing: () => ({})
    },
    Mutation: {
        listing: () => ({}),
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
    },
    ID: new GraphQLScalarType({
        name: 'ID',
        parseValue(value) {
            if (typeof value !== 'string') {
                throw new TypeError('Invalid type for ID');
            }
            if (!/[A-Z]\d+/.test(value)) {
                throw new Error('Invalid format for ID');
            }
            return value;
        },
        serialize(value) {
            return value;
        },
        parseLiteral(ast) {
            if (ast.kind !== Kind.STRING) {
                throw new TypeError('Invalid type for ID');
            }
            if (!/[A-Z]\d+/.test(ast.value)) {
                throw new Error('Invalid format for ID');
            }
            return ast.value;
        }
    }),
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.info(`Server listening at ${url}`)
})