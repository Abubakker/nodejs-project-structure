require('../system/loader');

class Model {

    constructor() {
        this.db = require('../config/database').instance;
        this.table = ''
        this.primaryKey = 'id';
        this.select = ['*'];
    };
    /**
     * 
     * @return <promise> query builder 
     */
    qb() {
        return this.db(this.table);
    }

    /**
     * 
     * @param JSON data 
     * @return int
     */
    async save(data) {
        try {
            let insert = await this.db(this.table).insert(data);
            let insertedId = insert[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * 
     * @param Object conditions 
     * @returns array
     */
    async get(conditions) {
        try {
            let data = null;
            if (conditions && Object.keys(conditions).length > 0) data = this.db(this.table).where(conditions).select(this.select);
            else data = this.db(this.table).select(this.select);
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * 
     * @param object conditions 
     * @param array select_columns 
     * @returns Object
     */
    async find(conditions) {
        try {
            let data = null;
            data = this.db(this.table).where(conditions).select(this.select).first();
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * 
     * @param Object conditions 
     * @returns object 
     */
    async delete(conditions) {
        try {
            let data = null;
            data = this.db(this.table).where(conditions).del()
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * 
     * @param Object condition 
     * @param Object data 
     * @returns Object
     */
    async update(condition, data) {
        try {
            let res = await this.db(this.table).where(condition).update(data);
            return res;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * 
     * @param Object condition 
     * @param Object insert_data 
     * @returns Object
     */
    async firstOrCreate(conditions, insert_data) {
        return new Promise(async (resolve, reject) => {
            try {
                let row = await this.db(this.table).where(conditions).select(this.select).first();
                if (row) return resolve(row)
                else {
                    let insert_id = await this.db(this.table).insert(insert_data);
                    row = await this.db(this.table).where({ id: insert_id[0] }).select(this.select).first();
                    return resolve(row)
                }
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = Model;