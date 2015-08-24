;(function() {

    var $ = require('jquery');
    var Authenticator = require('./modules/authenticator');

    $(document).ready(function() {

      $('#qr').click(function() {
        chrome.tabs.query({
          active : true,
          lastFocusedWindow : true
        },function (tabs) {
          var tab = tabs[0];
          console.log('sending capture message to %O', tab);
          chrome.tabs.sendMessage(tab.id, {
              action : 'capture'
          });
        });
      });

      $('#enroll').click(function() {
        var inputUrl = $('#url').val();
        if (inputUrl) {
          //html decode
          inputUrl = $("<div />").html(inputUrl).text();

          var factor = new Authenticator();
          factor.enrollWithUrl(inputUrl)
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
