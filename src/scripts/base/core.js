(function (window, assignment) {

  assignment = window.assignment = window.assignment || {}; 

  let commonModules = ['ajaxWrapper','commonUtils'];

  assignment.core = {

    init() {
        
      // initialize modules, and app initialization logic
      $.each(commonModules, function(index, value) {
        try {
          // initialize the current module
          assignment[value].init();
        } catch(e) {
          // catch error, if any, while initialing module
          console.log(`${value} doesn't have init method.`);
          assignment.commonUtils.log(`${value} doesn't have init method.` );
        }
      });
    }
  };

  assignment.core.init();

}(window, window.assignment));