var bcrypt = require('bcrypt');

var accounts = {};

for (k in process.env) {
  if (k.slice(0, 5) === 'PASS_') {
    accounts[k.slice(5)] = process.env[k];
  };
};

module.exports = {
  verify: function(username, pass) {
    return new Promise(function(resolve, reject) {
      var hash = accounts[username];

      if (!hash) return reject(new Error('Invalid username'));

      bcrypt.compare(pass, hash, function(err, res) {
        if (err) return reject(err);
        if (!res) return reject(new Error('Invalid password'));
        return resolve(res);
      });
    });
  },
  hash: function(pass) {
    return new Promise(function(resolve, reject) {
      bcrypt.hash(pass, 10, function(err, hash) {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  }
};
