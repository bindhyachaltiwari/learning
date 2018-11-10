/*!
 * specify Problem.js

 * This file contians some most creat case functions
 *
 * @project   Assignment
 * @date      2018-011-9
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

  assignment = window.assignment = window.assignment || {};
  let _cache = {},
    currentQues = -1,
    questionsArr = [],
    questionUrl = '',
    submitUrl = '';
  const template = require('./specifyProblem.hbs');
  const templateTwo = require('./singlePageHbs.hbs');
  

  

  let _renderView = () => {
    
    let html = template();
    $('.js-view-container').html(html);
  };
  let _renderViewUpdated = (data) => {
    let html = templateTwo(data);
    $('.js-view-container').html(html);
  };
  let _toggleNextBtnDisabled = () => {
      let checkedAnswers = $('.js-decisionguide-question:visible .js-decision-answer:checked').length;
      if(checkedAnswers){
        _cache.decisionguideNextBtn.removeClass('disabled');
      } else {
        _cache.decisionguideNextBtn.addClass('disabled');
      }
    },
    _goToQues = (questionType) => {
      $('.js-decisionguide .js-decisionguide-question').hide();
      $('.js-decisionguide .js-decisionguide-question-wrapper').removeClass('slideInLeft slideInRight');
      let currentQuesElement = _cache.decisionguideQuestionView.find('.js-decisionguide-question:eq('+currentQues+')'),
        slideClass = 'slideInRight';
      currentQuesElement.show();
      if(questionType==='prev' ){
        slideClass = 'slideInLeft';
      }
      currentQuesElement.find('.js-decisionguide-question-wrapper').addClass(slideClass);
      if(currentQues > 0){
        _cache.decisionguidePrevBtn.removeClass('hidden');
      }else{
        _cache.decisionguidePrevBtn.addClass('hidden');
      }
      _toggleNextBtnDisabled();
    },

    _startDecisionGuide = () => {
      _cache.decisionguideRefreshBtn.removeClass('hidden');
      _cache.decisionguideQuestionView.removeClass('hidden');
      _cache.decisionguideFooter.removeClass('hidden');
      _cache.decisionguide.answersTagWrapper.removeClass('hidden');
      _cache.decisionguideStartView.hide();
    },
    
    _displayQuestion = (data) => {
      
      currentQues += 1;
      questionsArr.push(data);
      //show question view if first question
      if(currentQues===0){
        _startDecisionGuide();
      }

      if(data.headline){
        data.headline = questionsArr.length + '. '+ data.headline;
      }
      
      _renderViewUpdated(data);
      _goToQues();
    },

    _addAnswerTag = (questionIndex) => {
      let tagClass = '',
        questionId = questionsArr[questionIndex].questionId,
        isMultipleChoice = questionsArr[questionIndex].isCheckbox,
        currentQuestion = questionsArr[questionIndex],
        quesNumber = questionIndex+1,
        prevAnsHtml = `<div class='c-decisionguide__prev-answer js-decisionguide-prev-ans' data-question-id='${questionId}'><div class='c-decisionguide__prev-ques hidden js-decisionguide-prev-ques'>${quesNumber}. ${currentQuestion.description}</div></div>`;

      let prevAnsElem = $(prevAnsHtml),
        targetElem = prevAnsElem;
      _cache.decisionguideAnswers.append(prevAnsElem);
       
      $.each(currentQuestion.selectedAnswer, function(index, answer){
        if(isMultipleChoice==='true' && index===0){
          tagClass = 'checkbox-large';
          prevAnsElem.append('<div class=\'c-decisionguide__multiple-answer-wrapper js-multile-answer-wrapper\'></div>');
          targetElem = $('.js-multile-answer-wrapper:last');
        }else if(isMultipleChoice==='true'){
          tagClass = 'checkbox-small';
          targetElem = $('.js-multile-answer-wrapper:last');
        }
        let tagHtml = `<div class='c-decisionguide__answer-tag js-decisionguide-answer-tag ${tagClass}' data-answer-id='${answer.answerId}' data-answer-tag='${answer.answerTag}' data-question-id='${questionId}'><span class='c-decisionguide__answer-tag-icon'></span><span>${answer.desc}</span></div>`;
        targetElem.append(tagHtml);
      });
    },

    _refreshAnswersTags = () => {
      _cache.decisionguideAnswers.html('');
      $.each(questionsArr, function(index){
        //$.each(question.selectedAnswer, function(index2, answer){
        _addAnswerTag(index);
        //});         
      });
    },

    _showProgress = () => {
      
      
      let progress = 0;
      if(questionsArr.length){
        let totalQuestions = questionsArr[currentQues].childCount+ questionsArr.length;
        totalQuestions = parseInt(totalQuestions);
        let answeredQuestions = questionsArr.length;
        progress = Math.ceil( (answeredQuestions/totalQuestions) *100 );
      }
      
      progress = progress + '%' ;
      _cache.decisionguide.progresstext.text(progress);
      _cache.decisionguide.progress.css({'width': progress});
    },

    _removeQuesFromDom = (startIndex) => {
      $('.js-decisionguide-question-view').children().slice(startIndex).remove();
    },

    _showSubmitView = () => {
      _cache.decisionguideQuestionView.addClass('hidden');
      _cache.decisionguideFooter.addClass('hidden');
      _cache.decisionguide.answersTagWrapper.addClass('c-decisionguide__submit-view');
      _cache.decisionguide.submitBtn.removeClass('hidden');
      $('.js-decisionguide-prev-ques').removeClass('hidden');
    },

    _hideSubmitView = () => {
      _cache.decisionguide.submitBtn.addClass('hidden');
      _cache.decisionguide.answersTagWrapper.removeClass('c-decisionguide__submit-view');
      $('.js-decisionguide-prev-ques').addClass('hidden');
    },

    _showResultsView = () => {
      _hideSubmitView();
      _cache.decisionguide.productsWraper.html('');
      _cache.decisionguide.resultsView.removeClass('hidden');
    },

    _showResults = (data) => {
      assignment.commonUtils.log(data);
    },

    _getQuestion = () => {

      //_showLoader($('.js-decisionguide-question-view'));
      if(navigator.appVersion.indexOf('MSIE 9') !== -1) {
        $.getJSON(questionUrl).done(function(data) {
          _cache.startButton.removeClass('disabled');
          _displayQuestion(data);
          //$('.js-loading-icon').remove();
        });
      } else {
        let options = {
          url: assignment.apiUrls.mockyQuestonURL,
          type: 'GET',
          contentType: 'application/json'
          
        };
        assignment.ajaxWrapper.getXhrObj(options).done(function(data) {
          _cache.startButton.removeClass('disabled');
          _displayQuestion(data);
          //$('.js-loading-icon').remove();
        }).fail(function (err) {
          assignment.commonUtils.log(err);
          //$('.js-loading-icon').remove();
        });
      }
    },
    _refreshDecisionguide = () => {
      _cache.decisionguide.resultsView.addClass('hidden');
      _cache.decisionguide.productsWraper.html('');
      _hideSubmitView();
      questionsArr = [];
      currentQues = -1;
      questionUrl = _cache.questionPath+'/jcr:content/question.ques.json';
      _refreshAnswersTags();
      _showProgress();
      _cache.decisionguide.answersTagWrapper.addClass('hidden hidden-xs');
      _cache.decisionguideInfo.addClass('hidden');
      _cache.decisionguideRefreshBtn.addClass('hidden');
      _cache.decisionguideQuestionView.addClass('hidden');
      _cache.decisionguideQuestionView.html('');
      _cache.decisionguideFooter.addClass('hidden');
      _cache.decisionguideStartView.show();
    },
    _initializeRefreshPopup = () => {

      $('body').on('click','.js-refresh-confirm', function(){
        _refreshDecisionguide();
        $('#decisionguideRefreshPopup').modal('hide');
      });
    };

  
  //function to sanitize input to prevent XSS


 
  
  
  assignment.specifyProblem = {
    updateCache() {
      _cache.decisionguide = $('.js-decisionguide');
      _cache.startButton = $('.js-start-decisionguide');
      _cache.decisionguideStartView = $('.js-decisionguide .js-decisionguide-start-view');
      _cache.decisionguideHeader = $('.js-decisionguide .js-decisionguide-header');
      _cache.decisionguideFooter = $('.js-decisionguide .js-decisionguide-footer');
      _cache.decisionguideQuestionView = $('.js-decisionguide .js-decisionguide-question-view');
      _cache.decisionguideNextBtn = $('.js-decisionguide .js-decisionguide-next');
      _cache.decisionguidePrevBtn = $('.js-decisionguide .js-decisionguide-prev');
      _cache.decisionAnswer = $('.js-decisionguide .js-decision-answer');
      _cache.decisionguideAnswers = $('.js-decisionguide .js-decisionguide-answers');
      _cache.decisionguideRefreshBtn = $('.js-decisionguide .js-decisionguide-refresh');
      _cache.decisionguideInfo = $('.js-decisionguide .js-decisionguide-info');
      _cache.decisionguideQuestion = $('.js-decisionguide .js-decisionguide-question');
      _cache.decisionguide.progresstext = $('.js-decisionguide .js-progress-text');
      _cache.decisionguide.progress = $('.js-decisionguide .js-progress');
      _cache.decisionguide.submitBtn = $('.js-decisionguide .js-decisionguide-submit');
      _cache.decisionguide.answersTagWrapper = $('.js-decisionguide .js-decisionguide-answers-wrapper');
      _cache.decisionguide.resultsView = $('.js-decisionguide .js-decisionguide-results');
      _cache.decisionguide.productsWraper = $('.js-decisionguide .js-decisionguide-products');
      _cache.baseQuestionPath = $('.js-decisionguide .js-basequestion-path');
      _cache.questionPath = _cache.baseQuestionPath.data('baseQuestionPath');
      questionUrl = _cache.questionPath+'/jcr:content/question.ques.json';
      submitUrl =  _cache.questionPath+'/jcr:content/question.ans.json';
    },

    bindEvents() {
      _cache.decisionguide.on('click', '.js-start-decisionguide', function(e){
        e.preventDefault();
        if( !$(this).hasClass('disabled') ){
          _cache.startButton.addClass('disabled');
          _getQuestion();
        }
      });

      _cache.decisionguide.on('click', '.js-decisionguide-next', function(e){
        e.preventDefault();
        if($(this).hasClass('disabled')){
          return;
        }
        _cache.decisionguide.answersTagWrapper.removeClass('hidden hidden-xs');
        let checkedAnswers = $('.js-decisionguide-question:visible .js-decision-answer:checked'),
          selectedAnswer = [],
          selectedAnswersIds = [],
          nextQuestion = currentQues+1,
          isFinalQuestion = questionsArr[currentQues].isFinalQuestion,
          isManual = _cache.decisionguide.data('isManual').toString();
        checkedAnswers.each(function(){
          let selectedVal = $(this).val(),
            selectedAnswerTag = $(this).data('answerTag'),
            selectedAnswerDesc = $(this).data('answerShortDesc'),
            selectedAnswerObj = {'answerTag': selectedAnswerTag, 'desc': selectedAnswerDesc, 'answerId': selectedVal};
          selectedAnswersIds.push(selectedVal);
          selectedAnswer.push(selectedAnswerObj);
        });

        if(questionsArr[currentQues].selectedAnswer){
          let oldSelectedAnswers = [];
          $.each(questionsArr[currentQues].selectedAnswer, function(key, value){
            oldSelectedAnswers.push(value.answerId);
          });
          if(JSON.stringify(oldSelectedAnswers) === JSON.stringify(selectedAnswersIds) && isFinalQuestion=== 'false'){
            // answers not changed, display next question
            currentQues += 1;
            _goToQues();
            return;
          }else if(JSON.stringify(oldSelectedAnswers) !== JSON.stringify(selectedAnswersIds)){
            questionsArr.splice(nextQuestion);
            _removeQuesFromDom(nextQuestion);
            questionsArr[currentQues].selectedAnswer = selectedAnswer;
            _refreshAnswersTags();
          } 
          
        }else{
          questionsArr[currentQues].selectedAnswer = selectedAnswer;
          _addAnswerTag(currentQues);
        }

        
        _showProgress();

        let nextQuestionId = selectedAnswersIds.join(',');

        if(isFinalQuestion=== 'true' && isManual==='true'){
          _showSubmitView();
          submitUrl = questionsArr[currentQues].questionMap[nextQuestionId]+'/jcr:content/result.ans.json';
          return;
        }else if(isFinalQuestion === 'true' && isManual === 'false'){
          _showSubmitView();
          return;
        }

        questionUrl = questionsArr[currentQues].questionMap[nextQuestionId]+'/jcr:content/question.ques.json';
        
        if(currentQues === 0){
          _cache.decisionguideAnswers.removeClass('hidden'); 
          _cache.decisionguideInfo.removeClass('hidden');
        }
        _cache.decisionguideNextBtn.addClass('disabled'); 
        _getQuestion();
          
      });

      _cache.decisionguide.on('click', '.js-decisionguide-prev-ans', function(){
        let selectedQuesId = $(this).data('questionId').toString();
        for(var i=0; i< questionsArr.length; i++){
          if(questionsArr[i].questionId === selectedQuesId){
            currentQues = i;
            _cache.decisionguide.resultsView.addClass('hidden');
            _hideSubmitView();
            _cache.decisionguideQuestionView.removeClass('hidden');
            _cache.decisionguideFooter.removeClass('hidden');
            _goToQues('prev');
            break;
          }
        }
      });

      _cache.decisionguide.on('click', '.js-decisionguide-prev', function(e){
        e.preventDefault();
        currentQues = currentQues -1;
        _goToQues('prev');
      });

      _cache.decisionguide.on('click', '.js-decision-answer', function(){
        _toggleNextBtnDisabled();
      });

      _cache.decisionguide.on('click', '.js-decisionguide-submit', function(e){
        e.preventDefault();
        let answers = [];
        $('.js-decisionguide-answer-tag').each(function(){
          if($(this).data('answerTag')){
            answers.push($(this).data('answerTag'));
          }
        });
        let isManual = _cache.decisionguide.data('isManual').toString(),
          listingType = _cache.decisionguide.data('listingType').toString(),
          requestData = {};
        answers = answers.join(',');
        requestData = {'answer': answers, 'isManual' : isManual, 'listingType': listingType};

        _showResultsView();
        //_showLoader(_cache.decisionguide.resultsView);
        if(navigator.appVersion.indexOf('MSIE 9') !== -1) {
          $.getJSON(submitUrl, requestData).done(function(data) {
            //$('.js-loading-icon').remove();
            _showResults(data);
          });
        } else {
          let options = {
            url: submitUrl,
            type: 'GET',
            dataType: 'json',
            data: requestData
          };
          assignment.ajaxWrapper.getXhrObj(options).done(function(data) {
            //$('.js-loading-icon').remove();
            _showResults(data);
          }).fail(function (err) {
            //$('.js-loading-icon').remove();
            assignment.commonUtils.log(err);
          });
        }
      });

      _cache.decisionguide.on('click', '.js-decisionguide-refresh', function(e){
        e.preventDefault();
        $('#decisionguideRefreshPopup').modal({
          'keyboard' : false,
          backdrop: 'static'
        });
      });
      
      
    },
    init() {
      _renderView();
      this.updateCache();
      this.bindEvents();
      _initializeRefreshPopup();
    }
    
  };
}(window, window.assignment));