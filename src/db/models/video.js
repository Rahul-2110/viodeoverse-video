const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Video',
    tableName: 'videos',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'text',
            nullable: false,
        },
        size: {
            type: 'float',
            nullable: false,
        },
        duration: {
            type: 'int',
            nullable: false,
        },
        path: {
            type: 'text',
            nullable: false,
        },
        uploadedAt: {
            type: 'datetime',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
});
