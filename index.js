/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-19
 * @author Liang <liang@maichong.it>
 */

'use strict';

const fetch = require('node-fetch');
const FormData = require('form-data');
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
    config = { url: config };
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

  let headers = {};
  let body;

  if (file) {
    body = new FormData();
    body.append('text', text);
    body.append('attachments', atts);
    body.append('displayUser', this._user);
    body.append('file', file);
  } else {
    headers = {
      'Content-Type': 'application/json'
    };
    body = JSON.stringify({
      text: text,
      attachments: atts || [],
      displayUser: this._user
    });
  }

  return fetch(this._url, {
    method: 'POST',
    headers: headers,
    body: body
  }).then(function (res) {
    return res.json();
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
  let body = {
    name: name,
    text: name,
    snippet: {
      code: code,
      type: type
    },
    displayUser: this._user
  };

  return fetch(this._url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function (res) {
    return res.json();
  });
};

module.exports = Pubu.prototype = Pubu.default = Pubu;

Pubu.call(Pubu);
