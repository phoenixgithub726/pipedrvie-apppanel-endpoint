"use strict";

// import * as fs from "fs";
// import {
//   Account,
//   Accounts,
//   AccountType,
//   Allocation,
//   Allocations,
//   BankTransaction,
//   BankTransactions,
//   BankTransfer,
//   BankTransfers,
//   BatchPayment,
//   BatchPayments,
//   Contact,
//   ContactGroup,
//   ContactGroups,
//   ContactPerson,
//   Contacts,
//   Currency,
//   CurrencyCode,
//   Employees,
//   HistoryRecords,
//   Invoice,
//   Invoices,
//   Item,
//   Items,
//   LineAmountTypes,
//   LineItem,
//   LinkedTransaction,
//   LinkedTransactions,
//   ManualJournal,
//   ManualJournals,
//   Payment,
//   Payments,
//   PaymentServices,
//   Prepayment,
//   PurchaseOrder,
//   PurchaseOrders,
//   Quote,
//   Quotes,
//   Receipt,
//   Receipts,
//   TaxRate,
//   TaxRates,
//   TaxType,
//   TrackingCategories,
//   TrackingCategory,
//   TrackingOption,
//   XeroAccessToken,
//   XeroClient,
//   XeroIdToken,
//   CreditNotes,
//   CreditNote,
//   Employee,
// } from "xero-node";
const xero_node = require("xero-node");

const { CONFIG } = require("../config");
/**
 * Class to implement stripe for get infomation of customers, payment and so on.
 */
class Xero {
  /**
   * @summary Get customer by pipedrive user id.
   * @param {number} userid PipeDrive userid
   * @return {Promise<customer>} If failed in getting customer, it will return null.
   */
  /**
   * It is singleton class who has getInstance() method.
   * You can call the class instance anywhere like this: MailClient.getInstance()
   * The instance class is initialized at the first call.
   */
  static _inst = null;
  static getInstance() {
    if (!Xero._inst) {
        Xero._inst = new Xero();
    }
    return Xero._inst;
  }

  // initialize mail client
  constructor() {
    // if (!client_id || !client_secret || !redirectUrl) {
    //   throw Error('Environment Variables not all set - please check your .env file in the project root or create one!')
    // }
    try {
        this.xero = new xero_node.XeroClient({
          clientId: CONFIG.CLIENT_ID,
          clientSecret: CONFIG.CLIENT_SECRET,
          redirectUris: CONFIG.REDIRECT_URI,
          scopes: CONFIG.SCOPES.split('')
        });
        // console.log('contructor ---------------: ',this.xero)

    //   this.options = CONFIG.MAIL.MAILS[CONFIG.MAIL.CURRENT];
    //   this.transporter = NodeMailer.createTransport(this.options);
    } catch (e) {
      console.error(
        "Xero==> Failed to initialize XERO client. Details: ",
        e
      );
    }
  }

  // Get current mail service configration options
  getOptions = () => {
    // return this.options;
  };
  /**
   * @summary Get customer by pipedrive user id.
   * @param {string} email
   * @return {Promise<customer>} If failed in getting customer, it will return null.
   */

  /**
   * @summary                     Class to retrive customer informations for specific user id.
   * @param {number} id           User id to identity user in pipedrive CRM.
   * @return                      Customer by id
   */

  /**
   * @summary                 Class to create customer in stripe account
   * @param {number} balance  default balance
   * @param {string} email    user email
   * @param {number} userid   Pipedrive user id
   * @return                  new Customer
   */
}

module.exports = Xero;
