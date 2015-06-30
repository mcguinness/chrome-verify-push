var _         = require('underscore');
var Backbone  = require('backbone');
var IndexedDB = require('backbone-indexeddb');

var database = {
    id: 'OktaVerify',
    description: 'Okta Verify Authenticator',
    migrations: [{
        version: 1,
        migrate: function (transaction, next) {
            var store = transaction.db.createObjectStore('KeyStore');

            store.createIndex('domainIndex', 'domain', {
                unique: false
            });

            store.createIndex('loginIndex', 'login', {
                unique: false
            });

            next();
        }
    }]
};

var KeyStoreEntry = Backbone.Model.extend({
    database: database,
    storeName: 'KeyStore',
    sync: IndexedDB.sync,
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(object, resp, options) {
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverAttrs, options)) { return false; }
        if (success) { success.call(options.context, model, resp, options); }
        model.trigger('sync', model, resp, options);
      };
      var error = options.error;
      options.error = function(resp) {
        if (error) { error.call(options.context, model, resp, options); }
        model.trigger('error', model, resp, options);
      };
      return this.sync('read', this, options);
    },
    generateKeyPair: function() {
      var self = this;
      var _keyPair;

      return new Promise(function(resolve, reject) {
        return window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: {name: "SHA-256"}
          },
          false, // don't extract private key
          ["sign", "verify"]
        )
        .then(function(keyPair) {
          _keyPair = keyPair;
          console.log(keyPair);
          self.set({
            privateKey: keyPair.privateKey,
            publicKey: keyPair.publicKey
          });
          resolve(_keyPair);
        })
        .catch(function(err) {
          reject(err);
        });
      });
    }
});

var KeyStore = Backbone.Collection.extend({
    database: database,
    storeName: 'KeyStore',
    model: KeyStoreEntry,
    sync: IndexedDB.sync
});


module.exports = {
  KeyStoreEntry: KeyStoreEntry,
  KeyStore: KeyStore
};
