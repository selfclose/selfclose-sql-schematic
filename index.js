/**
 * @author https://github.com/selfclose
 * For Javascript ES6
 */
const types = {
    BINARY: 'BINARY',
    BLOB: 'BLOB',
    BIGINT: 'BIGINT',
    BIT: 'BIT',
    CHAR: 'CHAR',
    DATETIME: 'DATETIME',
    DATE: 'DATE',
    DECIMAL: 'DECIMAL',
    DOUBLE: 'DOUBLE',
    ENUM: 'ENUM',
    FLOAT: 'FLOAT',
    INT: 'INT',
    JSON: 'JSON',
    LONGBLOB: 'LONGBLOB',
    LONGTEXT: 'LONGTEXT',
    MEDIUMBLOB: 'MEDIUMBLOB',
    MEDIUMINT: 'MEDIUMINT',
    MEDIUMTEXT: 'MEDIUMTEXT',
    SMALLINT: 'SMALLINT',
    SET: 'SET',
    TEXT: 'TEXT',
    TINYBLOB: 'TINYBLOB',
    TINYINT: 'TINYINT',
    TINYTEXT: 'TINYTEXT',
    TIME: 'TIME',
    TIMESTAMP: 'TIMESTAMP',
    VARCHAR: 'VARCHAR',
    YEAR: 'YEAR'
};

const action = {
    DELETE: 'DELETE',
    CASCADE: 'CASCADE',
    SET_NULL: 'SET NULL',
    NO_ACTION: 'NO ACTION',
    RESTRICT: 'RESTRICT',
    SET_DEFAULT: 'SET DEFAULT'
};

