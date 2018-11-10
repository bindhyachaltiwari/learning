/*!
 * ajax.wrapper.js

 * This file contians ajax wrapper method that handles all ajax calls
 *
 * @project   assignment
 * @date      2018-11-09
 * @author    Bindhyachal
 * @dependencies jQuery
 */

//this will cause the browser to check for errors more aggressively

/**
 * @namespace ajaxWrapper
 * @memberof 
 * @property {null} property - description of property
 */

(function (window, assignment) {
  assignment = window.assignment = assignment || {};
  assignment.ajaxWrapper = {
    moduleName: 'ajaxWrapper', // Added for debug logs
    xhrPool: {
      name: 'xhrPool'
    },
    getXhrObj: function (options, callback, complete) {
      let self = this,
        ajaxOptions,
        defaultOptions = {
          type: 'POST',
          async: true,
          cache: false,
          url: '',
          data: {},
          dataType: 'json',
          loaderRef: null,
          beforeSend: function (jqXHR) {
            if (ajaxOptions.cancellable) {
              if (self.xhrPool[ajaxOptions.url]) {
                self.xhrPool[ajaxOptions.url].abort();
                self.xhrPool[ajaxOptions.url] = jqXHR;
              } else {
                self.xhrPool[ajaxOptions.url] = jqXHR;
              }
            }
            if (ajaxOptions.loader && ajaxOptions.loader.length) {
              assignment.commonUtils.loader.show(ajaxOptions.loader);
            }
          },
          cancellable: false, // By default allow multiple request on one URL
          loader: null // Specify a target element where loader needs to be shown
        };
      ajaxOptions = $.extend({}, defaultOptions, options);
      return $.ajax(ajaxOptions)
        .done(function (data, status, jqXHR) {
          $.each(self.xhrPool, function (url, xhrObj) {
            if (xhrObj === jqXHR) {
              delete self.xhrPool[url];
              return false;
            }
          });
          if (!callback) {
            return;
          }
          callback.apply(this, arguments);
        })
        .fail(function (jqXHR) {
          $.each(self.xhrPool, function (url, xhrObj) {
            if (xhrObj === jqXHR) {
              delete self.xhrPool[url];
              return false;
            }
          });
          if (!callback) {
            return;
          }
          callback.apply(this, arguments);
        })
        .always(function () {
          if (ajaxOptions.loader && ajaxOptions.loader.length) {
            assignment.commonUtils.loader.remove(ajaxOptions.loader);
          }
          if (!complete) {
            return;
          }
          complete.apply(this, arguments);
        });
    },
    init: function () { // Since init is mandatory
      if (!window.ajaxWrapper) {
        window.ajaxWrapper = this;
      }
    }
  };

}(window, window.assignment));
