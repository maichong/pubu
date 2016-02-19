/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-19
 * @author Liang <liang@maichong.it>
 */

'use strict';

const request = require('request');
const instances = {};

/**
 *
 * @param config
 * @constructor
 */
function Pubu(config) {
  this.init(config);
}

/**
 * @param {string} name
 * @returns {Pubu}
 */
Pubu.getInstance = function (name) {
  if (!instances[name]) {
    instances[name] = new Pubu();
  }
  return instances[name];
};

Pubu.init = function (config) {
  config || (config = {});
  if (typeof config == 'string') {
    config = {url: config};
  }

  this._url = config.url || this._url || '';
  this._user = config.displayUser || this._user || {};

  return this;
};

/**
 * send message
 * @param {String} text
 * @param {Array|Object} atts [optional]
 * @param {ReadStream} file [optional]
 * @returns {Promise}
 */
Pubu.post = function (text, atts, file) {
  if (typeof atts == 'object') {
    if (!atts.length) {
      atts = [atts];
    }
  }

  let url = this._url;

  let form = {
    text: text,
    attachments: atts || [],
    displayUser: this._user
  };

  if (file) {
    form.file = file;
  }

  return new Promise(function (resolve, reject) {
    request.post({
      url: url,
      form: form
    }, function (error, res, body) {
      if (error) {
        return reject(error);
      }
      let json = JSON.parse(body);
      resolve(json);
    });
  });
};

/**
 * send code snippet
 * @param name
 * @param code
 * @param type
 * @returns {Promise}
 */
Pubu.code = function (name, code, type) {
  let url = this._url;

  let form = {
    name: name,
    text: name,
    snippet: {
      code: code,
      type: type
    },
    displayUser: this._user
  };

  return new Promise(function (resolve, reject) {
    request.post({
      url: url,
      form: form
    }, function (error, res, body) {
      if (error) {
        return reject(error);
      }
      let json = JSON.parse(body);
      resolve(json);
    });
  });
};

module.exports = Pubu.prototype = Pubu.default = Pubu;
Pubu.call(Pubu);
