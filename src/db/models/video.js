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
        uploaded_at: {
            type: 'datetime',
            default: () => 'CURRENT_TIMESTAMP',
        },
        user: {
            type: 'int',
            nullable: false,
            foreignKey: {
                name: 'id',
                entity: 'users',
                onDelete: 'CASCADE',
            }
        }
    },
});
