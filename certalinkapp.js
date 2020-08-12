"use strict";

const express = require("express");
const session = require("express-session");

const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { response } = require("express");
let app = express();

let globalXeroData = {
  data: {
    status: "Disconnected",
    header: "Please Connect to Xero",
  },
  settings: {
    url: "https://server.certalink.com/certalinkapp/",
  },
  external_link: {
    url: "https://server.certalink.com/certalinkapp/xero",
    label: "Connect to Xero",
  },
};

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

app.get("/", function (req, res) {
  res.redirect("/certalinkapp/test");
});

/** this request is for testing redirect and return value to app panel */
app.get("/test", async function (req, res) {
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
    data: {
      status: "Disconnected",
      header: "Please Connect to Xero",
      organization: "select by user",
      company_name: "test company",
      receivable_outstand: "13212",
      receivable_overdue: "35",
      payable_outstand: "3459",
      payable_overdue: "8203",
    },
    settings: {
      url: "https://server.certalink.com/certalinkapp/",
    },
    external_link: {
      url: "https://server.certalink.com/certalinkapp/xero",
      label: "See more data",
    },
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
      res.redirect("/certalinkapp/");
    },
    (exception) => {
      console.error(exception);
      res.redirect("/certalinkapp/error");
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

const Contacts = require("./utils/contacts");

app.get("/xero", async function (req, res, next) {
  try {
    if (req.session.tokenSet) {
      res.redirect("/certalinkapp/contacts");
    } else {
      let consentUrl = await xero.buildConsentUrl();
      console.log("constentURL--->", consentUrl);
      res.redirect(consentUrl);
    }
  } catch (err) {
    const balance = {
      status: "Disconnected",
      header: "Please Connect to Xero",
    };

    res.json({
      data: balance,
      settings: {
        url: "https://server.certalink.com/certalinkapp/",
      },
      external_link: {
        url: "https://server.certalink.com/certalinkapp/xero",
        label: "See more data",
      },
    });
  }
});
app.get("/xero/callback", async function (req, res, next) {
  // app.get("/callback", async function (req, res, next) {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    req.session.tokenSet = tokenSet;
    await xero.updateTenants();
    // req.session.xeroTenantId = xero.tenantIds[0];
    req.session.tokenSet = xero.tokenSet;
    res.redirect("/certalinkapp/contacts");
  } catch (error) {
    console.error(error);
    res.redirect("/certalinkapp/xero");
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
    await xero.setTokenSet(req.session.tokenSet);
    await xero.updateTenants();
    const response = await xero.accountingApi.getContacts(
      xero._tenants[0].tenantId,
      undefined,
      'name = "Apex Wiring Solutions Pty Ltd"'
    );
    const data = Contacts.getBalanceData(response.body.contacts);
    console.log("responsedata after formate--->", data);
    globalXeroData = {
      data: data,
      settings: {
        url: "https://server.certalink.com/certalinkapp/",
      },
      external_link: {
        url: "https://server.certalink.com/certalinkapp/xero",
        label: "Connect to Xero",
      },
    };

    res.json(globalXeroData);
  } catch (err) {
    globalXeroData = {
      data: {
        status: "Disconnected",
        header: "Please Connect to Xero",
      },
      settings: {
        url: "https://server.certalink.com/certalinkapp/",
      },
      external_link: {
        url: "https://server.certalink.com/certalinkapp/xero",
        label: "Connect to Xero",
      },
    };
    res.json(globalXeroData);
  }
});
app.get("/response", function (req, res) {
  res.json(globalXeroData);
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
var timeout = require("connect-timeout"); //express v4
app.use(timeout(12000));
