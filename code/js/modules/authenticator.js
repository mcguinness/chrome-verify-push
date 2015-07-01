var _         = require('underscore');
var KeyStore  = require('./keystore').KeyStore;
var Base64    = require('js-base64').Base64;
var axios     = require('axios');
var config    = require('./config');
var url       = require('url');

var Base64Url = {
  encode: function (str) {
    return this.escape(Base64.encode(str));
  },
  escape: function (str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
};

var Uint8ArrayBuffer = {
  toUint8Array: function (str) {
      var chars = [];
      for (var i = 0; i < str.length; ++i) {
          chars.push(str.charCodeAt(i));
      }
      return new Uint8Array(chars);
  },
  toBase64: function(u8Arr){
    var CHUNK_SIZE = 0x8000; //arbitrary number
    var index = 0;
    var length = u8Arr.length;
    var result = '';
    var slice;
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return window.btoa(result);
  }
};

var Authenticator = function() {
  this._keyStore = new KeyStore();
};

_.extend(Authenticator.prototype, {

  enrollProtocol: function(enrollUrl) {
    var urlParts = url.parse(enrollUrl, true);
    return this.enroll(urlParts.query.f, urlParts.query.s, urlParts.query.t);
  },

  enroll: function(factorId, baseUrl, activationToken) {
    var self = this;
    return new Promise(function(resolve, reject) {

      var factorModel = new self._keyStore.model({
        id: factorId,
        domain: baseUrl
      });

      return chrome.gcm.register(config.sender_ids, function(registrationToken) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        return factorModel.generateKeyPair()
          .then(function(keyPair) {
            return window.crypto.subtle.exportKey('spki', keyPair.publicKey);
          })
          .then(function(spki) {

            factorModel.set({
              spki: Uint8ArrayBuffer.toBase64(new Uint8Array(spki))
            });

            return {
              profile: {
                udid: registrationToken,
                deviceType: "SmartPhone_Android",
                name: "Google Chrome",
                version: "1.0",
                serial: registrationToken
              },
              _embedded: {
                factors: [
                  {
                    factorType: "push",
                    provider: "OKTA",
                    profile: {
                      deviceToken: registrationToken,
                      keys: [
                        {
                          kty: "PKIX",
                          use: "sig",
                          kid: "default",
                          x5c: [
                            factorModel.get('spki')
                          ]
                        }
                      ]
                    }
                  },
                  {
                    factorType: "token:software:totp",
                    provider: "OKTA"
                  }
                ]
              }
            };
          })
          .then(function(message) {
            console.log('enrolling browser device -> ' + baseUrl);
            console.log(JSON.stringify(message));
            return axios({
              url: baseUrl + '/api/v1/users/me/devices',
              method: 'POST',
              headers: {
                'Authorization': 'OTDT ' + activationToken
              },
              data: message,
              withCredentials: false
            })
            .then(function (resp) {
              console.log(resp);

              factorModel.set({
                login: _.find(resp.data._embedded.factors,  function(factor) {
                          return factor.factorType === 'push';
                        }).profile.credentialId,
                secret: _.find(resp.data._embedded.factors,  function(factor) {
                          return factor.factorType === 'token:software:totp';
                        })._embedded.activation.sharedSecret
              });
              factorModel.save();
              resolve(factorModel);
            })
            .catch(function (resp) {
              console.log(resp);
              reject(resp);
            });
          })
          .catch(function(err) {
            console.log(err);
            reject(err);
          });
      });
    });
  },

  verify: function(txId, approve, factorId, userId, domain) {

    var self = this;
    var factorModel = new self._keyStore.model({id: factorId});

    return new Promise(function(resolve, reject) {
      factorModel.fetch({
        // model, resp, options
        success: function(model) {
          resolve(model);
        },
        error: function(resp) {
          reject(resp);
        }
      });
    })
    .then(function() {
      var timestamp = Math.floor(Date.now() / 1000);
      var payload = {
        iss: factorId,
        sub: userId,
        aud: domain,
        jti: timestamp, // not validated, should be UUID
        iat: timestamp,
        exp: (timestamp + (2 * 60)),
        nbf: (timestamp - (2 * 60)),
        tx: txId,
        result: approve ? 'APPROVE' : 'REJECT'
      };

      // header, typ is fixed value.
      var header = { typ: 'JWT', alg: 'RS256' };
      // create segments, all segment should be base64 string
      var segments = [];
      segments.push(Base64Url.encode(JSON.stringify(header)));
      segments.push(Base64Url.encode(JSON.stringify(payload)));

      return window.crypto.subtle.sign({
          name: "RSASSA-PKCS1-v1_5",
          hash: {name: "SHA-256"}
        },
        factorModel.get('privateKey'),
        Uint8ArrayBuffer.toUint8Array(segments.join('.')))
      .then(function(signature) {
        var base64 = Uint8ArrayBuffer.toBase64(new Uint8Array(signature));
        segments.push(Base64Url.escape(base64));
        return segments.join('.');
      })
      .then(function(jwt) {
        return axios({
          url: domain + '/api/v1/authn/factors/' + factorId + '/transactions/' + txId + '/verify',
          method: 'POST',
          headers: {
            'Authorization': 'SSWS ' + jwt
          },
          data: {
            result: approve ? 'APPROVE' : 'REJECT'
          },
          withCredentials: false
        });
      });
    });
  }
});

module.exports = Authenticator;
