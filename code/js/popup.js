;(function() {

    var $ = require('jquery');
    var url = require('url');
    var Authenticator = require('./modules/authenticator');

    $(document).ready(function() {

      $('#qr').click(function() {
        chrome.tabs.query({
            active : true,
            lastFocusedWindow : true
        }, function (tabs) {
            var tab = tabs[0];
            console.log("send message");
            chrome.tabs.sendMessage(tab.id, {
                action : 'capture'
            }, function (result) {
                if (result !== 'beginCapture') {
                  console.log("capture failed");
                } else {
                    window.close();
                }
            });
        });
      });

      $('#enroll').click(function() {
        var inputUrl = $('#url').val();
        if (inputUrl) {
          var factor = new Authenticator();
          var urlParts = url.parse(inputUrl, true);
          factor.enroll(urlParts.query.f, urlParts.query.s, urlParts.query.t)
            .then(function(resp) {
              console.log(resp);
            })
            .catch(function(resp) {
              console.log(resp);
            });
        }
        console.log('enrolled');
      });
    });
})();
