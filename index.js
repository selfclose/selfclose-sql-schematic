/**
 * @author https://github.com/selfclose
 */
var types = ['VARCHAR', 'CHAR', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'JSON', 'FLOAT', 'DOUBLE', 'DECIMAL', 'TINYINT', 'SMALLINT', 'MEDIUMINT','INT','BIGINT','BIT'];
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

        if (added.column) {
            inject();
        }
        added.column = column_name;
        return this
    };



    inject = function () {
        var defaultVal = typeof added.has_default === "number" ? added.has_default : "'"+added.has_default+"'";
        var length = "";
        if (typeof added.type_length === "object" && added.type === 'ENUM') {
            for (var i=0;i<added.type_length.length;i++) {
                length += "'"+added.type_length[i]+"'"+(i===added.type_length.length-1?'':', ');
            }
        } else if (typeof added.type_length === "string")
            length = "'"+added.type_length+"'";
        else if (typeof added.type_length === "number") {
            length = added.type_length;
        }
        
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
                concat+= ", CONSTRAINT `FK__t_"+added.fk[k].tar_table+"` FOREIGN KEY (`"+added.fk[k].column+"`) REFERENCES `"+added.fk[k].tar_table+"` (`"+(added.fk[k].tar_col===undefined?'id':added.fk[k].tar_col)+"`)"
                    +(added.fk[k].onUpdate===null?"":" ON UPDATE "+added.fk[k].onUpdate)+(added.fk[k].onDelete===null?"":" ON DELETE "+added.fk[k].onDelete);
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

    createTableIfNotExist: function (table, table_comment, auto_id = true, timestamp = true) {
        return create(true, table, table_comment, auto_id, timestamp);
    }

};
