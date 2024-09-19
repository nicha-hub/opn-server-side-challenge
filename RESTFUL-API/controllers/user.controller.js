const moment = require('moment');
const bcrypt = require('bcrypt');

const common = require('../utils/common');
const SqlLite = require('../database/sql_lite');

const database = new SqlLite();
database.initial();

exports.register = async (req, res, next) => {
    let result = {error_key: ''}

    let r_param = common.getParams(req, false)
    if (r_param.error_key) {
        result.error_key = r_param.error_key
        common.sendResponse(result, res);
        return
    }
    let params = r_param.data;
    
    let validated_field = {
        email: ['required', 'is_email'],
        password: ['required', 'is_password'],
        name: ['required', 'is_string'],
        birthdate: ['required', 'is_date'],
        gender: ['required', ['male','female']],
        address: ['required', 'is_string'],
        subscribe_newsletter: ['required',  ['T','F']]
    }
    let r_validate = common.validateData(params, validated_field)
    if (!r_validate.status) {
        result.error_key = "invalid_some_parameter"
        common.sendResponse(result, res);
        return
    }

    let dt = await database.query("SELECT * FROM users WHERE email = ?",[params.email]);
    if (dt.status) {
        if (dt.data.length > 0) {
            result.error_key = "duplicate_email";
        }else {
            const hashed_password = await bcrypt.hash(params.password, 10);
            let insert_params = [
                params.email,
                params.name,
                hashed_password,
                params.birthdate,
                params.gender,
                params.address,
                params.subscribe_newsletter,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                moment().format('YYYY-MM-DD HH:mm:ss')
            ];
            let r_insert = await database.execute("INSERT INTO users (email,name,password,birthdate,gender,address,subscribe_newsletter,created_date,modified_date) VALUES (?,?,?,?,?,?,?,?,?)",insert_params);
            if (!r_insert.status) {
                result.error_key = "connection_error";
            }else{
                result.data = {user_id: r_insert.insert_id, token: `faketoken_user_${r_insert.insert_id}`}
            }
        }
    }else {
        result.error_key = "connection_error";
    }

    database.close();
    common.sendResponse(result, res);
    return
};

exports.getUserDetail = async (req, res, next) => {
    let result = {error_key: ''}

    let r_param = common.getParams(req, true);
    if (r_param.error_key) {
        result.error_key = r_param.error_key
        common.sendResponse(result, res);
        return
    }
    let params = r_param.data;
    let user_id = params.session_data.user_id;

    let dt = await database.query("SELECT email, name, birthdate, gender, address, subscribe_newsletter FROM users WHERE user_id = ?",[user_id]);
    if (dt.status) {
        if (dt.data.length > 0) {
            result.data = dt.data[0];
            result.data.age = moment().diff(result.data.birthdate, 'years');
            delete result.data.birthdate;
        }else {
            result.error_key = 'no_data'
        }
    }else {
        result.error_key = 'connection_error'
    }

    database.close();
    common.sendResponse(result, res);
    return
}

exports.updateUser = async (req, res, next) => {
    let result = {error_key: ''}

    let r_param = common.getParams(req, true);
    if (r_param.error_key) {
        result.error_key = r_param.error_key
        common.sendResponse(result, res);
        return
    }
    let params = r_param.data;
    let user_id = params.session_data.user_id;

    let validated_field = {
        birthdate: ['required', 'is_date'],
        gender: ['required', ['male','female']],
        address: ['required', 'is_string'],
        subscribe_newsletter: ['required',  ['T','F']]
    }
    let r_validate = common.validateData(params, validated_field)
    if (!r_validate.status) {
        result.error_key = "invalid_some_parameter"
        common.sendResponse(result, res);
        return
    }

    let dt = await database.query("SELECT count(1) as num FROM users WHERE user_id = ?",[user_id]);
    if (dt.status) {
        if (dt.data.length > 0 && dt.data[0].num > 0) {
           
        }else {
            result.error_key = 'no_data'
        }
    }else {
        result.error_key = 'connection_error'
    }
    if (result.error_key) {
        common.sendResponse(result, res);
        return
    }

    let update_params = [
        params.birthdate,
        params.gender,
        params.address,
        params.subscribe_newsletter,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        user_id
    ]
    let r_update = await database.execute("UPDATE users SET birthdate = ?, gender = ?, address = ?, subscribe_newsletter = ?, modified_date = ? WHERE user_id = ?",update_params);
    if (!r_update.status) {
        result.error_key = "connection_error";
    }

    database.close();
    common.sendResponse(result, res);
    return
}

exports.updatePassword = async (req, res, next) => {
    let result = {error_key: ''}

    let r_param = common.getParams(req, true);
    if (r_param.error_key) {
        result.error_key = r_param.error_key
        common.sendResponse(result, res);
        return
    }
    let params = r_param.data;
    let user_id = params.session_data.user_id;
    let {current_password, new_password, confirm_password} = params;

    let validated_field = {
        current_password: ['required'],
        new_password: ['required', 'is_password'],
        confirm_password: ['required']
    }
    let r_validate = common.validateData(params, validated_field)
    if (!r_validate.status) {
        result.error_key = "invalid_some_parameter"
        common.sendResponse(result, res);
        return
    }

    let dt = await database.query("SELECT password FROM users WHERE user_id = ?",[user_id]);
    if (dt.status) {
        if (dt.data.length > 0) {
           
        }else {
            result.error_key = 'no_data'
        }
    }else {
        result.error_key = 'connection_error'
    }
    if (result.error_key) {
        common.sendResponse(result, res);
        return
    }

    let user_password = dt.data[0]['password'];
    
    let is_match = await bcrypt.compare(current_password, user_password);
    if (!is_match) {
        result.error_key = 'wrong_current_password'
    }else if (current_password === new_password) {
        result.error_key = 'new_password_same_old_password'
    }else if (new_password !== confirm_password) {
        result.error_key = 'not_match_with_confirm_password'
    }
    if (result.error_key) {
        common.sendResponse(result, res);
        return
    }

    const hashed_new_password = await bcrypt.hash(new_password, 10);
    let update_params = [
        hashed_new_password,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        user_id
    ]
    let r_update = await database.execute("UPDATE users SET password = ?, modified_date = ? WHERE user_id = ?",update_params);
    if (!r_update.status) {
        result.error_key = "connection_error";
    }

    database.close();
    common.sendResponse(result, res);
    return
}