# banka

Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money.

[![Build Status](https://travis-ci.org/mifeille/banka.svg?branch=develop)](https://travis-ci.org/mifeille/banka)  [![Coverage Status](https://coveralls.io/repos/github/mifeille/banka/badge.svg?branch=develop)](https://coveralls.io/github/mifeille/banka?branch=develop)  [![Maintainability](https://api.codeclimate.com/v1/badges/6f9d176365640932903b/maintainability)](https://codeclimate.com/github/mifeille/banka/maintainability)


### Features

* A user (client) can sign up 
* A user (client) can login
* A user (client) can create an account
* A user (client) can view account transaction history
* A user (client) can view a specific account transaction
* A staff (cashier) can debit user (client) account
* A staff (cashier) can credit user (client) account
* An admin/staff can view all user accounts
* An admin/staff can view a specific user account
* An admin/staff can activate or deactivate an account
* An admin/staff can delete a specific user account
* An admin can create staff and admin user accounts

### Requirements

Tools:
* Node.js 10.15.3
* NPM 6.4.1

### Setting up dependencies

Clone the repository into your machine  
`git clone https://github.com/mifeille/banka.git`

Install dependencies  
`npm install`

Start the server  
`npm start`

Run Tests  
`npm test`

### API Endpoints

#### Create a client (user) 

POST /auth/signup

To test this endpoint, use the Banka application link below from [Heroku](https://www.heroku.com/) in [Postman](https://www.getpostman.com/)  
https://bankamireille.herokuapp.com  

In Postman:  
Select POST as the request method and use this endpoint  
`https://bankamireille.herokuapp.com/api/v1/auth/signup`  

Go to the body and create a user account

```
{
    "firstName": "Solange",
    "lastName" : "Umuhire",
    "email": "umuhire@banka.com",
    "password" : "umuhire1!",
    "confirmPassword" : "umuhire1!"
      
}
```

#### Sign in a client (user)

POST /auth/signin

In Postman:  
Select POST as the request method and use this endpoint  
`https://bankamireille.herokuapp.com/api/v1/auth/signin`  

Go to the body and log in

```
{
    "email": "umuhire@banka.com",
    "password" : "umuhire1!"
}
```

#### Create a Bank account

POST /accounts 

In Postman:  
Select POST as the request method and use this endpoint  
`https://bankamireille.herokuapp.com/api/v1/accounts`  

Go to the body and create a Bank account

```
{
    "firstName": "Blaise",
    "lastName" : "Kalima",
    "email": "kalimaB@banka.com",
    "type": "savings"
}
```

#### To activate or deactivate a Bank account

PATCH /accounts/account-number  

In Postman:  
Select PATCH as the request method and use this endpoint  
`https://bankamireille.herokuapp.com/api/v1/accounts/account-number`  

Go to the body and activate or deactivate a Bank account

```
{
    "status": "active"
}
```

#### To delete a specific Bank account

DELETE /accounts/account-number  

In Postman:  
Select DELETE as the request method and use this endpoint  
`https://bankamireille.herokuapp.com/api/v1/accounts/account-number` 

```
{
    "status": 200,
    "message": "Bank account successfully deleted"
}
```

#### To debit a Bank account

POST /transactions/account-number/debit  

In Postman:  
Select POST as the request method and use this endpoint  
`https://bankamireille.herokuapp.com/api/v1/transactions/account-number/debit`  

Go to the body and debit a Bank account

```
{
    "amount" : 45000
}
```


#### To credit a Bank account

POST /transactions/account-number/credit  

In Postman:  
Select POST as the request method and use this endpoint  
`https://bankamireille.herokuapp.com/api/v1/transactions/account-number/credit`  

Go to the body and credit a Bank account

```
{
    "amount" : 45000
}
```
