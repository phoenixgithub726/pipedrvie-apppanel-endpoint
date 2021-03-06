"use strict";

const express = require("express");
const session = require("express-session");
const lib = require("pipedrive");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
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
lib.Configuration.apiToken = "cc638af3ea2783059aae7e32b5b80e34c1f0d1f4";

const oAuthManager = lib.OAuthManager;
lib.Configuration.oAuthClientId = "de96c7b1775cbd03"; // OAuth 2 Client ID
lib.Configuration.oAuthClientSecret =
  "96e47bc6458c799b36a4115aafdeabdb65075c81"; // OAuth 2 Client Secret
// lib.Configuration.oAuthRedirectUri = 'http://104.248.2.159:5000/callback'; // OAuth 2 Redirection endpoint or Callback Uri
lib.Configuration.oAuthRedirectUri = "http://localhost:5000/pipedrive/callback"; // OAuth 2 Redirection endpoint or Callback Uri

// app.get('/', async (req, res) => {
//   if (req.session.token !== null && req.session.token !== undefined) {
//       // token is already set in the session
//       // now make API calls as required
//       // client will automatically refresh the token when it expires and call the token update callback
//       const user = await lib.UsersController.getCurrentUserData();
//       console.log("user data", user.data)
//       res.json(user);
//   } else {
//       const authUrl = oAuthManager.buildAuthorizationUrl();
//       console.log(authUrl)
//       res.redirect(authUrl);
//   }
// });

app.get("/pipedrive/callback", (req, res) => {
  const authCode = req.query.code;
  const promise = oAuthManager.authorize(authCode);
  console.log(authCode, promise);

  promise.then(
    () => {
      req.session.token = lib.Configuration.oAuthToken;
      res.redirect("/");
    },
    (exception) => {
      console.error(exception);
      res.redirect("/error");
      // error occurred, exception will be of type lib/Exceptions/OAuthProviderException
    }
  );
});
app.get("/error", function (req, res) {
  try {
    res.send('<a href="/">Try again</a>');
  } catch (error) {
    res.json(error);
  }
});
// app.get("/", async function  (req, res) {
app.get("/", async function (req, res) {
  // const response = {
  //   data: {
  //     id: 1,
  //     name: "John",
  //     email: "john.doe@pipedrive.com",
  //     date: "2019-10-01T19:20:11+02:00",
  //   }
  // };
  
//  This is the static sample data for pipedrive app panel.
// This si the app apnel endpoint.
// Now we have to get data from xero and send data with this format 
// let's see the xero works.

  const response = {
    data: [
      { header: "AccountsReceivable", 
        oustand: '1540.0', 
        overdue: '1540.0' 
      },
      {
        header: "AccountsPayable",
        oustand: '0.0',
        overdue: '0.0',
      },
    ],
  };

  // const response ={
  //   data: [
  //     { id: 1, header: "User #1", name: "John", email: "john.doe@pipedrive.com", date: '2019-10-01T19:20:11+02:00' },
  //     { id: 2, header: "User #2", name: "Jane", email: "jane.doe@pipedrive.com", date: null },
  //     { id: 3, header: "User #3", name: "Tim", email: "tim.doe@pipedrive.com", date: '2019-10-01T19:20:11+02:00' }
  //     ]
  // }
  console.log(response)
  res.json(response);
  // try {
  //   const user = await lib.UsersController.getCurrentUserData();
  //   console.log({data: user.data})
  //   res.json({data: user.data});
  //   // res.send('<a href="/connect">Connect to Xero</a>');
  // } catch (error) {
  //   res.json(error);
  // }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(
    "Your PiepDrive EndPoint basic public app is running at :" + PORT
  );
});
