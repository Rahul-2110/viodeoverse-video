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
    video:{
        max_size_mb: {
            doc: "Maximum size of video in MB",
            format: Number,
            default: 25,
            env: "MAX_SIZE_MB",
        },
        min_duration_sec: {
            doc: "Minimum duration of video in seconds",
            format: Number,
            default: 1,
            env: "MIN_DURATION_SEC",
        },
        max_duration_sec: {
            doc: "Maximum duration of video in seconds",
            format: Number,
            default: 25,
            env: "MAX_DURATION_SEC",
        },
        upload_dir: {
            doc: "Upload directory",
            format: String,
            default: "../../uploads",
            env: "UPLOAD_DIR",
        }
    }
});

// Perform validation
config.validate({ allowed: "strict" });

module.exports = { config };
