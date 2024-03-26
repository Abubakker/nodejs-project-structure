const Model = loadCore('model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = class UserModel extends Model {
    constructor() {
        super();
        this.table = 'users';
        this.tokenTable = 'user_tokens';
        this.primaryKey = 'id';
        this.columnsResponse = ['first_name', 'last_name', 'email', 'created_at', 'updated_at']
    }

    async userRegistration(userData) {
        try {
            let userDataAfterHashing = await this.generateHash(userData, 'password');
            let insertUser = await this.db(this.table).insert({ ...userDataAfterHashing });
            let insertedId = insertUser[0];
            let newUser = userDataAfterHashing;
            delete newUser.password;
            newUser.id = insertedId;
            return newUser;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getResetHash(email) {
        try {
            let reset_password = await jwt.sign({ email }, process.env.JWT_ACCESS_TOKEN_SECRET);
            return Promise.resolve(reset_password);
        } catch (err) {
            return Promise.reject(err)
        }
    }

    async resetPassword(email, password) {
        try {

            let user = await this.db(this.table).where({ email }).first();
            if (!user) return Promise.reject({ error_code: 'USER_NOT_FOUND' })

            let passwordObj = await this.generateHash({ password }, 'password');
            let status = await this.db(this.table).where({ id: user.id }).update({ ...passwordObj })
            if (status) return Promise.resolve(status)
        } catch (err) {
            console.log(err)
            return Promise.reject({ error_code: 'INTERNAL_SERVER_ERROR' })
        }
    }
    async resetTokenCheck(data) {
        let payload;
        try {
            try {
                payload = jwt.verify(data.token, process.env.JWT_ACCESS_TOKEN_SECRET);
            } catch (invalid_token_err) {
                return Promise.resolve({ is_valid: false, message: 'You token is invalid/expired.' })
            }

            let user = await this.db(this.table).where({ email: payload.email, reset_password: data.token }).first();
            if (!user) return Promise.resolve({ is_valid: false, message: 'You token is not found.' })
            return Promise.resolve({ is_valid: true, message: 'Your token is valid' })
        } catch (err) {
            console.log(err)
            return Promise.reject({ error_code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong. Please try again later' })
        }
    }


    async userPasswordCheck(user) {
        try {
            let { email, password } = user;
            let retriveUser = await this.find({ email });
            if (!retriveUser) {
                return Promise.reject({ error_code: 'USER_NOT_FOUND', message: 'Register email is not found.' });
            }
            let isMatchPassword = await bcrypt.compare(password.toString(), retriveUser.password);

            if (!isMatchPassword) {
                return Promise.reject({ error_code: 'INVALID_PASS', message: 'email/Password did not match' });
            }
            else {
                return retriveUser;
            }
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    async refreshTokenCheckAndValidate(token, payload) {
        try {
            let retriveData = await this.db(`${this.tokenTable} as token`)
                .innerJoin(`${this.table} as user`, 'token.user_id', 'user.id')
                .where('user.email', payload.email)
                .andWhere('token.refresh_token', token).first();
            return retriveData;
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }
    async generateAccessToken(user, key, payloadFiled = [], expireTime) {

        try {
            let token;
            var payload = {};
            if (payloadFiled.length) {
                payloadFiled.forEach(value => {
                    payload[[value]] = user[value];
                })
            }
            else {
                Object.keys(user).forEach(value => {
                    payload[[value]] = user[value];
                })
            }
            if (expireTime) {
                token = await jwt.sign(payload, key, { expiresIn: expireTime });
            }
            else {
                token = await jwt.sign(payload, key);
            }
            return token;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async isMatchPassword(nonHashValue, hashValue) {
        try {
            let isMatch = await bcrypt.compare(nonHashValue, hashValue);
            return isMatch;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getAllUser() {
        try {
            let users = await this.db(this.table);
            return users;
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    async generateHash(object, filed) {
        let value;
        let isObject = true;
        if (typeof object !== "object") {
            value = object;
            isObject = false;
        }
        else {
            value = object[filed];
        }
        try {
            let saltRound = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(value.toString(), saltRound);
            let genHash = isObject ? (object[filed] = hash) : hash;
            return isObject ? object : genHash;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }


    async tokenCheckFromDb(token) {
        try {
            let data = await this.db(this.tokenTable).where('access_token', token).first();
            return data;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async saveToken(dataTosave) {
        try {
            await this.deleteToken({ user_id: dataTosave.user_id });
            let saveStatus = await this.db(this.tokenTable)
                .insert(dataTosave);

            if (!saveStatus.length) return false;

            return true;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async updateToken(qeuryData, updatedata) {
        try {
            let udpateStatus = await this.db(this.tokenTable)
                .where(qeuryData)
                .update(updatedata);
            return true;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async deleteToken(conditions) {
        try {
            let isDelete = await this.db(this.tokenTable)
                .where(conditions).del();

            return isDelete;
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    sendEmailForPasswordReset = ({ token, email }) => {
        return new Promise((resolve, reject) => {
            var ejs = require('ejs');
            let path = require('path');
            let p = path.join(path.dirname(require.main.filename), 'app/views/emails/password_reset.ejs');
            ejs.renderFile(p, { token }, [], function (err, html) {
                if (err) {
                    console.log(err)
                } else {
                    const payload = {
                        to: email,
                        subject: 'Password Reset',
                        html: html
                    };
                    let mail = loadLibrary('mailer')
                    mail.send(payload).then(function (res) {
                        resolve(res)
                    }, error => {
                        reject(error)
                    });
                }
            });
        })
    }

    async userResetTokenCheck(user) {
        try {
            let { email, reset_password } = user;
            let retriveUser = await this.find({ email });
            if (!retriveUser) {
                return Promise.reject({ error_code: 'USER_NOT_FOUND', message: 'Register email is not found.' });
            } else if (!retriveUser.reset_password) {
                return Promise.reject({ error_code: 'INVALID_OTP' });
            }
            let isMatchPassword = await bcrypt.compare(reset_password.toString(), retriveUser.reset_password);

            if (!isMatchPassword) {
                return Promise.reject({ error_code: 'INVALID_OTP' });
            }
            else {
                return retriveUser;
            }
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

};