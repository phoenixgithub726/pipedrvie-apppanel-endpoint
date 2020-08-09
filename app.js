"use strict";

const express = require("express");
const session = require("express-session");
const lib = require('pipedrive');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
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
console.log(lib)
app.get("/", async function  (req, res) {
  try {
    const user = await lib.UsersController.getCurrentUserData();
    res.json(user);
    // res.send('<a href="/connect">Connect to Xero</a>');  
  } catch (error) {
    res.json(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Your Xero basic public app is running at localhost:" + PORT);
});
