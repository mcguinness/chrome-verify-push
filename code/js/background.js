;(function() {
  var qrcode = require('jsqrcode')();
  var Authenticator = require('./modules/authenticator');
  var factor = new Authenticator();

  var notifications = {};

  var captureQrCode = function(tab, left, top, width, height) {
    chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, function (dataUrl) {
        var qr = new window.Image();
        qr.src = dataUrl;

        var captureCanvas = document.getElementById('__ga_captureCanvas__');
        if (!captureCanvas) {
            captureCanvas = document.createElement('canvas');
            captureCanvas.id = '__ga_captureCanvas__';
            document.body.appendChild(captureCanvas);
        }
        captureCanvas.width = width;
        captureCanvas.height = height;
        captureCanvas.getContext('2d').drawImage(qr, left, top, width, height, 0, 0, width, height);
        var qrDataUrl = captureCanvas.toDataURL();
        console.log(captureCanvas);
        console.log(qrDataUrl);
        var result;
        try {
          result = qrcode.decode(captureCanvas);
          console.log('result of qr code: ' + result);
        } catch(e){
          console.log('unable to read qr code');
        }
    });
  };


  chrome.gcm.onMessage.addListener(function(message) {
    console.log(message);

    notifications[message.data.transactionId] = message.data;

    var items = [
      { title: "Time:", message: message.data.transactionTime },
      { title: "Server:", message: message.data.server },
      { title: "Browser:", message: message.data.clientBrowser },
      { title: "OS:", message: message.data.clientOS },
      { title: "IP Address:", message: message.data.clientIP }
    ];

    if (message.data.clientLocation) {
      items.push({ title: "Location:", message: message.data.clientLocation});
    }

    chrome.notifications.create(message.data.transactionId, {
      type:    'list',
      iconUrl: '/images/mfa-okta-verify.png',
      title:   message.data.subject,
      message: message.data.userDisplayName + ' (' + message.data.username + ')',
      contextMessage: message.data.userDisplayName + ' (' + message.data.username + ')',
      items: items,
      buttons: [{
        title: 'Accept',
        iconUrl: '/images/success.png'
      }, {
        title: 'Deny',
        iconUrl: '/images/error.png'
      }]
    });
  });

  chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    var item = notifications[notificationId];
    delete notifications[notificationId];

    if (item && buttonIndex === 0) {
        console.log("Accept");
        factor.verify(item.factorId, item.userId, item.transactionId, item.server);
    }
  });


  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.action === 'position') {
          captureQrCode(sender.tab, message.info.left, message.info.top, message.info.width, message.info.height, message.info.windowWidth);
      } else {
        sendResponse('error');
      }
  });

})();
