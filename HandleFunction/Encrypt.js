var crypto = require('crypto');
const {hashKey} = require('../constants/keys')
const encrypt = (pass)=>{
    var mykey = crypto.createCipher('aes-128-cbc', hashKey);
    var mystr = mykey.update(pass, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr
}

module.exports = {
    encrypt
}