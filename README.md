# opn-server-side-challenge
This repository was created to store my code challenge for the OPN Examination.
There are 3 folders.
1. RESTFUL-API: stores the Node.js project for the first question.
   
    - Go to RESTFUL-API folder
      ```console
      cd RESTFUL-API
      ```
    - To start server, run the command.
      ```console
      npm i && npm start
      ```
    - To test, use the postman or other to call the following api.
## Register API
`POST localhost:3000/user/register`
### Request Parameters
    {
        "email": "user_3@test.com",
        "password": "Test@1234",
        "name": "user_3",
        "birthdate": "1994-03-11",
        "gender": "female",
        "address": "address_3",
        "subscribe_newsletter": "T"
    }
### Parameter Description
- required all fields
- email: must be email format
- password: must have  minimum length 8, lowwercase, uppercase, number and special character
- birthdate: must be yyyy-mm-dd format
- gender: must be "male" or "femail"
- subscribe_newsletter: must be "T" or "F"
### Success Response
    {
        "status": "success",
        "data": {
            "user_id": 3,
            "token": "faketoken_user_3"
        }
    }
### Failed Response
    {
        "status": "failed",
        "error_key": "connection_error",
        "error_message": "Connection error"
    }
## getUserDetail API
`GET localhost:3000/user`
### Header
`Authorization: Bearer faketoken_user_3`
### Header Description
- token must be faketoken_user_(user_id) pattern
### Success Response
    {
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
### Failed Response
    {
        "status": "failed",
        "error_key": "no_data",
        "error_message": "Data not found"
    }
## updateUser API 
`PUT localhost:3000/user`
### Header
`Authorization: Bearer faketoken_user_3`
### Header Description
- token must be faketoken_user_(user_id) pattern
### Request Parameters
    {
        "birthdate": "1996-03-11",
        "gender": "male",
        "address": "address_31",
        "subscribe_newsletter": "F"
    }
### Success Response
    {
        "status": "success",
        "data": {}
    }
### Failed Response
    {
        "status": "failed",
        "error_key": "no_data",
        "error_message": "Data not found"
    }
## updatePassword API 
`PUT localhost:3000/user/password`
### Header
`Authorization: Bearer faketoken_user_3`
### Header Description
- token must be faketoken_user_(user_id) pattern
### Request Parameters
    {
        "current_password": "Test@1234",
        "new_password": "NewTest@1234",
        "confirm_password": "NewTest@1234"
    }
### Success Response
    {
        "status": "success",
        "data": {}
    }
### Failed Response
    {
        "status": "failed",
        "error_key": "wrong_current_password",
        "error_message": "Your current password is wrong"
    }
    
2. DATABASE: stores the MySQL code for the second question.
    - check the code at file <mark>"TABLES.sql"</mark>

3. CODING: stores the Node.js code for the third question.
    - check the code at file <mark>"cart.js"</mark>
    - To test, run file <mark>"cart_test.js"</mark> with the command.
      ```console
      node cart_test.js
      ```
