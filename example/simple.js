const schema = require('./../index');
var s = schema.createTableIfNotExist('post', {
    comment: 'this is post table'
});
s.add('enabled').type(schema.type.TINYINT, 4).notNull().default(1);
s.add('title').type(schema.type.VARCHAR, 60).notNull();
s.add('type').type(schema.type.VARCHAR, 60).notNull().default('post');
s.add('permalink').type(schema.type.VARCHAR, 120).notNull().unique();
s.add('enum').type(schema.type.ENUM, ['Y', 'N']).notNull();

console.log('MYSQL', s.toString());
