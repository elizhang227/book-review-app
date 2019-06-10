const chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised).should();

const User = require('../models/users');

describe('Users model tests', () => {

});