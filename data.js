const Sites = [
    {
        id: "P1",
        displayName: "FCA",
        private: true,
    },
    {
        id: "P2",
        displayName: "BMW",
        private: true,
    },
    {
        id: "O1",
        private: false,
    },
];

const Dealerships = [
    {
        id: "D1",
        name: "Ontario Chrysler Jeep Dodge",
    },
    {
        id: "D2",
        name: "Khallil's Cars",
    }
];

const Units = [
    {
        id: "U1",
        year: "2008",
        make: "Toyota",
        model: "Tercel",
    },
    {
        id: "U2",
        year: "2020",
        make: "Honda",
        model: "Fit",
    },
    {
        id: "U3",
        year: "2018",
        make: "Tesla",
        model: "Roadster",
        trim: "basic",
    },
];

const WorkOrders = [
    {
        id: "W1",
        unit: "U1",
        owner: "D1",
        status: "EnteredIntoAuction",
        imageURLs: ["https://example.com/?jpg"],
    },
    {
        id: "W2",
        unit: "U1",
        owner: "P1",
        status: "Inactive",
        imageURLs: [],
    },
    {
        id: "W3",
        unit: "U2",
        owner: "P2",
        status: "EnteredIntoAuction",
        imageURLs: ["https://example.com/?jpg"],
    },
    {
        id: "W4",
        unit: "U3",
        owner: "D2",
        status: "SoldAwaitingInvoicing",
        imageURLs: [],
    }
];

const Listings = [
    {
        id: "L1",
        workOrder: "W1",
        site: "P1",
        status: "NoSale",
        scheduledStart: "2020-01-20 00:30:00",
        scheduledEnd: "2020-01-25 00:30:00",
    },
    {
        id: "L2",
        workOrder: "W1",
        site: "O1",
        status: "Allocated",
        scheduledStart: "2020-02-20 00:30:00",
        scheduledEnd: "2020-02-25 00:30:00",
    },
    {
        id: "L3",
        workOrder: "W3",
        site: "P2",
        status: "Live",
        scheduledStart: "2020-01-01 00:00:00",
        scheduledEnd: "2020-12-31 23:59:59",
    },
    {
        id: "L4",
        workOrder: "W4",
        status: "Sold",
        site: "O1",
        scheduledStart: "2020-01-01 00:00:00",
        scheduledEnd: "2020-12-31 23:59:59",
    }
];

module.exports = {
    Dealerships,
    Sites,
    Units,
    WorkOrders,
    Listings,
}