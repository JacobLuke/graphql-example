function findById(collection, id) {
    const matches = collection.filter(element => element.id === id);
    if (matches.length === 0) {
        throw new Error(`Element for ID not found ${id}`);
    }
    if (matches.length > 1) {
        throw new Error(`Duplicate ID ${id}`);
    }
    return matches[0];
}

module.exports = {
    findById,
}