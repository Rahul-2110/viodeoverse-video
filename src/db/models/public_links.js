const { EntitySchema } = require('typeorm');


const generateSlug = ()=>{
    return Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(6, 8);
}

module.exports = new EntitySchema({
    name: 'PublicLinks',
    tableName: 'public_links',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        video: {
            type: 'int',
            nullable: false,
            foreignKey: {
                name: 'id',
                entity: 'videos',
                onDelete: 'CASCADE',
            }
        },
        slug: {
            type: 'text',
            nullable: false,
            unique: true,
        },
        expire_at: {
            type: 'datetime',
            nullable: false,
        },
        created_at: {
            type: 'datetime',
            default: () => 'CURRENT_TIMESTAMP',
        },
    }
});


module.exports.generateSlug = generateSlug