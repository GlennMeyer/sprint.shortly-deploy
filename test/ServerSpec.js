var expect = require('chai').expect;
var request = require('request');

var db = require('../app/config');
// var Users = require('../app/collec/tions/users');
var User = require('../app/models/user');
// var Links = require('../app/collections/links');
var Link = require('../app/models/link');

describe('', function() {
  before(function() {
    // log out currently signed in user
    request('http://127.0.0.1:4568/logout', function(error, res, body) {
      console.log('logging out');
    });

    // delete objects from db so they can be created later for the test
    Link.remove({title : 'Rofl Zoo - Daily funny animal pictures'}).exec();
    User.remove({username : 'Savannah'}).exec();
    User.remove({username : 'Phillip'}).exec();
  });

  it('Shortens links', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:4568/links',
      'json': {
        'url': 'http://www.roflzoo.com/'
      }
    };

    request(options, function(error, res, body) {
      expect(res.body.url).to.equal('http://www.roflzoo.com/');
      done();
    });
  });

  it('Only shortens valid urls, returning a 404 - Not found for invalid urls', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:4568/links',
      'json': {
        'url': 'definitely not a valid url'
      }
    };

    request(options, function(error, res, body) {
      expect(body).to.equal('Not Found');
      done();
    });
  });


  it('New links create a database entry', function(done) {
    Link.findOne({'url' : 'http://www.roflzoo.com/'})
      .exec(function(err,link){
        if (err){
          console.log(error);
        }
        expect(link.url).to.equal('http://www.roflzoo.com/');
        done();
      });
  });

  it('Fetches the link url title', function (done) {
    var foundTitle;
    Link.findOne({'url':'http://www.roflzoo.com'})
      .exec(function(err,link) {
        if (err){
          console.log(err);
        }
        if (link){
          foundTitle = link.title;          
        }
        expect(foundTitle).to.equal('Rofl Zoo - Daily funny animal pictures');
        done();
      });
  });

  it('Returns the same shortened code if attempted to add the same URL twice', function(done) {
    var firstCode, secondCode;
    Link.findOne({'url':'http://www.roflzoo.com'})
      .exec(function(err,link) {
        firstCode = link.code;
        var options = {
          'method': 'POST',
          'uri': 'http://127.0.0.1:4568/links',
          'json': {
            'url': 'http://www.roflzoo.com/'
          }
        };

        request(options, function(error, res, body) {
          secondCode = res.body.code;
          expect(secondCode).to.equal(firstCode);
          done();
        });
      });
  });

  it('Shortcode redirects to correct url', function(done) {
    this.timeout(5000);
    //TOSAVANNAH: wat?
      Link.findOne({'title': 'Rofl Zoo - Daily funny animal pictures'})
      .exec(function(err,link) {
        var sha = link.code;
        var options = { 
          'method': 'GET',
          'uri': 'http://127.0.0.1:4568/' + sha,
          'timeout': 5000
        };

        request(options, function(error, res, body) {
          var currentLocation = res.request.href;
          expect(currentLocation).to.equal('http://www.roflzoo.com/');
          done();
        });
      });
  });


  // /*  Authentication  */
  // // TODO: xit out authentication
  it('Redirects to login page if a user tries to access the main page and is not signed in', function(done) {
    request('http://127.0.0.1:4568/', function(error, res, body) {
      expect(res.req.path).to.equal('/login');
      done();
    });
  });

  it('Redirects to login page if a user tries to create a link and is not signed in', function(done) {
    request('http://127.0.0.1:4568/create', function(error, res, body) {
      expect(res.req.path).to.equal('/login');
      done();
    });
  });

  it('Redirects to login page if a user tries to see all of the links and is not signed in', function(done) {
    request('http://127.0.0.1:4568/links', function(error, res, body) {
      expect(res.req.path).to.equal('/login');
      done();
    });
  });

  it('Signup creates a new user', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:4568/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
      }
    };

    request(options, function(error, res, body) {

        User.findOne({'username': 'Svnh'})
        .exec(function(err,user) {
          expect(user.username).to.equal('Svnh');
          done();
        });
    });
  });

  it('Successful signup logs in a new user', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:4568/signup',
      'json': {
        'username': 'Phillip',
        'password': 'Phillip'
      }
    };

    request(options, function(error, res, body) {
      expect(res.headers.location).to.equal('/');
      request('http://127.0.0.1:4568/logout', function(err, res, body) {
        done();
      });
    });
  });

  it('Logs in existing users', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:4568/login',
      'json': {
        'username': 'Phillip',
        'password': 'Phillip'
      }
    };

    request(options, function(error, res, body) {
      expect(res.headers.location).to.equal('/');
      done();
    });
  });

  // // TODO: What should I do to test for all links? This sends back a string.
  it('Returns all of the links to display on the links page', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:4568/login',
      'json': {
        'username': 'Phillip',
        'password': 'Phillip'
      }
    };

    // enable cookies for login information
    request = request.defaults({jar: true});
    request(options, function(error, res, body) {
      request('http://127.0.0.1:4568/links', function(error, res, body) {
        expect(body).to.include('"title": "Rofl Zoo - Daily funny animal pictures"');
        done();
      });
    });

  });

  it('Users that do not exist are kept on login page', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:4568/login',
      'json': {
        'username': 'Fred',
        'password': 'Fred'
      }
    };

    request(options, function(error, res, body) {
      expect(res.headers.location).to.equal('/login');
      done();
    });
  });
});