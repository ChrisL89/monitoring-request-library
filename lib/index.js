'use strict';


const rp = require('request-promise');
const _ = require('lodash');


function MonitoringRequest (endpoint) {
  if (!(this instanceof MonitoringRequest)) {
    return new MonitoringRequest(endpoint);
  }
  this.endpoint = endpoint;
};

const fn = MonitoringRequest.prototype;

fn.withAlertType = function (type) {
  this.type = type;
  return this;
};

fn.withMessage = function (message) {
  this.message = message;
  return this;
};

fn.withComponent = function (component) {
  this.component = component;
  return this;
};


fn.withAlertCode = function (alertCode) {
  this.alertCode = alertCode;
  return this;
};


/**
 * Setup device Info
 * @param deviceInfo
 *
 *  let deviceInfo = {
 *      venueId:"1",
 *      terminalId:"2",
 *      deviceId:"3",
 *      deviceType:"KENO",
 *      wageringId: "4"
 *  };
 */
fn.withDeviceInfo = function (deviceInfo) {
  this.deviceInfo = deviceInfo;
  return this;
};


/**
 * Send request to Monitoring Web Service
 */
fn.sendAlert = function () {

  const payload = {
    type:       this.type,
    message:    this.message,
    component:  this.component,
    alertCode:  this.alertCode,
    timestamp:  Date.now(),
    deviceInfo: {
      venueId:      this.deviceInfo.venueId,
      terminalId:   this.deviceInfo.terminalId,
      deviceId:     this.deviceInfo.deviceId,
      deviceType:   this.deviceInfo.deviceType,
      wageringId:   this.deviceInfo.wageringId,
    },
  };

  const filtered_payload = _.omitBy(payload, _.isNil);

  const options = {
    method: 'POST',
    uri: this.endpoint,
    body: filtered_payload,
    json: true
  };

  //Process post call
  rp(options)
    .then(function (parsedBody) {
      console.log(parsedBody);
    })
    .catch(function (err) {
      //Post failed response
      console.log(`Failed request: ${err}`);
    });
};


/**
 * This is to set payload for a testing call function
 */
fn.withPayload = function (payload) {
  this.payload = payload;
  return this;
};


/**
 * This is a test call just to verify we can send rest api call to geo-transaction service.
 */
fn.addPlaceBetTransaction = function () {
  const options = {
    method: 'POST',
    uri: this.endpoint,
    body: this.payload,
    json: true
  };

  //Process post call
  rp(options)
    .then(function (parsedBody) {
      console.log(parsedBody);
    })
    .catch(function (err) {
      //Post failed response
      console.log(`Failed request: ${err}`);
    });
};


module.exports = MonitoringRequest;
