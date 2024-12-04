const { EntitySchema } = require('typeorm');


class User {
    constructor(username) {
        this.username = username;
        this.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}


module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        username: {
            type: 'text',
            nullable: false,
            unique: true,
        },
        token: {
            type: 'varchar',
            nullable: false,
        },
    }
});

module.exports.User = User;


