var Handlebars = require('handlebars/runtime');
  
(function (window, assignment) {
  assignment = window.assignment = assignment || {};

  let _registerHandlebarHelpers = () => {
    Handlebars.registerHelper('assign', function (element, val1, defaultVal) {
      var context = {};
      context[element] = val1 || defaultVal;
    });

    Handlebars.registerHelper('breaklines', function (text) {
      text = Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new Handlebars.SafeString(text);
    });
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      if (options.hash.ignoreCase && typeof v1 === 'string' && typeof v2 === 'string') {
        v1 = v1.toLowerCase();
        v2 = v2.toLowerCase();
      }
      /*eslint-disable */
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          if (typeof (v1) === 'string' && typeof (v2) === 'string') {
            v1 = v1.toLowerCase();
            v2 = v2.toLowerCase();
          }
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case 'contains':
          return (v1.indexOf(v2) !== -1) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
      /*eslint-enable */
    });
  };
  assignment.helpers = {
    moduleName: 'helpers',

    init: function () {
      return _registerHandlebarHelpers.apply(this, arguments);
    }
  };
  assignment.helpers.init();
}(window, window.assignment));