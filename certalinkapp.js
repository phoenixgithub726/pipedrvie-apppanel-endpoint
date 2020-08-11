"use strict";

const express = require("express");
const session = require("express-session");

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

const lib = require("pipedrive");
const config = require("./config");
lib.Configuration.apiToken = config.PIPEDRIVE.API_TOKEN;

const oAuthManager = lib.OAuthManager;
lib.Configuration.oAuthClientId = config.PIPEDRIVE.CLIENT_ID;
lib.Configuration.oAuthClientSecret = config.PIPEDRIVE.SECRET_ID;
// lib.Configuration.oAuthRedirectUri = 'http://104.248.2.159:5000/callback'; // OAuth 2 Redirection endpoint or Callback Uri
lib.Configuration.oAuthRedirectUri = config.PIPEDRIVE.REDIRECT_URI;

app.get("/", async function (req, res) {
  /**
   * @Json Strucutre
   * {
    "type": "array",
    "items": {
      "type": "object",
      "required": [
        "oustand",
        "overdue"
      ],
      "properties": {
        "header": {
          "$ref": "#/definitions/header"
        },
        "oustand": {
          "$ref": "#/definitions/text"
        },
        "overdue": {
          "$ref": "#/definitions/text"
        }
      }
    }
  }
   *  Sample pipedrive app panel Json data structure
      Sample Response
   */
  const response = {
    data: [
      { header: "AccountsReceivable", oustand: "1540.0", overdue: "1540.0" },
      { header: "AccountsPayable", oustand: "0.0", overdue: "0.0" },
    ],
  };
  console.log(response);
  res.json(response);
});
app.get("/pipedrive/callback", function (req, res, next) {
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


const xero_node = require("xero-node");
const xero = new xero_node.XeroClient({
  clientId: config.XERO.CLIENT_ID,
  clientSecret: config.XERO.SECRET_ID,
  redirectUris: [config.XERO.REDIRECT_URI],
  scopes: config.XERO.SCOPE.split(" "),
});

const Contacts = require('./utils/contacts');

app.get("/xero", async function (req, res, next) {
  try {
    let consentUrl = await xero.buildConsentUrl();
    // consentUrl.gotOptions.retry.maxRetryAfter = 10000;
    // consentUrl.gotOptions.gotTimeout.request = 10000;

    console.log("constentURL--->", consentUrl);
    res.redirect(consentUrl);

    // let data = Contacts.getBalanceData("")
    // console.log("response data after formate--->", data)
    // res.json(data)
  } catch (err) {
    let balances = [
      { header: "AccountsReceivable", oustand: "Failed in Xero Page", overdue: "Failed in Xero Page" },
      { header: "AccountsReceivable", oustand: "Connection Failed", overdue: "Connection Failed" },
    ];
    res.json({data:balances})
    // res.send("Sorry, something went wrong");
  }
});
app.get("/xero/callback", async function (req, res, next) {
// app.get("/callback", async function (req, res, next) {
  try {
    /**
       *Call apiCallback function with the response url which returns a tokenSet
        you can save in your datastore for future calls.
        The tokenSet can also be accessed from the client as xero.readTokenSet()
       */
    let tokenSet = await xero.apiCallback(req.url);
    // console.log("tokenset", tokenSet);
    const accessToken = await xero.readTokenSet();
    // console.log("accessToken", accessToken);
    // accessToken and tokenSet is same

    req.session.tokenSet = tokenSet;
    req.session.accessToken = accessToken;
    // console.log("accessToken", accessToken);
    /**
 *      the updatedTenants function
        will query & nest the additional orgData results
        in your xeroClient under each connection/tenant object
        and return the array of tenants.
        This requires accounting.settings scope because
        updateTenants calls the organisation endpoint.
 */
    await xero.updateTenants();
    // req.session.xeroTenantId = xero.tenantIds[0];
    req.session.xeroTenantId = xero.tenantIds;

    res.redirect("/contacts");
  } catch (error) {
    console.error(error);
    res.redirect("/xero");
    // let balances = [
    //   { header: "AccountsReceivable", oustand: "Failed in Callback", overdue: "Failed in Callback" },
    //   { header: "AccountsReceivable", oustand: "Connection Failed", overdue: "Connection Failed" },
    // ];
    // res.json({data:balances})
  }
});

/**
 * Get Contacts From Xero
 */


app.get("/contacts", async function (req, res) {
  try {
    req.session.allTenants = xero._tenants;
    req.session.activeTenant = xero._tenants[0];
    

    // const response = await xero.accountingApi.getContacts(
    //   xero._tenants[0].tenantId
    // );
    const response = await xero.accountingApi.getContacts(
      xero._tenants[0].tenantId, undefined,  'name = "Apex Wiring Solutions Pty Ltd"'
    );
    console.log("_tenants[0]", xero._tenants[0].tenantName)

    const data = Contacts.getBalanceData(response.body.contacts)
    console.log("responsedata before formate--->", response.body.contacts)
    console.log("responsedata after formate--->", data)
    res.json(data)
    // res.json({_tenants:xero._tenants[0], contacts: response.body});
  } catch (err) {
    let balances = [
      { header: "AccountsReceivable", oustand: "Failed in AccountingApi", overdue: "Failed in AccountingApi" },
      { header: "AccountsReceivable", oustand: "Connection Failed", overdue: "Connection Failed" },
    ];
    res.json({data:balances})

    // res.send("Sorry, something went wrong");
  }
});

app.get("/error", function (req, res) {
  try {
    res.send('<a href="/">Try again</a>');
  } catch (error) {
    res.json(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(
    "Your PiepDrive EndPoint basic public app is running at :" + PORT
  );
});
var timeout = require('connect-timeout'); //express v4
app.use(timeout(12000));