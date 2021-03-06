var test = require('blue-tape');
var tapSpec = require('tap-spec');
var bcrypt = require('bcrypt');

var rando = function() {
  return Math.floor(Math.random() * (1 << 24)).toString(16);
};

var password = rando();

var user = {
  name: rando(),
  hash: bcrypt.hashSync(password, 10)
}

process.env['PASS_'+user.name] = user.hash;
process.env['PASS_'+rando()] = rando();

var auth = require('./index.js');

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test('should have a verify method', function(t) {
  t.ok(auth.verify);
  t.end();
});

test('should have a hash method', function(t) {
  t.ok(auth.hash);
  t.end();
});

test('should pass a valid pair', function(t) {
  return auth.verify(user.name, password);
});

test('should fail an invalid password', function(t) {
  return auth.verify(user.name, rando()).then(t.fail).catch(function(err) {
    t.equal(err.message, 'Invalid password');
  });
});

test('should fail an invalid username', function(t) {
  return auth.verify(rando(), password).then(t.fail).catch(function(err) {
    t.equal(err.message, 'Invalid username');
  });
});
