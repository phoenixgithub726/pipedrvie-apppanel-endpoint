"use strict";
const {TokenSet} = require ('openid-client');
class Auth {
  /**
   * @summary Parse csv string to dict
   * @param {string} auth
   * @return dictionary
   */

  static  authenticationData(req, _res) {
    return {
      decodedIdToken: req.session.decodedIdToken,
      tokenSet: req.session.tokenSet,
      decodedAccessToken: req.session.decodedAccessToken,
      accessTokenExpires: Auth.timeSince(req.session.decodedAccessToken),
      allTenants: req.session.allTenants,
      activeTenant: req.session.activeTenant,
    };
  }
  static timeSince(token) {
    if (token) {
      const timestamp = token["exp"];
      const myDate = new Date(timestamp * 1000);
      return myDate.toLocaleString();
    } else {
      return "";
    }
  }
}
module.exports = Auth;
