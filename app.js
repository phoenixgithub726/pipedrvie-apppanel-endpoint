"use strict";

const express = require("express");
const session = require("express-session");
const lib = require('pipedrive');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { response } = require("express");
let app = express();

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "something crazy",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// app.use(cookieParser());
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1']
// }));
lib.Configuration.apiToken = 'cc638af3ea2783059aae7e32b5b80e34c1f0d1f4';


const oAuthManager = lib.OAuthManager;
lib.Configuration.oAuthClientId = 'de96c7b1775cbd03'; // OAuth 2 Client ID
lib.Configuration.oAuthClientSecret = '96e47bc6458c799b36a4115aafdeabdb65075c81'; // OAuth 2 Client Secret
// lib.Configuration.oAuthRedirectUri = 'http://104.248.2.159:5000/callback'; // OAuth 2 Redirection endpoint or Callback Uri
lib.Configuration.oAuthRedirectUri = 'http://localhost:5000/callback'; // OAuth 2 Redirection endpoint or Callback Uri


// app.get('/', async (req, res) => {
//   if (req.session.token !== null && req.session.token !== undefined) {
//       // token is already set in the session
//       // now make API calls as required
//       // client will automatically refresh the token when it expires and call the token update callback
//       const user = await lib.UsersController.getCurrentUserData();
//       console.log("user data", user)
//       res.json(user);
//   } else {
//       const authUrl = oAuthManager.buildAuthorizationUrl();
//       console.log(authUrl)
//       res.redirect(authUrl);
//   }
// });

app.get('/callback', (req, res) => {
  const authCode = req.query.code;
  const promise = oAuthManager.authorize(authCode);
  console.log(authCode, promise)

  promise.then(() => {
      req.session.token = lib.Configuration.oAuthToken;
      res.redirect('/');
  }, (exception) => {
    console.error(exception)
      res.redirect('/error')
      // error occurred, exception will be of type lib/Exceptions/OAuthProviderException
  });
});
app.get("/error", function  (req, res) {
  try {
    res.send('<a href="/">Try again</a>');  
  } catch (error) {
    res.json(error);
  }
});
app.get("/", async function  (req, res) {
  res.json({"res":"test result"})
  // try {
  //   const user = await lib.UsersController.getCurrentUserData();
  //   res.json(user);
  //   // res.send('<a href="/connect">Connect to Xero</a>');  
  // } catch (error) {
  //   res.json(error);
  // }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Your PiepDrive EndPoint basic public app is running at :" + PORT);
});