var create = function (ifNotExist, table, table_comment, auto_id = true, add_timestamp = true) {

    //todo: auto_id can turn of
    //todo: ENUM Type

    table = "CREATE TABLE "+(ifNotExist?"IF NOT EXISTS ":"")+"`"+table+"` (";
    var concat = "`id` INT NOT NULL AUTO_INCREMENT, ";
    added = {
        firstLoop: true,
        column: undefined,
        type: undefined,
        type_length: undefined,
        isNull: true,
        comment: undefined,
        has_default: undefined,
        pk: [],
        unique: [],
        fk: [],
        had_error: null
    };
    reset = {
        type: undefined,
        type_length: undefined,
        isNull: true,
        comment: undefined,
        has_default: undefined
    };

    function c () {}
    c.add = function(column_name) {
        if (typeof column_name === 'object') {
            for(let c in column_name) {
                this.add(c);
                this.type(column_name[c].type, column_name[c].length);
                if (column_name[c].notNull) this.notNull();
                if (column_name[c].default) this.default(column_name[c].default);
                if (column_name[c].comment) this.comment(column_name[c].comment);
                if (column_name[c].primaryKey) this.primaryKey();
                if (column_name[c].unique) this.unique();
                if (column_name[c].foreignKey) {
                    let o = column_name[c].foreignKey;
                    this.foreignKey(o.column, o.targetTable, o.targetTableColumn, o.onDelete, o.onUpdate );
                }
            }
            return;
        }
        if (added.column) {
            inject();
        }
        added.column = column_name;
        return this
    };

    //todo: if type = enum('Y', 'N')
    c.type = function(type, length) {
        if (!types[type]) added.had_error = "TYPE '"+type+"' IS INCORRECT !";
        added.type = type.toUpperCase(); if (length!==undefined) added.type_length = length; return this };
    c.notNull = function () { added.isNull = false; return this };
    c.null = function () { added.isNull = true; return this };
    c.default = function (text) { if (text!==undefined) added.has_default = text; return this };
    c.comment = function (comment) { added.comment = comment; return this };
    c.primaryKey = function () { added.pk.push(added.column); return this };
    c.unique = function () { added.unique.push(added.column); return this };
    c.foreignKey = function (targetTable, targetTableColumn = 'id', onDelete = 'CASCADE', onUpdate = 'CASCADE') {
        return this.addForeignKey(added.column, targetTable, targetTableColumn, onDelete, onUpdate);
    };
    c.addForeignKey = function (sourceColumn, targetTable, targetTableColumn = 'id', onDelete = 'CASCADE', onUpdate = 'CASCADE') {
        if (onDelete.toUpperCase() === 'DELETE') throw new Error('schematic Error: Cannot use DELETE in onDelete');
        added.fk.push({column: sourceColumn, tar_table: targetTable, tar_col: targetTableColumn, onDelete: onDelete.toUpperCase(), onUpdate: onUpdate.toUpperCase()});
        return this
    };
    c.onUpdate = function (action) {
        if (!added.fk.length) {
            added.had_error = "CANNOT SET ON UPDATE, DEFINE FOREIGN KEY FIRST !";
            return this
        }
        added.fk[added.fk.length-1].onUpdate = action.toUpperCase();
        return this
    };
    c.onDelete = function (action) {
        if (!added.fk.length) {
            added.had_error = "CANNOT SET ON DELETE, DEFINE FOREIGN KEY FIRST !";
            return this
        }
        added.fk[added.fk.length-1].onDelete = action.toUpperCase();
        return this
    };

    inject = function () {
        var defaultVal = typeof added.has_default === "number" ? added.has_default : "'"+added.has_default+"'";
        var length = "";
        if (typeof added.type_length === "object" && added.type === 'ENUM') {
            for (var i=0;i<added.type_length.length;i++) {
                length += (typeof added.type_length[i] === 'string' ? "'"+added.type_length[i]+"'": added.type_length[i])+(i===added.type_length.length-1?'':', ');
            }
        } else if (typeof added.type_length === "string")
            length = "'"+added.type_length+"'";
        else if (typeof added.type_length === "number") {
            length = added.type_length;
        }
        else if (typeof added.type_length === "object" && added.type === 'DECIMAL') {
            length = added.type_length[0]+','+added.type_length[1];
        }

        if (added.type==="VARCHAR" && added.type_length===undefined)
            length = 100;

        let add_str = (length===''?"":(added.type==='DOUBLE'||added.type==='FLOAT')?'' : "(" + length + ")")
        concat += (added.firstLoop?"":", ")+"`" + added.column + "` " + added.type + add_str + " " + (added.isNull ? "NULL" : "NOT NULL") + (added.has_default!==undefined ? " DEFAULT "+defaultVal : "")+(added.comment!==undefined ?" COMMENT '"+added.comment+"'":"");

        added.firstLoop = false;
        //reset
        added.type = reset.type;
        added.type_length = reset.type_length;
        added.isNull = reset.isNull;
        added.comment = reset.comment;
        added.has_default = reset.has_default;
    };
    keyDefine = function () {
        //add created_at, updated_at
        if (add_timestamp) concat += ", `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL";

        concat += ", PRIMARY KEY (`id`";
        if (added.pk.length) {
            for(var k in added.pk) {
                concat += ", `"+added.pk[k]+"`";
            }
        }
        concat += ")";

        if (added.unique.length) {
            for (var k in added.unique) {
                concat += ", UNIQUE INDEX `"+added.unique[k]+"` (`"+added.unique[k]+"`)";
            }
        }

        if (added.fk.length) {
            for (var k in added.fk) {
                concat+= ", CONSTRAINT `FK__t_"+added.fk[k].tar_table+"` FOREIGN KEY (`"+added.fk[k].column+"`) REFERENCES `"+added.fk[k].tar_table+"` (`"+added.fk[k].tar_col+"`)"
                    +" ON UPDATE "+added.fk[k].onUpdate+" ON DELETE "+added.fk[k].onDelete;
                //concat+= ", FOREIGN KEY ('"+added.fk[k].column+"') REFERENCES '"+added.fk[k].tar_table+"' ('"+added.fk[k].tar_col+"')"
            }
        }

        concat+= ")";
        if (table_comment!==undefined)
            concat+= " COMMENT='"+table_comment+"'";
        concat += " COLLATE='utf8_general_ci' ENGINE=InnoDB";
    };

    c.toString = function() { inject(); keyDefine(); return added.had_error===null ? table + concat:"ERROR: "+added.had_error; };
    return c;
};
module.exports = {
    /**
     * @param table
     * @param sqlValue
     * @returns {query}
     *
     * === Example ===
     * {ID: "INT NOT NULL AUTO_INCREMENT",
     * province_id: "INT(3) NOT NULL",
     * name: "varchar(255) NOT NULL",
     * geo_id": "TINYINT(2) NULL",
     * province_id": "INT(4) NOT NULL DEFAULT '0' COMMENT 'มอ ใน ID จังหวัด'"}
     */
    /*
     CREATE TABLE `users` (
     `id` INT NOT NULL AUTO_INCREMENT,
     `username` VARCHAR(50) NOT NULL,
     `password` VARCHAR(80) NOT NULL DEFAULT 'test',
     `enum` ENUM('Y','N') NOT NULL DEFAULT 'Y',
     `created_at` DATETIME NOT NULL,
     `updated_at` DATETIME NOT NULL,
     PRIMARY KEY (`id`),
     UNIQUE INDEX `username` (`username`)
     )
     COMMENT='all user will store here'
     COLLATE='utf8_general_ci'
     ENGINE=InnoDB
     ;
     */
    createTable: function (table, {comment}) {
        return create(false, table, comment);
    },

    createTableIfNotExist: function (table, {comment, id = true, timestamp = true}) {
        return create(true, table, comment, id, timestamp);
    },

    customQuery: function (table, sqlValue, primaryKey) {
        // var last = Object.keys(sqlValue)[Object.keys(sqlValue).length-1];
        var valText = "`id` NOT NULL AUTO_INCREMENT, ";

        if (typeof sqlValue === "object") {
            for (var k in sqlValue) {
                valText += "`"+k+"` "+sqlValue[k]+', ';
            }
        }else {
            valText += sqlValue;
        }
        valText+= "`created_at`"
        valText+= "CONSTRAINT PK_Person PRIMARY KEY (id)";
        return "CREATE TABLE IF NOT EXISTS `"+table+"` ("+valText+") ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci";
    },

    dropTableIfExist: function (table) {
        return "DROP TABLE IF EXISTS `"+table+"`";
    },

    //for auto complete
    type: types,
    action: action,

    default: {
        CURRENT_TIMESTAMP: 'CURRENT_TIMESTAMP',
        DATETIME: 'DATETIME'
    }
};
