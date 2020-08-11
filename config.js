'use strict';
const CONSTANT = {
    PRINT_LOG: 1,
    PRINT_WARN: 2,
    PRINT_ERROR: 4,
    PRINT_ALL: 7,
    PRINT_NONE: 0
};
exports.CONSTANT = CONSTANT;

exports.CONFIG = {
    VERSION: '0.0.1',
    PORT: '5000',
    PRINT: CONSTANT.PRINT_ALL,
    CLIENT_ID : '95E3BA15DAFE4C9D86A54A1EB9AC9E23',
    CLIENT_SECRET : 'MQ0CeW3TyFX8l8xhE0iw-NF4RuiMJLSNtXSWHCURDOCtO8Ok',
    REDIRECT_URI : 'http://localhost:5000/callback',
    XTID : 'x30pipedriveapppanel',
    SCOPES : 'offline_access openid profile email accounting.transactions accounting.transactions.read accounting.reports.read accounting.journals.read accounting.settings accounting.settings.read accounting.contacts accounting.contacts.read accounting.attachments accounting.attachments.read files files.read assets assets.read projects projects.read payroll.employees payroll.payruns payroll.payslip payroll.timesheets payroll.settings'
};

const PIPEDRIVE = {
    API_TOKEN : "cc638af3ea2783059aae7e32b5b80e34c1f0d1f4",
    CLIENT_ID : "de96c7b1775cbd03",
    SECRET_ID : "96e47bc6458c799b36a4115aafdeabdb65075c81",
    REDIRECT_URI : "http://server.certalink.com/certalinkapp/pipedrive/callback" 
}
    // REDIRECT_URI = "http://localhost:5000/pipedrive/callback"; 

exports.PIPEDRIVE = PIPEDRIVE;

const XERO = {
    CLIENT_ID : "5BEC9190E27E4831AC4D69FCF14FA5B3",
    SECRET_ID : "DPEBcmukOg2Mr57Eq2C9YaSNdxwfccwXoNqCy2J5fISTrhJx",
    REDIRECT_URI : "https://server.certalink.com/certalinkapp/xero/callback",
    SCOPE : "offline_access openid profile email accounting.transactions accounting.transactions.read accounting.reports.read accounting.journals.read accounting.settings accounting.settings.read accounting.contacts accounting.contacts.read accounting.attachments accounting.attachments.read files files.read assets assets.read projects projects.read payroll.employees payroll.payruns payroll.payslip payroll.timesheets payroll.settings"
}
    // REDIRECT_URI = "http://localhost:5000/callback"; // 

exports.XERO = XERO;
