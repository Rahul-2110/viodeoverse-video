const { appDataSource } = require("../../src/db");

const clearDatabase = async () => {
    const entities = appDataSource.entityMetadatas;

    for (const entity of entities) {
        const repository = appDataSource.getRepository(entity.name);

        await repository.query(
            `DELETE FROM ${entity.tableName};`,
        );
    }
};


module.exports = { clearDatabase };