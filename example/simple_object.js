const schema = require('./../index');
const T = schema.type;

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
        regex: /^[a-zA-Z]{0,60}$/ //This is not Module's variable, But can be use later
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
