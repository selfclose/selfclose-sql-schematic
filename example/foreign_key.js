const schema = require('./../index');
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

