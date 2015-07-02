var express = require('express');
var router = express.Router();
var app = require('../app');
var pwd = require('pwd');

/*
This is a request handler for loading the main page. It will check to see if
a user is logged in, and render the index page either way.
*/
router.get('/', function(request, response, next) {

  var username;
  var password;
  var user_id;

  if (request.cookies.username) {
    username = request.cookies.username;
  } else {
    username = null;
  }

  //render the index page.  
  var database = app.get('database');
  database('tweets').select().where({'username' : username})
    .then(function(results) {
      response.render('index', 
      { title: 'Tweeter', username: username, tweets: results,  }
      );
    });
});

// Register function.  Creates new user.
router.post('/register', function(request, response) {

  var username = request.body.username,
      password = request.body.password,
      password_confirm = request.body.password_confirm,
      database = app.get('database');
      
  // // To prevent username duplication
  // database('users').select().where({'username' : username})
  //   .then(function(results) {    
  //       if (password === password_confirm)  {
  //         response.cookie('username', username);
  //         // response.cookie('user_id', user_id);
  //         response.cookie('password', password);
  //         response.redirect('/');
  //         } else {
  //           response.render('index', {
  //             title: 'Tweeter',
  //             user: null,
  //             error: "User already exists.  Pick another name"
  //           });
  //         } else {
  //           response.render('index', {
  //             title: 'Tweeter',
  //             user: null,
  //             error: "Password didn't match confirmation"
  //           });
  //         }  
  //     });
  
  // To create hash   
  pwd.hash(password, function(err,salt,hash) {
    var stored = {username:username, salt:salt, hash:hash};
    console.log(stored);
    
    database('users').insert(stored) 
      .then(function(){
        response.cookie('username', username),
        response.redirect('/');
    });  
  })
});

// Login function 
router.post('/login', function(request, response) {

  var username = request.body.username,
      password = request.body.hash,
      database = app.get('database');

  database('users').where({'username': username}).then(function(records) {
    if (records.length === 0) {
        response.render('index', {
          title: 'Tweeter',
          user: null,
          error: "No such user"
        });
    } else {
      var user = records[0];
      
      if (user.password === password) {
          response.cookie('username', username);
          response.redirect('/');
    } else {
        response.render('index', {
          title: 'Tweeter',
          user: null,
          error: "Password incorrect"
        });
      }
    }
  });
});

/*Creates a tweet table*/
router.post('/tweet', function(request, response){
  var tweet = request.body.tweet;
  // console.log(tweet);
  // var user_id = request.cookies.user_id;
  var username = request.cookies.username;
  database = app.get('database');
  database('tweets').insert({
    tweet: tweet,
    // user_id: user_id,
    username: username
  }).then(function(){
    response.redirect('/');
    });
});

/*Logout and clear cookies*/
router.post('/logout', function(request, response){
  // console.log('clear my cookies');
  response.clearCookie('username');
  response.clearCookie('password');
  response.clearCookie('user_id');
  response.redirect('/');
});

module.exports = router;
