# selfclose-sql-schematic
NodeJS modules is mysql schematic builder, or create table if not exists helper

This package will forge query string for **MySQL / MariaDB**

## Installation
`npm i --save selfclose-sql-schematic`

## Currently Written:
- MySQL / MariaDB

## Table of Contents
- [Quick Example](#quick-example)

# Quick Example
This quick example shows how it's looks and usage. 

```javascript
const schema = require('selfclose-sql-schematic');
var s = schema.createTableIfNotExist('post', {
    comment: 'this is post table'
});
s.add('enabled').type(schema.type.TINYINT, 4).notNull().default(1);
s.add('title').type(schema.type.VARCHAR, 60).notNull();
s.add('type').type(schema.type.VARCHAR, 60).notNull().default('post');
s.add('permalink').type(schema.type.VARCHAR, 120).notNull().unique();
console.log('MYSQL', s.toString());
```

And You'll get
```mysql
CREATE TABLE IF NOT EXISTS `post` (`id` INT NOT NULL AUTO_INCREMENT, `enabled` TINYINT(4) NOT NULL DEFAULT 1, `title` VARCHAR(60) NOT NULL, `type` VARCHAR(60) NOT NULL DEFAULT 'post', `permalink` VARCHAR(120) NOT NULL, `created_at` DATETIME NOT NULL,
`updated_at` DATETIME NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `permalink` (`permalink`)) COMMENT='this is post table' COLLATE='utf8_general_ci' ENGINE=InnoDB
```

##--WILL CONTINUE WRITE README SOON--
