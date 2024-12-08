const { initDb } = require("../src/db");
const { createUsers, clearDatabase } = require("./utils/db");


module.exports = async () => {
    console.log("Setting up test environment...");
    await initDb();
    await clearDatabase();
    await createUsers();
    console.log("Test environment set up successfully.");
};
