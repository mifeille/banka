import validator from 'validator';

export default class validateAcc {
  static validateAccount(req, res) {
    if (validator.isEmpty(req.body.type)) {
      throw Error('The bank account type is required');
    }
    if (req.body.type !== 'savings' && req.body.type !== 'current') {
      throw Error('The bank account type should be \'savings\' or \'current\'');
    } else {
      return true;
    }
  }
}
