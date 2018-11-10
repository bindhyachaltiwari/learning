(function (window, assignment) {

  
  assignment = window.assignment = window.assignment || {};

  let Router = require('../scripts/vendor/es6-router.js');
  Router = Router.default;

  const router = new Router({});

  router.add('specifyProblem', () => {
    assignment.specifyProblem.init();
    document.title = window.Granite ? window.Granite.I18n.get('cmms_title.specifyProblem') : 'assignment';
  });
  assignment.router = router;
  

}(window, window.assignment));


