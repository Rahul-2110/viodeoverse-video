const { appDataSource } = require("../../src/db");
const { UserTable } = require("../../src/db/tables");

const clearDatabase = async () => {
    const entities = appDataSource.entityMetadatas;

    for (const entity of entities) {
        const repository = appDataSource.getRepository(entity.name);

        await repository.query(
            `DELETE FROM ${entity.tableName};`,
        );
    }
};

const users = [
    {
        username: 'testUser1',
        token: 'testToken',
    },
    {
        username: 'testUser2',
        token: 'testToken2',
    },
    {
        username: 'testUser3',
        token: 'testToken3',
    },
];  


const createUsers = async () => {
   
    let userPromises = [];
    users.forEach((user) => {
        userPromises.push(UserTable.save(user)); 
    });
    let userRecords = await Promise.all(userPromises);
    return userRecords;
};


module.exports = { clearDatabase, createUsers, users };