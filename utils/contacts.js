/**
 * Sample Json Structure
 * 
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
 */
/**
 * Sample Json Value
 * const response = {
 *  data:[
 *    { 
 *      header: "AccountsReceivable", 
        oustand: '1540.0', 
        overdue: '1540.0' 
      },
      {
        header: "AccountsPayable",
        oustand: '0.0',
        overdue: '0.0',
      },
 *  ]
 * }
 */

// const { json } = require("express");

/**
 * Sample Input Json Data
 */

"use strict";
const contacts = {
  contactID: "bc80f243-9443-4fda-8704-41f94790d8f1",
  accountNumber: "CUST100",
  contactStatus: "ACTIVE",
  name: "Apex Wiring Solutions Pty Ltd",
  firstName: "Simon",
  lastName: "Waldren",
  emailAddress: "simon@apexwiringsolutions.com",
  contactPersons: [],
  bankAccountDetails: "",
  addresses: [
    {
      addressType: "STREET",
      addressLine1: "Suite 11/296 Bayside Rd",
      addressLine2: "",
      addressLine3: "",
      addressLine4: "",
      city: "CHELTENHAM",
      region: "VIC",
      postalCode: "3192",
      country: "",
      attentionTo: "",
    },
    {
      addressType: "POBOX",
      addressLine1: "Suite 11/296 Bayside Rd",
      addressLine2: "",
      addressLine3: "",
      addressLine4: "",
      city: "CHELTENHAM",
      region: "VIC",
      postalCode: "3192",
      country: "",
      attentionTo: "",
    },
  ],
  phones: [
    {
      phoneType: "DDI",
      phoneNumber: "",
      phoneAreaCode: "",
      phoneCountryCode: "",
    },
    {
      phoneType: "DEFAULT",
      phoneNumber: "",
      phoneAreaCode: "",
      phoneCountryCode: "",
    },
    {
      phoneType: "FAX",
      phoneNumber: "",
      phoneAreaCode: "",
      phoneCountryCode: "",
    },
    {
      phoneType: "MOBILE",
      phoneNumber: "",
      phoneAreaCode: "",
      phoneCountryCode: "",
    },
  ],
  isSupplier: false,
  isCustomer: true,
  updatedDateUTC: "2020-07-10T06:43:34.840Z",
  contactGroups: [],
  balances: {
    accountsReceivable: { outstanding: 1540, overdue: 1540 },
    accountsPayable: { outstanding: 0, overdue: 0 },
  },
  hasAttachments: false,
  hasValidationErrors: false,
};

class Contacts {
  /**
   * @summary Parse csv string to dict
   * @param {json} data
   * @return {json} data
   *
   * @sample input value is contacts
   *
   * @exmpale return value:
   *
   */
  static getBalanceData(contactList) {
    // const balances = [
    //   { header: "AccountsPayable", oustand: "Connection Failed", overdue: "Connection Failed" },
    //   { header: "AccountsReceivable", oustand: "Connection Failed", overdue: "Connection Failed" },
    // ];
    const balance = {
      status: "Connected",
      header: "Refresh Token to Update the Data"
    };
    if (contactList.length == 0) {
      console.error("No contact list");
      return { data: balance };
    }
    const contact = contactList[0];
    if (contact.balances) {
      /** check if the payable info exist in json */
      console.log("contact.balances", contact.balances);
      if (contact.balances.accountsPayable) {
        console.log(
          "response.balances.accountsPayable.outstanding",
          contact.balances.accountsPayable.outstanding
        );
        balance.payable_outstand = contact.balances.accountsPayable.outstanding;
        balance.payable_overdue = contact.balances.accountsPayable.overdue;
      }
      /** check if the payable info exist in json */
      if (contact.balances.accountsReceivable) {
        balance.receivable_outstand = contact.balances.accountsReceivable.outstanding;
        balance.receivable_overdue = contact.balances.accountsReceivable.overdue;
      }
    }
    return { data: balance };
  }
}

module.exports = Contacts;
