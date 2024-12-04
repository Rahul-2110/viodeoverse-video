const convict = require("convict");

const config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV",
    },
    db: {
        path: {
            doc: "Database path",
            format: String,
            default: "./db.sqlite",
            env: "DB_PATH",
        }
    },
    port: {
        doc: "Port number",
        format: Number,
        default: 3000,
        env: "PORT",
    },
});

// Perform validation
config.validate({ allowed: "strict" });

module.exports = { config };
