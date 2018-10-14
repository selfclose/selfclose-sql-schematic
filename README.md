# selfclose-sql-schematic
NodeJS modules is mysql schematic builder, or create table if not exists helper

# Table of Contents
- [Quick Example](#quick-example)

# Quick Example
This quick example shows how to connect to and asynchronously query a MySQL database using a single connection.

```javascript
const schema = require('selfclose-sql-schematic');
var s = schema.createTableIfNotExist('post', 'เก็บ Post');
s.add('enabled').type(schema.type.TINYINT, 4).notNull().default(1);
s.add('title').type(schema.type.VARCHAR, 60).notNull();
s.add('type').type(schema.type.VARCHAR, 60).notNull().default('post');
s.add('permalink').type(schema.type.VARCHAR, 120).notNull().unique();
console.log('mysql string', s.toString());
```
