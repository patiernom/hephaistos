"use strict";

let R = require('ramda');

let filterByStatus = R.curry((httpResult, status, operation) => operation(httpResult.status, status));

let eq = (arg0, arg1) => arg0 === arg1;
let notEq = (arg0, arg1) => arg0 !== arg1;

let statusEqual = filterByStatus(R.__, R.__, eq);
let statusNotEqual = filterByStatus(R.__, R.__, notEq);

module.exports = {
    NOT_OK: statusNotEqual(R.__, 200),
    OK: statusEqual(R.__, 200),
    FORBIDDEN: statusEqual(R.__, 403),
    BAD_REQUEST: statusEqual(R.__, 400),
    NOT_FOUND: statusEqual(R.__, 404)
};