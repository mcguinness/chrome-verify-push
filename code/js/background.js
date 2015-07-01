;(function() {

  var qrcode = require('zxing');
  var Authenticator = require('./modules/authenticator');
  var factor = new Authenticator();

  var notifications = {};

  var captureQrCode = function(tab, left, top, width, height) {
    chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, function (dataUrl) {
        var qrImage = new window.Image();
        qrImage.src = dataUrl;

        var captureCanvas = document.getElementById('__okta_captureCanvas__');
        if (!captureCanvas) {
            captureCanvas = document.createElement('canvas');
            captureCanvas.id = '__okta_captureCanvas__';
            document.body.appendChild(captureCanvas);
        }
        captureCanvas.width = width;
        captureCanvas.height = height;
        captureCanvas.getContext('2d').drawImage(qrImage, left, top, width, height, 0, 0, width, height);
        var qrDataUrl = captureCanvas.toDataURL();
        console.log('Captured QRCode: %s', qrDataUrl);

        qrcode.decode(qrDataUrl, function(err, result) {
          if (err !== null) {
            chrome.notifications.create(null, {
              type: 'basic',
              title: 'Unable to Enroll Okta Verify Push!',
              message: err,
              iconUrl: '/images/mfa-okta-verify.png'
            });
          } else {
            console.log('Decoded QRCode: %s', result);
            factor.enrollProtocol(result)
              .then(function(model) {
                chrome.notifications.create(null, {
                  type: 'basic',
                  title: 'Okta Verify Push Enrolled',
                  message: 'Successfully enrolled factor for ' + model.get('login'),
                  iconUrl: '/images/mfa-okta-verify.png'
                });
              });
          }
        });
    });
  };


  chrome.gcm.onMessage.addListener(function(message) {
    console.log(message);

    notifications[message.data.transactionId] = message.data;

    var items = [
      { title: "Time:", message: new Date(Date.parse(message.data.transactionTime)).toString() },
      { title: "Server:", message: message.data.server },
      { title: "Device:", message: message.data.clientBrowser + ' ' + message.data.clientOS },
      { title: "IP Address:", message: message.data.clientIP }
    ];

    if (message.data.clientLocation) {
      items.push({ title: "Location:", message: message.data.clientLocation });
    }

    chrome.notifications.create(message.data.transactionId, {
      type:    'list',
      iconUrl: '/images/mfa-okta-verify.png',
      title:   message.data.subject,
      message: message.data.userDisplayName + '\n(' + message.data.username + ')',
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
        console.log("Accept: " + item.transactionId);
        factor.verify(item.transactionId, true, item.factorId, item.userId, item.server);
    } else {
        console.log("Reject" + item.transactionId);
        factor.verify(item.transactionId, false, item.factorId, item.userId, item.server);
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
