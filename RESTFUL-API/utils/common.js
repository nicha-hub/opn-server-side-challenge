exports.getSessionData = (req) => {
    let result = {error_key: ''}
    let auth = req.header('Authorization');
    if (auth) {
        let tmp = auth.split(" ")
        if (tmp[0] === 'Bearer' && tmp[1] && /^faketoken_user_[1-9][0-9]?/.test(tmp[1])) {
            let user_id = tmp[1].split('_')[2];
            result.data = {user_id: user_id};
        }else {
            result.error_key = 'session_timeout';
        }
    }else{
        result.error_key = 'session_timeout';
    }
    return result;
}

exports.getParams = (req, check_session = true) => {
    let result = {error_key: ''}
    result.data = Object.assign({}, req.body)
    if (check_session) {
        let r_session = this.getSessionData(req);
        if (r_session.error_key) {
            result.error_key = r_session.error_key;
        }
        result.data.session_data = r_session.data;
    }
    return result
}

exports.validateData = (params , schema = {}) => {
    let res = {status: true, error_field: {}}
    for(let [field_name, rules] of Object.entries(schema)){
        let field_value = params[field_name];

        rules.map((rule)=>{
            if (rule === 'required') {
                if (field_value === null || field_value === undefined || field_value === '') {
                    res.status = false;
                    res.error_field[field_name] = {error_code: 'missing_parameter'};
                }
            }else if (rule === 'is_email') {
                let email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (field_value != null && !email_regex.test(field_value)) {
                    res.status = false;
                    res.error_field[field_name] = {error_code: 'invalid_parameter'};
                }
            }else if (rule === 'is_password') {
                if (field_value != null) {
                    // Password policy parameters
                    const min_length = 8;
                    const has_uppercase = /[A-Z]/.test(field_value);
                    const has_lowercase = /[a-z]/.test(field_value);
                    const has_digit = /\d/.test(field_value);
                    const has_special_char = /[!@#$%^&*()-=_+[\]{}|;:,.<>?]/.test(field_value);
                    if (field_value.length >= min_length
                        && has_uppercase
                        && has_lowercase
                        && has_digit
                        && has_special_char
                    ) {

                    }else{
                        res.status = false;
                        res.error_field[field_name] = {error_code: 'invalid_parameter'};
                    }
                }
            }else if (rule === 'is_string') {
                if (field_value != null && typeof field_value !== 'string') {
                    res.status = false;
                    res.error_field[field_name] = {error_code: 'invalid_parameter'};
                }
            }else if (rule === 'is_date') {
                if (field_value != null){
                    let date_regex = /^(\d{4})-(\d{2})-(\d{2})$/;
                    if(!date_regex.test(field_value)){
                        res.status = false;
                        res.error_field[field_name] = {error_code: 'invalid_parameter'};
                    }
                }
            }else if (Array.isArray(rule)) {
                if (field_value != null) {
                    let in_rule = rule.some(x=>x===field_value);
                    if (!in_rule) {
                        res.status = false;
                        res.error_field[field_name] = {error_code: 'invalid_parameter'};
                    }
                }
            }else {
                res.status = false;
                res.error_field[field_name] = {error_code: 'rule_not_found'};
            }
        });
    }
    return res;
}

exports.sendResponse = (res_param={} , res_function) => {
    const response_config = {
        invalid_some_parameter: {"code": 400, "message": "Some parameter is invalid"},
        missing_parameter: {"code": 400, "message": "Required field must not be blank"},
        connection_error: {"code": 500, "message": "Connection error"},
        duplicate_email: {"code": 409, "message": "Duplicate email"},
        session_timeout: {"code": 401, "message": "Authentication failure or session expired" },
        no_data: {"code": 404, "message": "Data not found"},
        wrong_current_password: {"code": 401, "message": "Your current password is wrong"},
        not_match_with_confirm_password: {"code": 400, "message": "Your new password doesn't match with confirm password"},
        new_password_same_old_password: {"code": 400, "message": "The new password must not be the same as the old one"},
    }
    let headers = {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
    let err_info = response_config[res_param.error_key] || response_config['try_again']
    let status_code = res_param.error_key !== ''? err_info.code : 200
    let body = {
        status: status_code === 200? 'success' : 'failed'
    }
    if (status_code === 200) {
        body.data = res_param.data || {}
    }else{
        body.error_key = res_param.error_key
        body.error_message = err_info.message
    }
    
    res_function.set(headers)
    res_function.status(status_code)
    res_function.send(JSON.stringify(body))
}

