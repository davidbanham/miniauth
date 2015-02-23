var bcrypt = require('bcrypt');

var accounts = {};

for (k in process.env) {
  if (k.slice(0, 5) === 'PASS_') {
    accounts[k.slice(5)] = process.env[k];
  };
};

module.exports = {
  verify: function(username, pass, cb) {
    var hash = accounts[username];

    if (!hash) return cb(new Error('Invalid username'));

    bcrypt.compare(pass, hash, function(err, res) {
      if (err) return cb(err);
      if (!res) return cb(new Error('Invalid password'));
      return cb(null, res);
    });
  },
  hash: function(pass, cb) {
    bcrypt.hash(pass, 10, cb);
  }
};
