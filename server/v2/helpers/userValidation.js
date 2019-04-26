import validator from 'validator';

export default class validateUser {
  static validateSignup(req, res) {
    const whiteSpace = /\s/;
    const containNumbers = /\d/;
    let email;
    if (req.body.email) {
      email = req.body.email.trim();
    } else {
      throw Error('Email should not be empty');
    }
    if (!req.body.firstName) {
      throw Error('First Name is required');
    }

    if (whiteSpace.test(req.body.firstName)) {
      throw Error('Last name should not contain white spaces');
    }
    if (containNumbers.test(req.body.firstName)) {
      throw Error('First name should not contain numbers');
    }

    if (typeof req.body.firstName === 'number') {
      throw Error('First Name should not be a number');
    }
    if (typeof req.body.lastName === 'number') {
      throw Error('Last Name should not be a number');
    }

    if (!req.body.lastName) {
      throw Error('Last Name is required');
    }

    if (whiteSpace.test(req.body.lastName)) {
      throw Error('Last Name should not contain white spaces');
    }
    if (containNumbers.test(req.body.lastName)) {
      throw Error('Last name should not contain numbers');
    }

    if (typeof email === 'number') {
      throw Error('Wrong format, email should not be an integer');
    }

    if (!email) {
      throw Error('Email should not be empty');
    }

    if (!validator.isEmail(email)) {
      throw Error('Your email should look like this : example@email.com');
    }

    if (!req.body.password) {
      throw Error('Password is required');
    }

    if (whiteSpace.test(req.body.password)) {
      throw Error('Password should not contain white spaces');
    }

    if (!validator.isLength(req.body.password, {
      min: 6, max: 50,
    })) {
      throw Error('Password should be at least 6 characters');
    }
    if (!req.body.confirmPassword) {
      throw Error('Please confirm your password');
    }

    if (!validator.equals(req.body.password, req.body.confirmPassword)) {
      throw Error('Passwords do not match');
    }
    return true;
  }

  static validateLogin(req, res) {
    let email;
    if (req.body.email) {
      email = req.body.email.trim();
    } else {
      throw Error('Email should not be empty');
    }

    if (typeof req.body.email === 'number') {
      throw Error('Wrong format, email should not be an integer');
    }
    if (!validator.isEmail(email)) {
      throw Error('Your email should look like this : example@email.com');
    }
    if (!req.body.password) {
      throw Error('Password is required');
    }
    return true;
  }
}
