# selfclose-sql-schematic
NodeJS modules is mysql schematic builder, or create table if not exists helper

This package
* forge query string for **MySQL / MariaDB**
* No dependencies
* Extreme Light

## Installation
`npm i --save selfclose-sql-schematic`

##### Todo
* add set timestamp option
* add emum type
* ALTER mode (rather update instead of destroy table)

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
s.add('money').type(T.DECIMAL, [10,2]).notNull();
s.add('permalink').type(schema.type.VARCHAR, 120).notNull().unique();
console.log('MYSQL', s.toString());
```

**And You'll get**
```mysql
CREATE TABLE IF NOT EXISTS `post` (`id` INT NOT NULL AUTO_INCREMENT, `enabled` TINYINT(4) NOT NULL DEFAULT 1, `title` VARCHAR(60) NOT NULL, `type` VARCHAR(60) NOT NULL DEFAULT 'post', `permalink` VARCHAR(120) NOT NULL, `created_at` DATETIME NOT NULL,
`updated_at` DATETIME NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `permalink` (`permalink`)) COMMENT='this is post table' COLLATE='utf8_general_ci' ENGINE=InnoDB
```

Then, Take these query string to mysql query function

sql.query(s.toString());

# Methods
First create variable
```javascript
var schema = FunctionHere()
```
#### Functions
* createTable(table_name, [options](#options))
* createTableIfNotExist(table_name, [options](#options))

### Options
(Values as shown is default)
```javascript
{
    comment: '',
    id: true, //Auto create id column with auto increment and primary key
    timestamp: true, //Auto create 'created_at' and 'updated_at'
    timestamp_type: 'DATETIME' // type can be 'DATETIME' or 'NUMBER'
}
```

Next will be chain functions

#### Chain Function
Most of theme already mysql syntax
* add(column name)
* type(type name)
* notNull()
* unique()
* default(value)
* comment(column comment)
* primaryKey()
* foreignKey(column, target_table, target_table_column)
* onUpdate(action)
* onDelete(action)
* toString() //End of chain for **Return Query String**

---
#### Another Example
Add with Object, With this define you will be easier to reuse variable later
```javascript
const schema = require('selfclose-sql-schematic');
var s = schema.createTableIfNotExist('post', {
    comment: 'this is post table'
});
let model = {
    enabled: {
        type: T.TINYINT,
        length: 4,
        notNull: true,
        default: 1
    },
    title: {
        type: T.VARCHAR,
        length: 60,
        notNull: true,
        regex: /^[a-zA-Z]{10,60}$/ //This is not Module's variable, But can be use later
    },
    type: {
        type: T.VARCHAR,
        length: 60,
        notNull: true,
        default: 'post'
    },
    permalink: {
        type: T.VARCHAR,
        length: 120,
        notNull: true,
        unique: true
    },
};
s.add(model);
console.log('MYSQL', s.toString());

//Reuse variable
let _title = 'HELLO!';
if (_title.length > model.title.length) {
    console.log('-- Title is too long')
}
if (!model.title.regex.test(_title)) {
    console.log('-- Title must be only English Characters!');
}
```

### Foreign Key

Chain with `.foreignKey(targetTable, targetTableColumn, onDelete, onUpdate)`
```javascript
const T = schema.type;
const A = schema.action;

var member = schema.createTableIfNotExist('member', {
    comment: 'member'
});
member.add('username').type(T.VARCHAR, 50).notNull().unique();
member.add('age').type(T.INT, 4).notNull().default(18);
console.log('MYSQL', member.toString());

var member_type = schema.createTableIfNotExist('member_type', {
    comment: 'pair with member'
});
member_type.add('name').type(T.VARCHAR, 20).notNull().unique().foreignKey('member', 'id', A.CASCADE, A.NO_ACTION);

console.log('MYSQL', member_type.toString());

```

##--WILL CONTINUE WRITE README SOON--
