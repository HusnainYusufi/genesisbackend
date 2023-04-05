var crypto = require('crypto');
const { hashKey } = require('../constants/keys')

const decrypt = (pass) => {
    var mykey = crypto.createDecipher('aes-128-cbc', hashKey);
    var mystr = mykey.update(pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

module.exports={
    decrypt
}