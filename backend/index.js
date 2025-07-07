const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const http = require("http");
const cors = require("cors");
const path = require('path');

const createApp = () => {
    require('dotenv').config();

    const app = express();
    const server = http.createServer(app);
    const port = process.env.PORT || 8080;

    // import i18n
    const i18n = require("./src/i18n/i18n");

    // Middleware setup
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
    app.use(i18n);

    // CORS setup
    app.use(
        cors({
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        })
    );
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
    });

    // Database connection (but don't connect immediately)
    const { connect } = require("./src/config/dbConnection");

    // Socket.io setup
    const { createSocketServer } = require("./src/socket/index");
    const io = createSocketServer(server);

    // Routes
    const indexRoute = require("./src/routes");
    app.use("/", indexRoute);

    // Static files
    app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads'), {
        setHeaders: (res, path, stat) => {
            res.set('Access-Control-Allow-Origin', '*');
        }
    }));

    return {
        app,
        server,
        connectDB: connect,
        start: () => {
            return new Promise((resolve) => {
                server.listen(port, () => {
                    console.log(`Server running on port ${port}`);
                    resolve(server);
                });
            });
        },
        stop: () => {
            return new Promise((resolve) => {
                server.close(() => {
                    console.log('Server stopped');
                    resolve();
                });
            });
        }
    };
};

if (require.main === module) {
    const { start, connectDB } = createApp();
    connectDB();
    start();
}

module.exports = createApp;