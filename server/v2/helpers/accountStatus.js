import validator from 'validator';

export default class validateStatus {
  static validateAccount(req, res) {
    if (!(req.body.status)) {
      throw Error('The bank account status is required');
    }
    if (req.body.status !== 'dormant' && req.body.status !== 'active') {
      throw Error('The bank account status should be \'active\' or \'dormant\'');
    } else {
      return true;
    }
  }
}
