!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.oktaVerifyPush||(f.oktaVerifyPush={})).exports=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function() {
  if ( document instanceof window.HTMLDocument === false ) {
    return false;
  }

  var GrayLayout = function() {
    var self = this;

    self.showGrayLayout = function() {
      var grayLayout = document.getElementById('__ga_grayLayout__');
      if (!grayLayout) {
        grayLayout = document.createElement('div');
        grayLayout.id = '__ga_grayLayout__';
        document.body.appendChild(grayLayout);
        var scan = document.createElement('div');
        scan.className = 'scan';
        scan.style.background = 'url(' + chrome.extension.getURL('images/scan.gif') + ') no-repeat center';
        grayLayout.appendChild(scan);
        var captureBox = document.createElement('div');
        captureBox.id = '__ga_captureBox__';
        grayLayout.appendChild(captureBox);
        grayLayout.onmousedown = self.grayLayoutDown.bind(this);
        grayLayout.onmousemove = self.grayLayoutMove.bind(this);
        grayLayout.onmouseup = self.grayLayoutUp.bind(this);
        grayLayout.oncontextmenu = function () {
          var e = event || window.event;
          e.preventDefault();
          return false;
        };
      }
      grayLayout.style.display = 'block';
    };

    self.grayLayoutDown = function(event) {
      var e = event || window.event;
      if (e.button === 1 || e.button === 2) {
        e.preventDefault();
        return false;
      }
      var captureBox = document.getElementById('__ga_captureBox__');
      this.captureBoxLeft = e.clientX;
      this.captureBoxTop = e.clientY;
      captureBox.style.left = e.clientX + 'px';
      captureBox.style.top = e.clientY + 'px';
      captureBox.style.width = '1px';
      captureBox.style.height = '1px';
      captureBox.style.display = 'block';
    };

    self.grayLayoutMove = function(event) {
      var e = event || window.event;
      if (e.button === 1 || e.button === 2) {
        e.preventDefault();
        return false;
      }
      var captureBox = document.getElementById('__ga_captureBox__');
      var captureBoxLeft = Math.min(this.captureBoxLeft, e.clientX);
      var captureBoxTop = Math.min(this.captureBoxTop, e.clientY);
      var captureBoxWidth = Math.abs(this.captureBoxLeft - e.clientX) - 1;
      var captureBoxHeight = Math.abs(this.captureBoxTop - e.clientY) - 1;
      captureBox.style.left = captureBoxLeft + 'px';
      captureBox.style.top = captureBoxTop + 'px';
      captureBox.style.width = captureBoxWidth + 'px';
      captureBox.style.height = captureBoxHeight + 'px';
    };

    self.grayLayoutUp = function(event) {
      var e = event || window.event;
      var grayLayout = document.getElementById('__ga_grayLayout__');
      var captureBox = document.getElementById('__ga_captureBox__');
      var captureBoxLeft = Math.min(this.captureBoxLeft, e.clientX) + 1;
      var captureBoxTop = Math.min(this.captureBoxTop, e.clientY) + 1;
      var captureBoxWidth = Math.abs(this.captureBoxLeft - e.clientX) - 1;
      var captureBoxHeight = Math.abs(this.captureBoxTop - e.clientY) - 1;
      captureBoxLeft *= window.devicePixelRatio;
      captureBoxTop *= window.devicePixelRatio;
      captureBoxWidth *= window.devicePixelRatio;
      captureBoxHeight *= window.devicePixelRatio;
      setTimeout(function () {
        captureBox.style.display = 'none';
        grayLayout.style.display = 'none';
      }, 100);
      if (e.button === 1 || e.button === 2) {
        e.preventDefault();
        return false;
      }
      //make sure captureBox and grayLayout is hidden
      setTimeout(function () {
        self.sendPosition(captureBoxLeft, captureBoxTop, captureBoxWidth, captureBoxHeight);
      }, 200);
      return false;
    };

    self.sendPosition = function (left, top, width, height) {
      chrome.runtime.sendMessage({
        action : 'position',
        info : {
          left : left,
          top : top,
          width : width,
          height : height,
          windowWidth : window.innerWidth
        }
      });
    };
  };

  var layout = new GrayLayout();
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'capture') {
      sendResponse('beginCapture');
      layout.showGrayLayout();
    }
  });

})();

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb2RlL2pzL2NvbnRlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCkge1xuICBpZiAoIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkhUTUxEb2N1bWVudCA9PT0gZmFsc2UgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIEdyYXlMYXlvdXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnNob3dHcmF5TGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZ3JheUxheW91dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdfX2dhX2dyYXlMYXlvdXRfXycpO1xuICAgICAgaWYgKCFncmF5TGF5b3V0KSB7XG4gICAgICAgIGdyYXlMYXlvdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZ3JheUxheW91dC5pZCA9ICdfX2dhX2dyYXlMYXlvdXRfXyc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZ3JheUxheW91dCk7XG4gICAgICAgIHZhciBzY2FuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNjYW4uY2xhc3NOYW1lID0gJ3NjYW4nO1xuICAgICAgICBzY2FuLnN0eWxlLmJhY2tncm91bmQgPSAndXJsKCcgKyBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTCgnaW1hZ2VzL3NjYW4uZ2lmJykgKyAnKSBuby1yZXBlYXQgY2VudGVyJztcbiAgICAgICAgZ3JheUxheW91dC5hcHBlbmRDaGlsZChzY2FuKTtcbiAgICAgICAgdmFyIGNhcHR1cmVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2FwdHVyZUJveC5pZCA9ICdfX2dhX2NhcHR1cmVCb3hfXyc7XG4gICAgICAgIGdyYXlMYXlvdXQuYXBwZW5kQ2hpbGQoY2FwdHVyZUJveCk7XG4gICAgICAgIGdyYXlMYXlvdXQub25tb3VzZWRvd24gPSBzZWxmLmdyYXlMYXlvdXREb3duLmJpbmQodGhpcyk7XG4gICAgICAgIGdyYXlMYXlvdXQub25tb3VzZW1vdmUgPSBzZWxmLmdyYXlMYXlvdXRNb3ZlLmJpbmQodGhpcyk7XG4gICAgICAgIGdyYXlMYXlvdXQub25tb3VzZXVwID0gc2VsZi5ncmF5TGF5b3V0VXAuYmluZCh0aGlzKTtcbiAgICAgICAgZ3JheUxheW91dC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBlID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBncmF5TGF5b3V0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH07XG5cbiAgICBzZWxmLmdyYXlMYXlvdXREb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHZhciBlID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgaWYgKGUuYnV0dG9uID09PSAxIHx8IGUuYnV0dG9uID09PSAyKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGNhcHR1cmVCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnX19nYV9jYXB0dXJlQm94X18nKTtcbiAgICAgIHRoaXMuY2FwdHVyZUJveExlZnQgPSBlLmNsaWVudFg7XG4gICAgICB0aGlzLmNhcHR1cmVCb3hUb3AgPSBlLmNsaWVudFk7XG4gICAgICBjYXB0dXJlQm94LnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyAncHgnO1xuICAgICAgY2FwdHVyZUJveC5zdHlsZS50b3AgPSBlLmNsaWVudFkgKyAncHgnO1xuICAgICAgY2FwdHVyZUJveC5zdHlsZS53aWR0aCA9ICcxcHgnO1xuICAgICAgY2FwdHVyZUJveC5zdHlsZS5oZWlnaHQgPSAnMXB4JztcbiAgICAgIGNhcHR1cmVCb3guc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfTtcblxuICAgIHNlbGYuZ3JheUxheW91dE1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIGUgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICBpZiAoZS5idXR0b24gPT09IDEgfHwgZS5idXR0b24gPT09IDIpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgY2FwdHVyZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdfX2dhX2NhcHR1cmVCb3hfXycpO1xuICAgICAgdmFyIGNhcHR1cmVCb3hMZWZ0ID0gTWF0aC5taW4odGhpcy5jYXB0dXJlQm94TGVmdCwgZS5jbGllbnRYKTtcbiAgICAgIHZhciBjYXB0dXJlQm94VG9wID0gTWF0aC5taW4odGhpcy5jYXB0dXJlQm94VG9wLCBlLmNsaWVudFkpO1xuICAgICAgdmFyIGNhcHR1cmVCb3hXaWR0aCA9IE1hdGguYWJzKHRoaXMuY2FwdHVyZUJveExlZnQgLSBlLmNsaWVudFgpIC0gMTtcbiAgICAgIHZhciBjYXB0dXJlQm94SGVpZ2h0ID0gTWF0aC5hYnModGhpcy5jYXB0dXJlQm94VG9wIC0gZS5jbGllbnRZKSAtIDE7XG4gICAgICBjYXB0dXJlQm94LnN0eWxlLmxlZnQgPSBjYXB0dXJlQm94TGVmdCArICdweCc7XG4gICAgICBjYXB0dXJlQm94LnN0eWxlLnRvcCA9IGNhcHR1cmVCb3hUb3AgKyAncHgnO1xuICAgICAgY2FwdHVyZUJveC5zdHlsZS53aWR0aCA9IGNhcHR1cmVCb3hXaWR0aCArICdweCc7XG4gICAgICBjYXB0dXJlQm94LnN0eWxlLmhlaWdodCA9IGNhcHR1cmVCb3hIZWlnaHQgKyAncHgnO1xuICAgIH07XG5cbiAgICBzZWxmLmdyYXlMYXlvdXRVcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIHZhciBncmF5TGF5b3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19fZ2FfZ3JheUxheW91dF9fJyk7XG4gICAgICB2YXIgY2FwdHVyZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdfX2dhX2NhcHR1cmVCb3hfXycpO1xuICAgICAgdmFyIGNhcHR1cmVCb3hMZWZ0ID0gTWF0aC5taW4odGhpcy5jYXB0dXJlQm94TGVmdCwgZS5jbGllbnRYKSArIDE7XG4gICAgICB2YXIgY2FwdHVyZUJveFRvcCA9IE1hdGgubWluKHRoaXMuY2FwdHVyZUJveFRvcCwgZS5jbGllbnRZKSArIDE7XG4gICAgICB2YXIgY2FwdHVyZUJveFdpZHRoID0gTWF0aC5hYnModGhpcy5jYXB0dXJlQm94TGVmdCAtIGUuY2xpZW50WCkgLSAxO1xuICAgICAgdmFyIGNhcHR1cmVCb3hIZWlnaHQgPSBNYXRoLmFicyh0aGlzLmNhcHR1cmVCb3hUb3AgLSBlLmNsaWVudFkpIC0gMTtcbiAgICAgIGNhcHR1cmVCb3hMZWZ0ICo9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgY2FwdHVyZUJveFRvcCAqPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgIGNhcHR1cmVCb3hXaWR0aCAqPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgIGNhcHR1cmVCb3hIZWlnaHQgKj0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FwdHVyZUJveC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBncmF5TGF5b3V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9LCAxMDApO1xuICAgICAgaWYgKGUuYnV0dG9uID09PSAxIHx8IGUuYnV0dG9uID09PSAyKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy9tYWtlIHN1cmUgY2FwdHVyZUJveCBhbmQgZ3JheUxheW91dCBpcyBoaWRkZW5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnNlbmRQb3NpdGlvbihjYXB0dXJlQm94TGVmdCwgY2FwdHVyZUJveFRvcCwgY2FwdHVyZUJveFdpZHRoLCBjYXB0dXJlQm94SGVpZ2h0KTtcbiAgICAgIH0sIDIwMCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHNlbGYuc2VuZFBvc2l0aW9uID0gZnVuY3Rpb24gKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBhY3Rpb24gOiAncG9zaXRpb24nLFxuICAgICAgICBpbmZvIDoge1xuICAgICAgICAgIGxlZnQgOiBsZWZ0LFxuICAgICAgICAgIHRvcCA6IHRvcCxcbiAgICAgICAgICB3aWR0aCA6IHdpZHRoLFxuICAgICAgICAgIGhlaWdodCA6IGhlaWdodCxcbiAgICAgICAgICB3aW5kb3dXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGxheW91dCA9IG5ldyBHcmF5TGF5b3V0KCk7XG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIGlmIChtZXNzYWdlLmFjdGlvbiA9PT0gJ2NhcHR1cmUnKSB7XG4gICAgICBzZW5kUmVzcG9uc2UoJ2JlZ2luQ2FwdHVyZScpO1xuICAgICAgbGF5b3V0LnNob3dHcmF5TGF5b3V0KCk7XG4gICAgfVxuICB9KTtcblxufSkoKTtcbiJdfQ==
