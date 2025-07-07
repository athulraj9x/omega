const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); 

let mongoServer;
let connection;

module.exports.connect = async () => {
    if (!connection) {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        connection = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
        });
    }
    return connection;
};

module.exports.closeDatabase = async () => {
    if (connection) {
        await mongoose.disconnect();
        await mongoServer.stop();
        connection = null;
    }
};

module.exports.clearDatabase = async () => {
    if (connection) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
        }
    }
};