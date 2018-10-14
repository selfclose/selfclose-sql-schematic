const schema = require('./../index');
var s = schema.createTableIfNotExist('post', '');
s.add('enabled').type(schema.type.TINYINT, 4).notNull().default(1);
s.add('title').type(schema.type.VARCHAR, 60).notNull();
s.add('type').type(schema.type.VARCHAR, 60).notNull().default('post');
s.add('permalink').type(schema.type.VARCHAR, 120).notNull().unique();

console.log('Schematic', s.toString());
