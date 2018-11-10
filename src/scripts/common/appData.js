var moment = require('moment');
(function (window, assignment) {

  assignment = window.assignment = window.assignment || {};

  let _sortCases = (status, cases) => {
    let sortingKey = status === 'open' ? 'createdDate' : 'closedDate';
    cases.sort(function (obj1, obj2) {
      return moment(obj2.serviceCases[sortingKey]) - moment(obj1.serviceCases[sortingKey]);
    });
    return cases;
  };
  assignment.appData = {
    cases: {
      allCases: [],
      myOpen: [],
      allOpen: [],
      myClosed: [],
      allClosed: [],
      // code commented for verification of status open and dispatched
      /*getOpenCases: function (allCases) {
        let openStatusCases = [];
        openStatusCases = allCases.filter(function (obj) {
          let objStatus = obj.serviceCases.status.toLowerCase();
          return objStatus === 'open' || objStatus === 'dispatched';
        });
        return openStatusCases;
      },*/
      getCasesByDevice: function (deviceId) {
        let casesByDevice = [];
        casesByDevice = assignment.appData.cases.allCases.filter(function (obj) {
          // code commented for verification of status open and dispatched
          //let objStatus = obj.serviceCases.status.toLowerCase();
          return obj.serviceCases.devices.id === deviceId;
        });
        _sortCases('open', casesByDevice);
        return casesByDevice;
      }
    },
    instruments: [],
    selectedInstrument: '',
    casesResponseMessage: '',
    selectedCaseId: '',
    filterSelected: '',
    innerTextSelected: '',
    pageControlFrSearch: false,
    caseResponseObject: {},
    callServiceAllCases: false,
    createCaseFailed: false,
    scrollToVar:0
  };

}(window, window.assignment));