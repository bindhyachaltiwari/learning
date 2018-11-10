/*!
 * common.utils.js

 * This file contians some most common utility functions
 *
 * @project   Assignment
 * @date      2018-11-9
 * @author    Bindhyachal
 * @dependencies jQuery
 */

//this will cause the browser to check for errors more aggressively

/* eslint-disable new-cap */

/**
 * @namespace Main
 * @memberof 
 * @property {null} property - description of property
 */
(function (window, assignment) {

  assignment = window.assignment = assignment || {};


  assignment.commonUtils = {

    moduleName: 'commonUtils', // Added for debug logs

    // log to console if debug mode
    log: function () {
      try {
        // Enable logs if development environment is true or debugClientLibs param is provided
        if (assignment.commonUtils.queryParams('debugClientLibs')) {
          console.log(arguments[0]);
        }
      } catch (e) {
        // catch error here
      }
    },

    
    //get value of radio button selected in radio group
    getRadioVal(form, name) {
      let val;
      // get list of radio buttons with specified name
      let radios = form.elements[name];
      for (let i = 0, len = radios.length; i < len; i++) {
        if (radios[i].checked) { // radio checked?
          val = radios[i].value; // if so, hold its value in val
          break;
        }
      }
      return val; // return value of checked radio or undefined if none checked
    },

    loader: {
      show: function (elem) {
        let loader = `<div class="x-loader__container js-loader"><div class='x-loader'></div></div>`, $body = $('body');
        if (elem && elem.length) {
          elem.append(loader);
        } else {
          $body.append(loader);
        }
        $body.addClass('loader-open');
      },
      remove: function (elem) {
        $('body').removeClass('loader-open');
        elem.find('.js-loader').remove();
      }
    },
    
    errorhandler(err) {
      if (err.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        assignment.commonUtils.deleteCookie('userToken');
        window.location.reload();
      }
      return err;
    },

    
    
    // init method
    init: function () { // Added since init is mandatory for all modules
      assignment.router.navigate('specifyProblem');
    }
  };

}(window, window.assignment));