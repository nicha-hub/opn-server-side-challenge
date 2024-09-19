# opn-server-side-challenge
This repository was created to store my code challenge for the OPN Examination.
There are 3 folders.
1. RESTFUL-API: stores the Node.js project for the first question.
    - cd into RESTFUL-API folder
    - To start server, run command => "npm i && npm start".
    - To test, use the postman or other to call the following api.
        1.  POST | localhost:3000/user/register
            Body: {
                "email": "user_3@test.com",
                "password": "Test@1234",
                "name": "user_3",
                "birthdate": "1994-03-11",
                "gender": "female",
                "address": "address_3",
                "subscribe_newsletter": "T"
            }
            Input description
                - required all fields
                - email: must be email format
                - password: must have  minimum length 8, lowwercase, uppercase, number and special character
                - birthdate: must be yyyy-mm-dd format
                - gender: must be "male" or "femail"
                - subscribe_newsletter: must be "T" or "F"
            Response
                - success: {
                    "status": "success",
                    "data": {
                        "user_id": 3,
                        "token": "faketoken_user_3"
                    }
                }
                - failed: {
                    "status": "failed",
                    "error_key": "connection_error",
                    "error_message": "Connection error"
                }
        2.  GET | localhost:3000/user
            Header: "Authorization: Bearer faketoken_user_3"
            Header description
                - token must be faketoken_user_(user_id) pattern
            Response
                - success: {
                    "status": "success",
                    "data": {
                        "email": "user_3@test.com",
                        "name": "user_3",
                        "age": 30,
                        "gender": "female",
                        "address": "address_3",
                        "subscribe_newsletter": "T"
                    }
                }
                - failed: {
                    "status": "failed",
                    "error_key": "no_data",
                    "error_message": "Data not found"
                }
        3.  PUT | localhost:3000/user
            Header: "Authorization: Bearer faketoken_user_3"
            Header description
                - token must be faketoken_user_(user_id) pattern
            Body: {
                "birthdate": "1996-03-11",
                "gender": "male",
                "address": "address_31",
                "subscribe_newsletter": "F"
            }
            Input description
                * same at API 1.
            Response
                - success: {
                    "status": "success",
                    "data": {}
                }
                - failed: {
                    "status": "failed",
                    "error_key": "no_data",
                    "error_message": "Data not found"
                }
        4.  PUT | localhost:3000/password
            Header: "Authorization: Bearer faketoken_user_3"
            Header description
                - token must be faketoken_user_(user_id) pattern
            Body: {
                "current_password": "Test@1234",
                "new_password": "NewTest@1234",
                "confirm_password": "NewTest@1234"
            }
            Response
                - success: {
                    "status": "success",
                    "data": {}
                }
                - failed: {
                    "status": "failed",
                    "error_key": "wrong_current_password",
                    "error_message": "Your current password is wrong"
                }
    
    
2. DATABASE: stores the MySQL code for the second question.
    - check the code at file "TABLES.sql"

3. CODING: stores the Node.js code for the third question.
    - check the code at file "cart.js"
    - To test, run file "cart_test.js" with the command => "node cart_test.js".
