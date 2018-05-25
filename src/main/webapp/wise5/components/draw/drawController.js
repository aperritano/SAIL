'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _componentController = require('../componentController');

var _componentController2 = _interopRequireDefault(_componentController);

var _drawingTool = require('lib/drawingTool/drawing-tool');

var _drawingTool2 = _interopRequireDefault(_drawingTool);

var _vendor = require('lib/drawingTool/vendor.min');

var _vendor2 = _interopRequireDefault(_vendor);

var _html2canvas = require('html2canvas');

var _html2canvas2 = _interopRequireDefault(_html2canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawController = function (_ComponentController) {
  _inherits(DrawController, _ComponentController);

  function DrawController($filter, $injector, $mdDialog, $q, $rootScope, $scope, $timeout, AnnotationService, ConfigService, DrawService, NodeService, NotebookService, ProjectService, StudentAssetService, StudentDataService, UtilService) {
    _classCallCheck(this, DrawController);

    var _this = _possibleConstructorReturn(this, (DrawController.__proto__ || Object.getPrototypeOf(DrawController)).call(this, $filter, $mdDialog, $rootScope, $scope, AnnotationService, ConfigService, NodeService, NotebookService, ProjectService, StudentAssetService, StudentDataService, UtilService));

    _this.$injector = $injector;
    _this.$q = $q;
    _this.$timeout = $timeout;
    _this.DrawService = DrawService;

    // whether the reset button is visible or not
    _this.isResetButtonVisible = false;

    // whether the snip drawing button is shown or not
    _this.isSnipDrawingButtonVisible = true;

    // the label for the notebook in thos project
    _this.notebookConfig = _this.NotebookService.getNotebookConfig();

    // will hold the drawing tool object
    _this.drawingTool = null;

    /*
     * get the original component content. this is used when showing
     * previous work from another component.
     */
    _this.originalComponentContent = _this.$scope.originalComponentContent;

    _this.latestConnectedComponentState = null;
    _this.latestConnectedComponentParams = null;

    // the default width and height of the canvas
    _this.width = 800;
    _this.height = 600;

    if (_this.componentContent.width != null) {
      _this.width = _this.componentContent.width;
    }

    if (_this.componentContent.height != null) {
      _this.height = _this.componentContent.height;
    }

    // the options for when to update this component from a connected component
    _this.connectedComponentUpdateOnOptions = [{
      value: 'change',
      text: 'Change'
    }, {
      value: 'submit',
      text: 'Submit'
    }];

    // the component types we are allowed to connect to
    _this.allowedConnectedComponentTypes = [{ type: 'ConceptMap' }, { type: 'Draw' }, { type: 'Embedded' }, { type: 'Graph' }, { type: 'Label' }, { type: 'Table' }];

    _this.componentType = _this.componentContent.type;

    if (_this.mode === 'student') {
      _this.isSaveButtonVisible = _this.componentContent.showSaveButton;
      _this.isSubmitButtonVisible = _this.componentContent.showSubmitButton;
      _this.isResetButtonVisible = true;

      _this.drawingToolId = 'drawingtool_' + _this.nodeId + '_' + _this.componentId;

      // get the latest annotations
      _this.latestAnnotations = _this.AnnotationService.getLatestComponentAnnotations(_this.nodeId, _this.componentId, _this.workgroupId);
    } else if (_this.mode === 'grading' || _this.mode === 'gradingRevision' || _this.mode === 'onlyShowWork') {
      _this.isSnipDrawingButtonVisible = false;

      // get the component state from the scope
      var _componentState = _this.$scope.componentState;

      if (_componentState != null) {
        // create a unique id for the application drawing tool element using this component state
        _this.drawingToolId = 'drawingtool_' + _componentState.id;
        if (_this.mode === 'gradingRevision') {
          _this.drawingToolId = 'drawingtool_gradingRevision_' + _componentState.id;
        }
      }

      if (_this.mode === 'grading') {
        // get the latest annotations
        _this.latestAnnotations = _this.AnnotationService.getLatestComponentAnnotations(_this.nodeId, _this.componentId, _this.workgroupId);
      }
    } else if (_this.mode === 'showPreviousWork') {
      // get the component state from the scope
      var componentState = _this.$scope.componentState;
      if (componentState != null) {
        _this.drawingToolId = 'drawingtool_' + componentState.id;
      }
      _this.isPromptVisible = true;
      _this.isSaveButtonVisible = false;
      _this.isSubmitButtonVisible = false;
      _this.isSnipDrawingButtonVisible = false;
      _this.isDisabled = true;
    } else if (_this.mode === 'authoring') {
      _this.isSaveButtonVisible = _this.componentContent.showSaveButton;
      _this.isSubmitButtonVisible = _this.componentContent.showSubmitButton;
      _this.isResetButtonVisible = true;

      // generate the summernote rubric element id
      _this.summernoteRubricId = 'summernoteRubric_' + _this.nodeId + '_' + _this.componentId;

      // set the component rubric into the summernote rubric
      _this.summernoteRubricHTML = _this.componentContent.rubric;

      // the tooltip text for the insert WISE asset button
      var insertAssetString = _this.$translate('INSERT_ASSET');

      /*
       * create the custom button for inserting WISE assets into
       * summernote
       */
      var InsertAssetButton = _this.UtilService.createInsertAssetButton(_this, null, _this.nodeId, _this.componentId, 'rubric', insertAssetString);

      /*
       * the options that specifies the tools to display in the
       * summernote prompt
       */
      _this.summernoteRubricOptions = {
        toolbar: [['style', ['style']], ['font', ['bold', 'underline', 'clear']], ['fontname', ['fontname']], ['fontsize', ['fontsize']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'video']], ['view', ['fullscreen', 'codeview', 'help']], ['customButton', ['insertAssetButton']]],
        height: 300,
        disableDragAndDrop: true,
        buttons: {
          insertAssetButton: InsertAssetButton
        }
      };

      _this.drawingToolId = 'drawingtool_' + _this.nodeId + '_' + _this.componentId;
      _this.updateAdvancedAuthoringView();

      $scope.$watch(function () {
        return this.authoringComponentContent;
      }.bind(_this), function (newValue, oldValue) {
        this.componentContent = this.ProjectService.injectAssetPaths(newValue);
        this.submitCounter = 0;
        this.initializeDrawingTool();
        this.isSaveButtonVisible = this.componentContent.showSaveButton;
        this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
      }.bind(_this), true);
    }

    // running this in side a timeout ensures that the code only runs after the markup is rendered.
    // maybe there's a better way to do this, like with an event?
    _this.$timeout(angular.bind(_this, _this.initializeDrawingTool));

    /**
     * Get the component state from this component. The parent node will
     * call this function to obtain the component state when it needs to
     * save student data.
     * @param isSubmit boolean whether the request is coming from a submit
     * action (optional; default is false)
     * @return a component state containing the student data
     */
    _this.$scope.getComponentState = function (isSubmit) {
      var deferred = this.$q.defer();
      var getState = false;
      var action = 'change';

      if (isSubmit) {
        if (this.$scope.drawController.isSubmitDirty) {
          getState = true;
          action = 'submit';
        }
      } else {
        if (this.$scope.drawController.isDirty) {
          getState = true;
          action = 'save';
        }
      }

      if (getState) {
        // create a component state populated with the student data
        this.$scope.drawController.createComponentState(action).then(function (componentState) {
          deferred.resolve(componentState);
        });
      } else {
        /*
         * the student does not have any unsaved changes in this component
         * so we don't need to save a component state for this component.
         * we will immediately resolve the promise here.
         */
        deferred.resolve();
      }

      return deferred.promise;
    }.bind(_this);

    /**
     * The parent node submit button was clicked
     */
    _this.$scope.$on('nodeSubmitClicked', angular.bind(_this, function (event, args) {

      // get the node id of the node
      var nodeId = args.nodeId;

      // make sure the node id matches our parent node
      if (this.nodeId === nodeId) {

        // trigger the submit
        var submitTriggeredBy = 'nodeSubmitButton';
        this.submit(submitTriggeredBy);
      }
    }));

    /**
     * Listen for the 'studentWorkSavedToServer' event which is fired when
     * we receive the response from saving a component state to the server
     */
    _this.$scope.$on('studentWorkSavedToServer', angular.bind(_this, function (event, args) {

      var componentState = args.studentWork;

      // check that the component state is for this component
      if (componentState && this.nodeId === componentState.nodeId && this.componentId === componentState.componentId) {

        // set isDirty to false because the component state was just saved and notify node
        this.isDirty = false;
        this.$scope.$emit('componentDirty', { componentId: this.componentId, isDirty: false });

        var isAutoSave = componentState.isAutoSave;
        var isSubmit = componentState.isSubmit;
        var serverSaveTime = componentState.serverSaveTime;
        var clientSaveTime = this.ConfigService.convertToClientTimestamp(serverSaveTime);

        // set save message
        if (isSubmit) {
          this.setSaveMessage(this.$translate('SUBMITTED'), clientSaveTime);

          this.lockIfNecessary();

          // set isSubmitDirty to false because the component state was just submitted and notify node
          this.isSubmitDirty = false;
          this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: false });
        } else if (isAutoSave) {
          this.setSaveMessage(this.$translate('AUTO_SAVED'), clientSaveTime);
        } else {
          this.setSaveMessage(this.$translate('SAVED'), clientSaveTime);
        }
      }

      // check if the component state is from a connected component
      if (this.ProjectService.isConnectedComponent(this.nodeId, this.componentId, componentState.componentId)) {

        // get the connected component params
        var connectedComponentParams = this.ProjectService.getConnectedComponentParams(this.componentContent, componentState.componentId);

        if (connectedComponentParams != null) {

          if (connectedComponentParams.updateOn === 'save' || connectedComponentParams.updateOn === 'submit' && componentState.isSubmit) {

            var performUpdate = false;

            /*
             * make a copy of the component state so we don't accidentally
             * change any values in the referenced object
             */
            componentState = this.UtilService.makeCopyOfJSONObject(componentState);

            /*
             * check if the the canvas is empty which means the student has
             * not drawn anything yet
             */
            if (this.isCanvasEmpty()) {
              performUpdate = true;
            } else {
              /*
               * the student has drawn on the canvas so we
               * will ask them if they want to update it
               */
              var answer = confirm(this.$translate('draw.doYouWantToUpdateTheConnectedDrawing'));

              if (answer) {
                // the student answered yes
                performUpdate = true;
              }
            }

            if (performUpdate) {

              if (!connectedComponentParams.includeBackground) {
                // remove the background from the draw data
                this.DrawService.removeBackgroundFromComponentState(componentState);
              }

              // update the draw data
              this.setDrawData(componentState);

              // the table has changed
              this.$scope.drawController.isDirty = true;
              this.$scope.drawController.isSubmitDirty = true;
            }

            /*
             * remember the component state and connected component params
             * in case we need to use them again later
             */
            this.latestConnectedComponentState = componentState;
            this.latestConnectedComponentParams = connectedComponentParams;
          }
        }
      }
    }));

    /*
     * Listen for the requestImage event which is fired when something needs
     * an image representation of the student data from a specific
     * component.
     */
    _this.$scope.$on('requestImage', function (event, args) {
      // get the node id and component id from the args
      var nodeId = args.nodeId;
      var componentId = args.componentId;

      // check if the image is being requested from this component
      if (_this.nodeId === nodeId && _this.componentId === componentId) {

        // obtain the image blob
        var imageObject = _this.getImageObject();

        if (imageObject != null) {
          var args = {};
          args.nodeId = nodeId;
          args.componentId = componentId;
          args.imageObject = imageObject;

          // fire an event that contains the image object
          _this.$scope.$emit('requestImageCallback', args);
        }
      }
    });

    /**
     * Listen for the 'annotationSavedToServer' event which is fired when
     * we receive the response from saving an annotation to the server
     */
    _this.$scope.$on('annotationSavedToServer', function (event, args) {

      if (args != null) {

        // get the annotation that was saved to the server
        var annotation = args.annotation;

        if (annotation != null) {

          // get the node id and component id of the annotation
          var annotationNodeId = annotation.nodeId;
          var annotationComponentId = annotation.componentId;

          // make sure the annotation was for this component
          if (_this.nodeId === annotationNodeId && _this.componentId === annotationComponentId) {

            // get latest score and comment annotations for this component
            _this.latestAnnotations = _this.AnnotationService.getLatestComponentAnnotations(_this.nodeId, _this.componentId, _this.workgroupId);
          }
        }
      }
    });

    /**
     * Listen for the 'exitNode' event which is fired when the student
     * exits the parent node. This will perform any necessary cleanup
     * when the student exits the parent node.
     */
    _this.$scope.$on('exitNode', angular.bind(_this, function (event, args) {}));

    /*
     * Listen for the assetSelected event which occurs when the user
     * selects an asset from the choose asset popup
     */
    _this.$scope.$on('assetSelected', function (event, args) {

      if (args != null) {

        // make sure the event was fired for this component
        if (args.nodeId == _this.nodeId && args.componentId == _this.componentId) {
          // the asset was selected for this component
          var assetItem = args.assetItem;

          if (assetItem != null) {
            var fileName = assetItem.fileName;

            if (fileName != null) {
              /*
               * get the assets directory path
               * e.g.
               * /wise/curriculum/3/
               */
              var assetsDirectoryPath = _this.ConfigService.getProjectAssetsDirectoryPath();
              var fullAssetPath = assetsDirectoryPath + '/' + fileName;

              var summernoteId = '';

              if (args.target == 'prompt') {
                // the target is the summernote prompt element
                summernoteId = 'summernotePrompt_' + _this.nodeId + '_' + _this.componentId;
              } else if (args.target == 'rubric') {
                // the target is the summernote rubric element
                summernoteId = 'summernoteRubric_' + _this.nodeId + '_' + _this.componentId;
              } else if (args.target == 'background') {
                // the target is the background image

                // set the background file name
                _this.authoringComponentContent.background = fileName;

                /*
                 * the authoring view background has changed so we will
                 * perform any changes if needed and then save the project
                 */
                _this.authoringViewBackgroundChanged();
              } else if (args.target == 'stamp') {
                // the target is a stamp

                // get the index of the stamp
                var stampIndex = args.targetObject;

                // get the file name
                var fileName = assetItem.fileName;

                // set the stamp image
                _this.setStampImage(stampIndex, fileName);

                /*
                 * the authoring view background has changed so we will
                 * perform any changes if needed and then save the project
                 */
                _this.authoringViewBackgroundChanged();
              }

              if (summernoteId != '') {
                if (_this.UtilService.isImage(fileName)) {
                  /*
                   * move the cursor back to its position when the asset chooser
                   * popup was clicked
                   */
                  $('#' + summernoteId).summernote('editor.restoreRange');
                  $('#' + summernoteId).summernote('editor.focus');

                  // add the image html
                  $('#' + summernoteId).summernote('insertImage', fullAssetPath, fileName);
                } else if (_this.UtilService.isVideo(fileName)) {
                  /*
                   * move the cursor back to its position when the asset chooser
                   * popup was clicked
                   */
                  $('#' + summernoteId).summernote('editor.restoreRange');
                  $('#' + summernoteId).summernote('editor.focus');

                  // insert the video element
                  var videoElement = document.createElement('video');
                  videoElement.controls = 'true';
                  videoElement.innerHTML = '<source ng-src="' + fullAssetPath + '" type="video/mp4">';
                  $('#' + summernoteId).summernote('insertNode', videoElement);
                }
              }
            }
          }
        }
      }

      // close the popup
      _this.$mdDialog.hide();
    });

    /*
     * The advanced button for a component was clicked. If the button was
     * for this component, we will show the advanced authoring.
     */
    _this.$scope.$on('componentAdvancedButtonClicked', function (event, args) {
      if (args != null) {
        var componentId = args.componentId;
        if (_this.componentId === componentId) {
          _this.showAdvancedAuthoring = !_this.showAdvancedAuthoring;
        }
      }
    });

    _this.$scope.$on('notebookItemChosen', function (event, args) {
      if (args.requester == _this.nodeId + '-' + _this.componentId) {
        var notebookItem = args.notebookItem;
        var studentWorkId = notebookItem.content.studentWorkIds[0];
        _this.importWorkByStudentWorkId(studentWorkId);
      }
    });

    _this.$rootScope.$broadcast('doneRenderingComponent', { nodeId: _this.nodeId, componentId: _this.componentId });
    return _this;
  }

  /**
   * Initialize the drawing tool
   */


  _createClass(DrawController, [{
    key: 'initializeDrawingTool',
    value: function initializeDrawingTool() {
      var _this2 = this;

      this.drawingTool = new DrawingTool('#' + this.drawingToolId, {
        stamps: this.componentContent.stamps || {},
        parseSVG: true,
        width: this.width,
        height: this.height
      });
      var state = null;
      $('#set-background').on('click', angular.bind(this, function () {
        this.drawingTool.setBackgroundImage($('#background-src').val());
      }));
      $('#resize-background').on('click', angular.bind(this, function () {
        this.drawingTool.resizeBackgroundToCanvas();
      }));
      $('#resize-canvas').on('click', angular.bind(this, function () {
        this.drawingTool.resizeCanvasToBackground();
      }));
      $('#shrink-background').on('click', angular.bind(this, function () {
        this.drawingTool.shrinkBackgroundToCanvas();
      }));
      $('#clear').on('click', angular.bind(this, function () {
        this.drawingTool.clear(true);
      }));
      $('#save').on('click', angular.bind(this, function () {
        state = _drawingTool2.default.save();
        $('#load').removeAttr('disabled');
      }));
      $('#load').on('click', angular.bind(this, function () {
        if (state === null) return;
        this.drawingTool.load(state);
      }));

      var componentState = null;

      // get the component state from the scope
      componentState = this.$scope.componentState;

      // set whether studentAttachment is enabled
      this.isStudentAttachmentEnabled = this.componentContent.isStudentAttachmentEnabled;

      if (this.mode == 'student') {
        if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
          // we will show work from another component
          this.handleConnectedComponents();
        } else if (this.DrawService.componentStateHasStudentWork(componentState, this.componentContent)) {
          /*
           * the student has work so we will populate the work into this
           * component
           */
          this.setStudentWork(componentState);
        } else if (this.UtilService.hasConnectedComponent(this.componentContent)) {
          // we will import work from another component
          this.handleConnectedComponents();
        } else if (componentState == null || !this.DrawService.componentStateHasStudentWork(componentState, this.componentContent)) {
          /*
           * only import work or use starter draw data if the student
           * does not already have work for this component
           */

          // check if we need to import work
          var importPreviousWorkNodeId = this.componentContent.importPreviousWorkNodeId;
          var importPreviousWorkComponentId = this.componentContent.importPreviousWorkComponentId;

          // get the starter draw data if any
          var starterDrawData = this.componentContent.starterDrawData;

          if (importPreviousWorkNodeId == null || importPreviousWorkNodeId == '') {
            /*
             * check if the node id is in the field that we used to store
             * the import previous work node id in
             */
            importPreviousWorkNodeId = this.componentContent.importWorkNodeId;
          }

          if (importPreviousWorkComponentId == null || importPreviousWorkComponentId == '') {
            /*
             * check if the component id is in the field that we used to store
             * the import previous work component id in
             */
            importPreviousWorkComponentId = this.componentContent.importWorkComponentId;
          }

          if (importPreviousWorkNodeId != null && importPreviousWorkComponentId != null) {

            if (this.componentContent.background != null) {
              // set the background from the component content
              this.drawingTool.setBackgroundImage(this.componentContent.background);
            }

            // import the work from the other component
            this.importWork();
          } else if (starterDrawData != null) {
            // there is starter draw data so we will populate it into the draw tool
            this.drawingTool.load(starterDrawData);

            if (this.componentContent.background != null) {
              // set the background from the component content
              this.drawingTool.setBackgroundImage(this.componentContent.background);
            }
          } else {
            if (this.componentContent.background != null) {
              // set the background from the component content
              this.drawingTool.setBackgroundImage(this.componentContent.background);
            }
          }
        }
      } else if (this.mode == 'authoring') {

        if (this.componentContent.starterDrawData != null) {
          // there is starter draw data so we will populate it into the draw tool
          this.drawingTool.load(this.componentContent.starterDrawData);
        }

        if (this.componentContent.background != null) {
          this.drawingTool.setBackgroundImage(this.componentContent.background);
        }
      } else {
        // populate the student work into this component
        this.setStudentWork(componentState);
      }

      // check if the student has used up all of their submits
      if (this.componentContent.maxSubmitCount != null && this.submitCounter >= this.componentContent.maxSubmitCount) {
        /*
         * the student has used up all of their chances to submit so we
         * will disable the submit button
         */
        this.isSubmitButtonDisabled = true;
      }

      // check if we need to lock this component
      this.calculateDisabled();

      // register this component with the parent node
      if (this.$scope.$parent && this.$scope.$parent.nodeController != null) {
        this.$scope.$parent.nodeController.registerComponentController(this.$scope, this.componentContent);
      }

      /*
       * Wait before we start listening for the drawing:changed event. We need to wait
       * because the calls above to this.drawingTool.setBackgroundImage() will cause
       * the drawing:changed event to be fired from the drawingTool, but when that happens,
       * we don't want to call this.studentDataChanged() because it marks the student work
       * as dirty. We only want to call this.studentDataChanged() when the drawing:changed
       * event occurs in response to the student changing the drawing and this timeout
       * will help make sure of that.
       */
      this.$timeout(angular.bind(this, function () {
        _this2.drawingTool.on('drawing:changed', angular.bind(_this2, _this2.studentDataChanged));
      }), 500);

      if (this.mode === 'student') {
        // listen for selected tool changed event
        this.drawingTool.on('tool:changed', function (toolName) {
          // log this event
          var category = 'Tool';
          var event = 'toolSelected';
          var data = {};
          data.selectedToolName = toolName;
          this.StudentDataService.saveComponentEvent(this, category, event, data);
        }.bind(this));
      }

      if (this.mode === 'grading' || this.mode === 'gradingRevision' || this.mode === 'onlyShowWork') {
        // we're in show student work mode, so hide the toolbar and make the drawing non-editable
        $('#' + this.drawingToolId).find('.dt-tools').hide();
      } else {
        // show or hide the draw tools
        this.setupTools();
      }
    }

    /**
     * Setup the tools that we will make available to the student
     */

  }, {
    key: 'setupTools',
    value: function setupTools() {

      // get the tools values from the authored content
      var tools = this.componentContent.tools;

      if (tools == null) {
        // we will display all the tools
      } else {
        // we will only display the tools the authored specified to show

        // the title for the select button
        var selectTitle = this.$translate('draw.selectToolTooltip');
        var $drawingTool = $('#' + this.drawingToolId);

        if (tools.select) {
          $drawingTool.find('[title="' + selectTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + selectTitle + '"]').hide();
        }

        // the title for the line button
        var lineTitle = this.$translate('draw.lineToolTooltip');

        if (tools.line) {
          $drawingTool.find('[title="' + lineTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + lineTitle + '"]').hide();
        }

        // the title for the shape button
        var shapeTitle = this.$translate('draw.shapeToolTooltip');

        if (tools.shape) {
          $drawingTool.find('[title="' + shapeTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + shapeTitle + '"]').hide();
        }

        // the title for the free hand button
        var freeHandTitle = this.$translate('draw.freeHandToolTooltip');

        if (tools.freeHand) {
          $drawingTool.find('[title="' + freeHandTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + freeHandTitle + '"]').hide();
        }

        // the title for the text button
        var textTitle = this.$translate('draw.textToolTooltip');

        if (tools.text) {
          $drawingTool.find('[title="' + textTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + textTitle + '"]').hide();
        }

        // the title for the stamp button
        var stampTitle = this.$translate('draw.stampToolTooltip');

        if (tools.stamp) {
          $drawingTool.find('[title="' + stampTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + stampTitle + '"]').hide();
        }

        // the title for the clone button
        var cloneTitle = this.$translate('draw.cloneToolTooltip');

        if (tools.clone) {
          $drawingTool.find('[title="' + cloneTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + cloneTitle + '"]').hide();
        }

        // the title for the stroke color button
        var strokeColorTitle = this.$translate('draw.strokeColorToolTooltip');

        if (tools.strokeColor) {
          $drawingTool.find('[title="' + strokeColorTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + strokeColorTitle + '"]').hide();
        }

        // the title for the fill color button
        var fillColorTitle = this.$translate('draw.fillColorToolTooltip');

        if (tools.fillColor) {
          $drawingTool.find('[title="' + fillColorTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + fillColorTitle + '"]').hide();
        }

        // the title for the stroke width button
        var strokeWidthTitle = this.$translate('draw.strokeWidthToolTooltip');

        if (tools.strokeWidth) {
          $drawingTool.find('[title="' + strokeWidthTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + strokeWidthTitle + '"]').hide();
        }

        // the title for the send back button
        var sendBackTitle = this.$translate('draw.sendBackToolTooltip');

        if (tools.sendBack) {
          $drawingTool.find('[title="' + sendBackTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + sendBackTitle + '"]').hide();
        }

        // the title for the send forward button
        var sendForwardTitle = this.$translate('draw.sendForwardToolTooltip');

        if (tools.sendForward) {
          $drawingTool.find('[title="' + sendForwardTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + sendForwardTitle + '"]').hide();
        }

        // the title for the undo button
        var undoTitle = this.$translate('draw.undo');

        if (tools.undo) {
          $drawingTool.find('[title="' + undoTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + undoTitle + '"]').hide();
        }

        // the title for the redo button
        var redoTitle = this.$translate('draw.redo');

        if (tools.redo) {
          $drawingTool.find('[title="' + redoTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + redoTitle + '"]').hide();
        }

        // the title for the delete button
        var deleteTitle = this.$translate('draw.deleteToolTooltip');

        if (tools.delete) {
          $drawingTool.find('[title="' + deleteTitle + '"]').show();
        } else {
          $drawingTool.find('[title="' + deleteTitle + '"]').hide();
        }

        if (this.isDisabled) {
          $drawingTool.find('.dt-tools').hide();
        }
      }
    }

    /**
     * Populate the student work into the component
     * @param componentState the component state to populate into the component
     */

  }, {
    key: 'setStudentWork',
    value: function setStudentWork(componentState) {

      if (componentState != null) {

        // set the draw data
        this.setDrawData(componentState);

        /*
         * check if the latest component state is a submit and perform
         * any necessary processing
         */
        this.processLatestSubmit();
      }
    }
  }, {
    key: 'processLatestSubmit',


    /**
     * Check if latest component state is a submission and set isSubmitDirty accordingly
     */
    value: function processLatestSubmit() {
      var latestState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);

      if (latestState) {
        var serverSaveTime = latestState.serverSaveTime;
        var clientSaveTime = this.ConfigService.convertToClientTimestamp(serverSaveTime);
        if (latestState.isSubmit) {
          // latest state is a submission, so set isSubmitDirty to false and notify node
          this.isSubmitDirty = false;
          this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: false });
          // set save message
          this.setSaveMessage(this.$translate('LAST_SUBMITTED'), clientSaveTime);
        } else {
          // latest state is not a submission, so set isSubmitDirty to true and notify node
          this.isSubmitDirty = true;
          this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: true });
          // set save message
          this.setSaveMessage(this.$translate('LAST_SAVED'), clientSaveTime);
        }
      }
    }
  }, {
    key: 'submit',


    /**
     * A submit was triggered by the component submit button or node submit button
     * @param submitTriggeredBy what triggered the submit
     * e.g. 'componentSubmitButton' or 'nodeSubmitButton'
     */
    value: function submit(submitTriggeredBy) {

      if (this.isSubmitDirty) {
        // the student has unsubmitted work

        var performSubmit = true;

        if (this.componentContent.maxSubmitCount != null) {
          // there is a max submit count

          // calculate the number of submits this student has left
          var numberOfSubmitsLeft = this.componentContent.maxSubmitCount - this.submitCounter;

          var message = '';

          if (numberOfSubmitsLeft <= 0) {
            // the student does not have any more chances to submit
            performSubmit = false;
          } else if (numberOfSubmitsLeft == 1) {
            /*
             * the student has one more chance to submit left so maybe
             * we should ask the student if they are sure they want to submit
             */
          } else if (numberOfSubmitsLeft > 1) {
            /*
             * the student has more than one chance to submit left so maybe
             * we should ask the student if they are sure they want to submit
             */
          }
        }

        if (performSubmit) {

          /*
           * set isSubmit to true so that when the component state is
           * created, it will know that is a submit component state
           * instead of just a save component state
           */
          this.isSubmit = true;

          // increment the submit counter
          this.incrementSubmitCounter();

          // check if the student has used up all of their submits
          if (this.componentContent.maxSubmitCount != null && this.submitCounter >= this.componentContent.maxSubmitCount) {
            /*
             * the student has used up all of their submits so we will
             * disable the submit button
             */
            this.isSubmitButtonDisabled = true;
          }

          if (this.mode === 'authoring') {
            /*
             * we are in authoring mode so we will set values appropriately
             * here because the 'componentSubmitTriggered' event won't
             * work in authoring mode
             */
            this.isDirty = false;
            this.isSubmitDirty = false;
            this.createComponentState('submit');
          }

          if (submitTriggeredBy == null || submitTriggeredBy === 'componentSubmitButton') {
            // tell the parent node that this component wants to submit
            this.$scope.$emit('componentSubmitTriggered', { nodeId: this.nodeId, componentId: this.componentId });
          } else if (submitTriggeredBy === 'nodeSubmitButton') {
            // nothing extra needs to be performed
          }
        } else {
          /*
           * the student has cancelled the submit so if a component state
           * is created, it will just be a regular save and not submit
           */
          this.isSubmit = false;
        }
      }
    }

    /**
     * Increment the submit counter
     */

  }, {
    key: 'incrementSubmitCounter',
    value: function incrementSubmitCounter() {
      this.submitCounter++;
    }

    /**
     * The reset button was clicked
     */

  }, {
    key: 'resetButtonClicked',
    value: function resetButtonClicked() {

      // ask the student if they are sure they want to clear the drawing
      var result = confirm(this.$translate('draw.areYouSureYouWantToClearYourDrawing'));

      if (result) {
        // clear the drawing
        this.drawingTool.clear();

        if (this.UtilService.hasConnectedComponent(this.componentContent)) {
          // we will import work from another component
          this.handleConnectedComponents();
        } else if (this.latestConnectedComponentState && this.latestConnectedComponentParams) {
          // reload the student data from the connected component
          this.setDrawData(latestConnectedComponentState, latestConnectedComponentParams);
        } else if (this.componentContent.importPreviousWorkNodeId != null && this.componentContent.importPreviousWorkNodeId != '' && this.componentContent.importPreviousWorkComponentId != null && this.componentContent.importPreviousWorkComponentId != '') {

          // this component imports work from another component

          // boolean flag to overwrite the work when we import
          var overwrite = true;

          // import work from another component
          this.importWork(overwrite);
        } else if (this.componentContent.starterDrawData != null) {
          // this component has starter draw data

          // there is starter draw data so we will populate it into the draw tool
          this.drawingTool.load(this.componentContent.starterDrawData);
        }

        if (this.componentContent.background != null && this.componentContent.background != '') {
          // set the background
          this.drawingTool.setBackgroundImage(this.componentContent.background);
        }

        this.parentStudentWorkIds = null;
      }
    }
  }, {
    key: 'lockIfNecessary',
    value: function lockIfNecessary() {
      // check if we need to lock the component after the student submits
      if (this.isLockAfterSubmit()) {
        this.isDisabled = true;
      }
    }
  }, {
    key: 'studentDataChanged',


    /**
     * Called when the student changes their work
     */
    value: function studentDataChanged() {
      var _this3 = this;

      /*
       * set the dirty flag so we will know we need to save the
       * student work later
       */
      this.isDirty = true;
      this.$scope.$emit('componentDirty', { componentId: this.componentId, isDirty: true });

      this.isSubmitDirty = true;
      this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: true });

      // clear out the save message
      this.setSaveMessage('', null);

      // get this part id
      var componentId = this.getComponentId();

      /*
       * the student work in this component has changed so we will tell
       * the parent node that the student data will need to be saved.
       * this will also notify connected parts that this component's student
       * data has changed.
       */
      var action = 'change';

      // create a component state populated with the student data
      this.createComponentState(action).then(function (componentState) {
        _this3.$scope.$emit('componentStudentDataChanged', { nodeId: _this3.nodeId, componentId: componentId, componentState: componentState });
      });
    }
  }, {
    key: 'createComponentState',


    /**
     * Create a new component state populated with the student data
     * @param action the action that is triggering creating of this component state
     * e.g. 'submit', 'save', 'change'
     * @return a promise that will return a component state
     */
    value: function createComponentState(action) {

      var deferred = this.$q.defer();

      // create a new component state
      var componentState = this.NodeService.createNewComponentState();

      var studentData = {};

      // get the draw JSON string
      var studentDataJSONString = this.getDrawData();

      // set the draw JSON string into the draw data
      studentData.drawData = studentDataJSONString;

      // set the submit counter
      studentData.submitCounter = this.submitCounter;

      if (this.parentStudentWorkIds != null) {
        studentData.parentStudentWorkIds = this.parentStudentWorkIds;
      }

      // set the flag for whether the student submitted this work
      componentState.isSubmit = this.isSubmit;

      // set the student data into the component state
      componentState.studentData = studentData;

      // set the component type
      componentState.componentType = 'Draw';

      // set the node id
      componentState.nodeId = this.nodeId;

      // set the component id
      componentState.componentId = this.componentId;

      /*
       * reset the isSubmit value so that the next component state
       * doesn't maintain the same value
       */
      this.isSubmit = false;

      /*
       * perform any additional processing that is required before returning
       * the component state
       */
      this.createComponentStateAdditionalProcessing(deferred, componentState, action);

      return deferred.promise;
    }
  }, {
    key: 'createComponentStateAdditionalProcessing',


    /**
     * Perform any additional processing that is required before returning the
     * component state
     * Note: this function must call deferred.resolve() otherwise student work
     * will not be saved
     * @param deferred a deferred object
     * @param componentState the component state
     * @param action the action that we are creating the component state for
     * e.g. 'submit', 'save', 'change'
     */
    value: function createComponentStateAdditionalProcessing(deferred, componentState, action) {
      /*
       * we don't need to perform any additional processing so we can resolve
       * the promise immediately
       */
      deferred.resolve(componentState);
    }

    /**
     * Check if we need to lock the component
     */

  }, {
    key: 'calculateDisabled',
    value: function calculateDisabled() {

      var nodeId = this.nodeId;

      // get the component content
      var componentContent = this.componentContent;

      if (componentContent != null) {

        // check if the parent has set this component to disabled
        if (componentContent.isDisabled) {
          this.isDisabled = true;
        } else if (componentContent.lockAfterSubmit) {
          // we need to lock the step after the student has submitted

          // get the component states for this component
          var componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(this.nodeId, this.componentId);

          // check if any of the component states were submitted
          var isSubmitted = this.NodeService.isWorkSubmitted(componentStates);

          if (isSubmitted) {
            // the student has submitted work for this component
            this.isDisabled = true;
          }
        }
      }

      if (this.mode === 'showStudentWorkOnly') {
        // distable saving if we're in showStudentWorkOnly mode
        this.isDisabled = true;
      }
    }
  }, {
    key: 'isLockAfterSubmit',


    /**
     * Check whether we need to lock the component after the student
     * submits an answer.
     */
    value: function isLockAfterSubmit() {
      var result = false;

      if (this.componentContent != null) {

        // check the lockAfterSubmit field in the component content
        if (this.componentContent.lockAfterSubmit) {
          result = true;
        }
      }

      return result;
    }
  }, {
    key: 'attachStudentAsset',


    /**
     * Add student asset images as objects in the drawing canvas
     * @param studentAsset
     */
    value: function attachStudentAsset(studentAsset) {
      var _this4 = this;

      if (studentAsset != null) {
        this.StudentAssetService.copyAssetForReference(studentAsset).then(function (copiedAsset) {
          if (copiedAsset != null) {
            fabric.Image.fromURL(copiedAsset.url, function (oImg) {
              oImg.scaleToWidth(200); // set max width and have height scale proportionally
              // TODO: center image or put them at mouse position? Wasn't straight-forward, tried below but had issues...
              //oImg.setLeft((this.drawingTool.canvas.width / 2) - (oImg.width / 2));  // center image vertically and horizontally
              //oImg.setTop((this.drawingTool.canvas.height / 2) - (oImg.height / 2));
              //oImg.center();
              oImg.studentAssetId = copiedAsset.id; // keep track of this asset id
              _this4.drawingTool.canvas.add(oImg); // add copied asset image to canvas
            });
          }
        });
      }
    }
  }, {
    key: 'getPrompt',


    /**
     * Get the prompt to show to the student
     */
    value: function getPrompt() {
      var prompt = null;

      if (this.originalComponentContent != null) {
        // this is a show previous work component

        if (this.originalComponentContent.showPreviousWorkPrompt) {
          // show the prompt from the previous work component
          prompt = this.componentContent.prompt;
        } else {
          // show the prompt from the original component
          prompt = this.originalComponentContent.prompt;
        }
      } else if (this.componentContent != null) {
        prompt = this.componentContent.prompt;
      }

      return prompt;
    }
  }, {
    key: 'getDrawData',


    /**
     * Get the draw data
     * @return the draw data from the drawing tool as a JSON string
     */
    value: function getDrawData() {
      var drawData = null;

      drawData = this.drawingTool.save();

      return drawData;
    }
  }, {
    key: 'importWork',


    /**
     * Import work from another component
     * @param overwrite boolean value whether to import the work even if the
     * student already has work for this component
     */
    value: function importWork(overwrite) {
      var _this5 = this;

      // get the component content
      var componentContent = this.componentContent;

      if (componentContent != null) {

        // get the import previous work node id and component id
        var importPreviousWorkNodeId = componentContent.importPreviousWorkNodeId;
        var importPreviousWorkComponentId = componentContent.importPreviousWorkComponentId;

        if (importPreviousWorkNodeId == null || importPreviousWorkNodeId == '') {

          /*
           * check if the node id is in the field that we used to store
           * the import previous work node id in
           */
          if (componentContent.importWorkNodeId != null && componentContent.importWorkNodeId != '') {
            importPreviousWorkNodeId = componentContent.importWorkNodeId;
          }
        }

        if (importPreviousWorkComponentId == null || importPreviousWorkComponentId == '') {

          /*
           * check if the component id is in the field that we used to store
           * the import previous work component id in
           */
          if (componentContent.importWorkComponentId != null && componentContent.importWorkComponentId != '') {
            importPreviousWorkComponentId = componentContent.importWorkComponentId;
          }
        }

        if (importPreviousWorkNodeId != null && importPreviousWorkComponentId != null) {

          // get the latest component state for this component
          var componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);

          /*
           * we will only import work into this component if the student
           * has not done any work for this component
           */
          if (componentState == null || overwrite == true) {
            // the student has not done any work for this component

            // get the latest component state from the component we are importing from
            var importWorkComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(importPreviousWorkNodeId, importPreviousWorkComponentId);

            if (importWorkComponentState != null) {

              if (importWorkComponentState.componentType == 'ConceptMap') {

                var conceptMapData = null;

                if (importWorkComponentState.studentData != null) {
                  // get the concept map data from the other component state
                  conceptMapData = importWorkComponentState.studentData.conceptMapData;
                }

                if (conceptMapData != null) {
                  var serviceName = 'ConceptMapService';

                  if (this.$injector.has(serviceName)) {

                    // get the ConceptMapService
                    var service = this.$injector.get(serviceName);

                    // create an image from the concept map data
                    service.createImage(conceptMapData, componentContent.width, componentContent.height).then(function (image) {

                      // set the image as the background
                      _this5.drawingTool.setBackgroundImage(image);

                      // make the work dirty so that it gets saved
                      _this5.studentDataChanged();
                    });
                  }
                }
              } else {
                /*
                 * populate a new component state with the work from the
                 * imported component state
                 */
                var populatedComponentState = this.DrawService.populateComponentState(importWorkComponentState);

                // populate the component state into this component
                this.setStudentWork(populatedComponentState);

                if (this.componentContent.background != null && this.componentContent.background != '') {
                  // set the background
                  this.drawingTool.setBackgroundImage(this.componentContent.background);

                  // make the work dirty so that it gets saved
                  this.studentDataChanged();
                }
              }
            }
          }
        }
      }
    }
  }, {
    key: 'getComponentId',


    /**
     * Get the component id
     * @return the component id
     */
    value: function getComponentId() {
      return this.componentContent.id;
    }
  }, {
    key: 'authoringViewComponentChanged',


    /**
     * The component has changed in the regular authoring view so we will save the project
     */
    value: function authoringViewComponentChanged() {

      // update the JSON string in the advanced authoring view textarea
      this.updateAdvancedAuthoringView();

      /*
       * notify the parent node that the content has changed which will save
       * the project to the server
       */
      this.$scope.$parent.nodeAuthoringController.authoringViewNodeChanged();
    }
  }, {
    key: 'advancedAuthoringViewComponentChanged',


    /**
     * The component has changed in the advanced authoring view so we will update
     * the component and save the project.
     */
    value: function advancedAuthoringViewComponentChanged() {

      try {
        /*
         * create a new component by converting the JSON string in the advanced
         * authoring view into a JSON object
         */
        var editedComponentContent = angular.fromJson(this.authoringComponentContentJSONString);

        // replace the component in the project
        this.ProjectService.replaceComponent(this.nodeId, this.componentId, editedComponentContent);

        // set the new component into the controller
        this.componentContent = editedComponentContent;

        /*
         * notify the parent node that the content has changed which will save
         * the project to the server
         */
        this.$scope.$parent.nodeAuthoringController.authoringViewNodeChanged();
      } catch (e) {
        this.$scope.$parent.nodeAuthoringController.showSaveErrorAdvancedAuthoring();
      }
    }
  }, {
    key: 'updateAdvancedAuthoringView',


    /**
     * Update the component JSON string that will be displayed in the advanced authoring view textarea
     */
    value: function updateAdvancedAuthoringView() {
      this.authoringComponentContentJSONString = angular.toJson(this.authoringComponentContent, 4);
    }
  }, {
    key: 'getStepNodeIds',


    /**
     * Get all the step node ids in the project
     * @returns all the step node ids
     */
    value: function getStepNodeIds() {
      var stepNodeIds = this.ProjectService.getNodeIds();

      return stepNodeIds;
    }

    /**
     * Get the step number and title
     * @param nodeId get the step number and title for this node
     * @returns the step number and title
     */

  }, {
    key: 'getNodePositionAndTitleByNodeId',
    value: function getNodePositionAndTitleByNodeId(nodeId) {
      var nodePositionAndTitle = this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);

      return nodePositionAndTitle;
    }

    /**
     * Get the components in a step
     * @param nodeId get the components in the step
     * @returns the components in the step
     */

  }, {
    key: 'getComponentsByNodeId',
    value: function getComponentsByNodeId(nodeId) {
      var components = this.ProjectService.getComponentsByNodeId(nodeId);

      return components;
    }

    /**
     * Check if a node is a step node
     * @param nodeId the node id to check
     * @returns whether the node is an application node
     */

  }, {
    key: 'isApplicationNode',
    value: function isApplicationNode(nodeId) {
      var result = this.ProjectService.isApplicationNode(nodeId);

      return result;
    }

    /**
     * Get the image object representation of the student data
     * @returns an image object
     */

  }, {
    key: 'getImageObject',
    value: function getImageObject() {
      var pngFile = null;

      if (this.drawingTool != null && this.drawingTool.canvas != null) {

        // get the image as a base64 string
        var img_b64 = this.drawingTool.canvas.toDataURL('image/png');

        // get the image object
        pngFile = this.UtilService.getImageObjectFromBase64String(img_b64);
      }

      return pngFile;
    }

    /**
     * Set the draw data
     * @param componentState the component state
     */

  }, {
    key: 'setDrawData',
    value: function setDrawData(componentState) {
      if (componentState != null) {

        // get the student data from the component state
        var studentData = componentState.studentData;

        if (studentData != null) {

          var submitCounter = studentData.submitCounter;

          if (submitCounter != null) {
            // populate the submit counter
            this.submitCounter = submitCounter;
          }

          // get the draw data
          var drawData = studentData.drawData;

          if (drawData != null && drawData != '' && drawData != '{}') {
            // set the draw data into the drawing tool
            this.drawingTool.load(drawData);
          }
        }
      }
    }

    /**
     * Check if the student has drawn anything
     * @returns whether the canvas is empty
     */

  }, {
    key: 'isCanvasEmpty',
    value: function isCanvasEmpty() {

      var result = true;

      if (this.drawingTool != null && this.drawingTool.canvas != null) {

        // get the objects in the canvas where the student draws
        var objects = this.drawingTool.canvas.getObjects();

        if (objects != null && objects.length > 0) {
          // there are objects in the canvas
          result = false;
        }
      }

      return result;
    }

    /**
     * Set the message next to the save button
     * @param message the message to display
     * @param time the time to display
     */

  }, {
    key: 'setSaveMessage',
    value: function setSaveMessage(message, time) {
      this.saveMessage.text = message;
      this.saveMessage.time = time;
    }
  }, {
    key: 'showSnipDrawingButton',


    /**
     * Check whether we need to show the snip drawing button
     * @return whether to show the snip drawing button
     */
    value: function showSnipDrawingButton() {
      if (this.NotebookService.isNotebookEnabled() && this.isSnipDrawingButtonVisible) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Snip the drawing by converting it to an image
     * @param $event the click event
     */

  }, {
    key: 'snipDrawing',
    value: function snipDrawing($event, studentWorkId) {
      // get the canvas element
      var canvas = angular.element('#drawingtool_' + this.nodeId + '_' + this.componentId + ' canvas');

      if (canvas != null && canvas.length > 0) {

        // get the top canvas
        canvas = canvas[0];

        // get the canvas as a base64 string
        var img_b64 = canvas.toDataURL('image/png');

        // get the image object
        var imageObject = this.UtilService.getImageObjectFromBase64String(img_b64);

        // create a notebook item with the image populated into it
        var noteText = null;
        this.NotebookService.addNote($event, imageObject, noteText, [studentWorkId]);
      }
    }
  }, {
    key: 'snipButtonClicked',
    value: function snipButtonClicked($event) {
      var _this6 = this;

      if (this.isDirty) {
        var deregisterListener = this.$scope.$on('studentWorkSavedToServer', function (event, args) {
          var componentState = args.studentWork;
          if (componentState && _this6.nodeId === componentState.nodeId && _this6.componentId === componentState.componentId) {
            _this6.snipDrawing($event, componentState.id);
            deregisterListener();
          }
        });
        this.saveButtonClicked(); // trigger a save
      } else {
        var studentWork = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);
        this.snipDrawing($event, studentWork.id);
      }
    }

    /**
     * Register the the listener that will listen for the exit event
     * so that we can perform saving before exiting.
     */

  }, {
    key: 'registerExitListener',
    value: function registerExitListener() {

      /*
       * Listen for the 'exit' event which is fired when the student exits
       * the VLE. This will perform saving before the VLE exits.
       */
      this.exitListener = this.$scope.$on('exit', angular.bind(this, function (event, args) {

        this.$rootScope.$broadcast('doneExiting');
      }));
    }
  }, {
    key: 'componentHasWork',


    /**
     * Check if a component generates student work
     * @param component the component
     * @return whether the component generates student work
     */
    value: function componentHasWork(component) {
      var result = true;

      if (component != null) {
        result = this.ProjectService.componentHasWork(component);
      }

      return result;
    }

    /**
     * Add a stamp in the authoring
     */

  }, {
    key: 'authoringAddStampButtonClicked',
    value: function authoringAddStampButtonClicked() {

      // create the stamps field in the content if it does not exist
      if (this.authoringComponentContent != null) {

        // create a stamps object if it does not exist
        if (this.authoringComponentContent.stamps == null) {
          this.authoringComponentContent.stamps = {};
        }

        // create the Stamps array if it does not exist
        if (this.authoringComponentContent.stamps.Stamps == null) {
          this.authoringComponentContent.stamps.Stamps = [];
        }
      }

      /*
       * create the stamp as an empty string that the author will replace
       * with a file name or url
       */
      this.authoringComponentContent.stamps.Stamps.push('');

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Move a stamp up in the authoring view
     * @param index the index of the stamp
     */

  }, {
    key: 'authoringStampUpClicked',
    value: function authoringStampUpClicked(index) {

      // check if the stamp is not already at the top
      if (index != 0) {
        // the stamp is not at the top

        // get the stamp string
        var stamp = this.authoringComponentContent.stamps.Stamps[index];

        // remove the stamp
        this.authoringComponentContent.stamps.Stamps.splice(index, 1);

        // insert the stamp back into the array
        this.authoringComponentContent.stamps.Stamps.splice(index - 1, 0, stamp);

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Move the stamp down in the authoring view
     * @param index the index of the stamp
     */

  }, {
    key: 'authoringStampDownClicked',
    value: function authoringStampDownClicked(index) {

      // check if the stamp is already at the bottom
      if (index != this.authoringComponentContent.stamps.Stamps.length - 1) {
        // the stamp is not at the bottom

        // get the stamp string
        var stamp = this.authoringComponentContent.stamps.Stamps[index];

        // remove the stamp
        this.authoringComponentContent.stamps.Stamps.splice(index, 1);

        // insert the stamp back into the array
        this.authoringComponentContent.stamps.Stamps.splice(index + 1, 0, stamp);

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Delete a stamp from the authoring view
     * @param index the index of the stamp
     */

  }, {
    key: 'authoringDeleteStampClicked',
    value: function authoringDeleteStampClicked(index) {

      // ask the author if they are sure they want to delete the stamp
      var answer = confirm(this.$translate('draw.areYouSureYouWantToDeleteThisStamp') + '\n\n' + this.authoringComponentContent.stamps.Stamps[index]);

      if (answer) {

        // remove the stamp
        this.authoringComponentContent.stamps.Stamps.splice(index, 1);

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Enable all the tools
     */

  }, {
    key: 'authoringEnableAllToolsButtonClicked',
    value: function authoringEnableAllToolsButtonClicked() {

      if (this.authoringComponentContent.tools == null) {
        this.authoringComponentContent.tools = {};
      }

      // enable all the tools
      this.authoringComponentContent.tools.select = true;
      this.authoringComponentContent.tools.line = true;
      this.authoringComponentContent.tools.shape = true;
      this.authoringComponentContent.tools.freeHand = true;
      this.authoringComponentContent.tools.text = true;
      this.authoringComponentContent.tools.stamp = true;
      this.authoringComponentContent.tools.strokeColor = true;
      this.authoringComponentContent.tools.fillColor = true;
      this.authoringComponentContent.tools.clone = true;
      this.authoringComponentContent.tools.strokeWidth = true;
      this.authoringComponentContent.tools.sendBack = true;
      this.authoringComponentContent.tools.sendForward = true;
      this.authoringComponentContent.tools.undo = true;
      this.authoringComponentContent.tools.redo = true;
      this.authoringComponentContent.tools.delete = true;

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Disable all the tools
     */

  }, {
    key: 'authoringDisableAllToolsButtonClicked',
    value: function authoringDisableAllToolsButtonClicked() {

      if (this.authoringComponentContent.tools == null) {
        this.authoringComponentContent.tools = {};
      }

      // disable all the tools
      this.authoringComponentContent.tools.select = false;
      this.authoringComponentContent.tools.line = false;
      this.authoringComponentContent.tools.shape = false;
      this.authoringComponentContent.tools.freeHand = false;
      this.authoringComponentContent.tools.text = false;
      this.authoringComponentContent.tools.stamp = false;
      this.authoringComponentContent.tools.strokeColor = false;
      this.authoringComponentContent.tools.fillColor = false;
      this.authoringComponentContent.tools.clone = false;
      this.authoringComponentContent.tools.strokeWidth = false;
      this.authoringComponentContent.tools.sendBack = false;
      this.authoringComponentContent.tools.sendForward = false;
      this.authoringComponentContent.tools.undo = false;
      this.authoringComponentContent.tools.redo = false;
      this.authoringComponentContent.tools.delete = false;
    }

    /**
     * Save the starter draw data
     */

  }, {
    key: 'authoringSaveStarterDrawData',
    value: function authoringSaveStarterDrawData() {

      var answer = confirm(this.$translate('draw.areYouSureYouWantToSaveTheStarterDrawing'));

      if (answer) {
        // get the draw data
        var drawData = this.getDrawData();

        // set the starter draw data
        this.authoringComponentContent.starterDrawData = drawData;

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Delete the starter draw data
     */

  }, {
    key: 'authoringDeleteStarterDrawData',
    value: function authoringDeleteStarterDrawData() {

      var answer = confirm(this.$translate('draw.areYouSureYouWantToDeleteTheStarterDrawing'));

      if (answer) {
        // remove the starter draw data
        this.authoringComponentContent.starterDrawData = null;

        // clear the drawing
        this.drawingTool.clear();

        /*
         * the author has made changes so we will save the component
         * content
         */
        this.authoringViewComponentChanged();
      }
    }

    /**
     * The author has changed the width
     */

  }, {
    key: 'authoringViewWidthChanged',
    value: function authoringViewWidthChanged() {

      // update the width
      this.width = this.authoringComponentContent.width;

      // update the starter draw data if there is any
      if (this.authoringComponentContent.starterDrawData != null) {

        // get the starter draw data as a JSON object
        var starterDrawDataJSONObject = angular.fromJson(this.authoringComponentContent.starterDrawData);

        if (starterDrawDataJSONObject != null && starterDrawDataJSONObject.dt != null) {

          // update the width in the starter draw data
          starterDrawDataJSONObject.dt.width = this.width;

          // set the starter draw data back into the component content
          this.authoringComponentContent.starterDrawData = angular.toJson(starterDrawDataJSONObject);
        }
      }

      /*
       * the author has made changes so we will save the component
       * content
       */
      this.authoringViewComponentChanged();

      // re-initialize the drawing tool so the width is updated
      this.$timeout(angular.bind(this, this.initializeDrawingTool));
    }

    /**
     * The author has changed the height
     */

  }, {
    key: 'authoringViewHeightChanged',
    value: function authoringViewHeightChanged() {

      // update the height
      this.height = this.authoringComponentContent.height;

      // update the starter draw data if there is any
      if (this.authoringComponentContent.starterDrawData != null) {

        // get the starter draw data as a JSON object
        var starterDrawDataJSONObject = angular.fromJson(this.authoringComponentContent.starterDrawData);

        if (starterDrawDataJSONObject != null && starterDrawDataJSONObject.dt != null) {

          // update the height in the starter draw data
          starterDrawDataJSONObject.dt.height = this.height;

          // set the starter draw data back into the component content
          this.authoringComponentContent.starterDrawData = angular.toJson(starterDrawDataJSONObject);
        }
      }

      /*
       * the author has made changes so we will save the component
       * content
       */
      this.authoringViewComponentChanged();

      // re-initialize the drawing tool so the height is updated
      this.$timeout(angular.bind(this, this.initializeDrawingTool));
    }

    /**
     * The author has enabled or disabled a tool
     */

  }, {
    key: 'authoringViewToolClicked',
    value: function authoringViewToolClicked() {

      /*
       * the author has made changes so we will save the component
       * content
       */
      this.authoringViewComponentChanged();

      // re-initialize the drawing tool so the height is updated
      this.$timeout(angular.bind(this, this.initializeDrawingTool));
    }

    /**
     * The author has changed the rubric
     */

  }, {
    key: 'summernoteRubricHTMLChanged',
    value: function summernoteRubricHTMLChanged() {

      // get the summernote rubric html
      var html = this.summernoteRubricHTML;

      /*
       * remove the absolute asset paths
       * e.g.
       * <img src='https://wise.berkeley.edu/curriculum/3/assets/sun.png'/>
       * will be changed to
       * <img src='sun.png'/>
       */
      html = this.ConfigService.removeAbsoluteAssetPaths(html);

      /*
       * replace <a> and <button> elements with <wiselink> elements when
       * applicable
       */
      html = this.UtilService.insertWISELinks(html);

      // update the component rubric
      this.authoringComponentContent.rubric = html;

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Show the asset popup to allow the author to choose the background image
     */

  }, {
    key: 'chooseBackgroundImage',
    value: function chooseBackgroundImage() {

      // generate the parameters
      var params = {};
      params.isPopup = true;
      params.nodeId = this.nodeId;
      params.componentId = this.componentId;
      params.target = 'background';

      // display the asset chooser
      this.$rootScope.$broadcast('openAssetChooser', params);
    }

    /**
     * The background has changed so we will update the starter draw data if
     * it has been set and then save the project
     */

  }, {
    key: 'authoringViewBackgroundChanged',
    value: function authoringViewBackgroundChanged() {

      // get the starter draw data string
      var starterDrawData = this.authoringComponentContent.starterDrawData;

      if (starterDrawData != null) {

        // get the starter draw data JSON object
        var starterDrawDataJSON = angular.fromJson(starterDrawData);

        if (starterDrawDataJSON != null && starterDrawDataJSON.canvas != null && starterDrawDataJSON.canvas.backgroundImage != null && starterDrawDataJSON.canvas.backgroundImage.src != null) {

          // get the background
          var background = this.authoringComponentContent.background;

          /*
           * get the project assets directory path
           * e.g. https://www.berkeley.edu/curriculum/25/assets
           */
          var projectAssetsDirectoryPath = this.ConfigService.getProjectAssetsDirectoryPath(true);

          /*
           * generate the absolute path to the background image
           * e.g. https://www.berkeley.edu/curriculum/25/assets/earth.png
           */
          var newSrc = projectAssetsDirectoryPath + '/' + background;

          // set the new src
          starterDrawDataJSON.canvas.backgroundImage.src = newSrc;

          // convert the starter draw data back into a string
          this.authoringComponentContent.starterDrawData = angular.toJson(starterDrawDataJSON);
        }
      }

      // save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Add a connected component
     */

  }, {
    key: 'addConnectedComponent',
    value: function addConnectedComponent() {

      /*
       * create the new connected component object that will contain a
       * node id and component id
       */
      var newConnectedComponent = {};
      newConnectedComponent.nodeId = this.nodeId;
      newConnectedComponent.componentId = null;
      newConnectedComponent.updateOn = 'change';

      // initialize the array of connected components if it does not exist yet
      if (this.authoringComponentContent.connectedComponents == null) {
        this.authoringComponentContent.connectedComponents = [];
      }

      // add the connected component
      this.authoringComponentContent.connectedComponents.push(newConnectedComponent);

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Delete a connected component
     * @param index the index of the component to delete
     */

  }, {
    key: 'deleteConnectedComponent',
    value: function deleteConnectedComponent(index) {

      if (this.authoringComponentContent.connectedComponents != null) {
        this.authoringComponentContent.connectedComponents.splice(index, 1);
      }

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Set the show submit button value
     * @param show whether to show the submit button
     */

  }, {
    key: 'setShowSubmitButtonValue',
    value: function setShowSubmitButtonValue(show) {

      if (show == null || show == false) {
        // we are hiding the submit button
        this.authoringComponentContent.showSaveButton = false;
        this.authoringComponentContent.showSubmitButton = false;
      } else {
        // we are showing the submit button
        this.authoringComponentContent.showSaveButton = true;
        this.authoringComponentContent.showSubmitButton = true;
      }

      /*
       * notify the parent node that this component is changing its
       * showSubmitButton value so that it can show save buttons on the
       * step or sibling components accordingly
       */
      this.$scope.$emit('componentShowSubmitButtonValueChanged', { nodeId: this.nodeId, componentId: this.componentId, showSubmitButton: show });
    }

    /**
     * The showSubmitButton value has changed
     */

  }, {
    key: 'showSubmitButtonValueChanged',
    value: function showSubmitButtonValueChanged() {

      /*
       * perform additional processing for when we change the showSubmitButton
       * value
       */
      this.setShowSubmitButtonValue(this.authoringComponentContent.showSubmitButton);

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Open the asset choose to select an image for the stamp
     * @param index the index of the stamp
     */

  }, {
    key: 'chooseStampImage',
    value: function chooseStampImage(index) {

      // generate the parameters
      var params = {};
      params.isPopup = true;
      params.nodeId = this.nodeId;
      params.componentId = this.componentId;
      params.target = 'stamp';
      params.targetObject = index;

      // display the asset chooser
      this.$rootScope.$broadcast('openAssetChooser', params);
    }

    /**
     * Set the stamp image
     * @param index the index of the stamp
     * @param fileName the file name of the image
     */

  }, {
    key: 'setStampImage',
    value: function setStampImage(index, fileName) {
      this.authoringComponentContent.stamps.Stamps[index] = fileName;
    }

    /**
     * Add a tag
     */

  }, {
    key: 'addTag',
    value: function addTag() {

      if (this.authoringComponentContent.tags == null) {
        // initialize the tags array
        this.authoringComponentContent.tags = [];
      }

      // add a tag
      this.authoringComponentContent.tags.push('');

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Move a tag up
     * @param index the index of the tag to move up
     */

  }, {
    key: 'moveTagUp',
    value: function moveTagUp(index) {

      if (index > 0) {
        // the index is not at the top so we can move it up

        // remember the tag
        var tag = this.authoringComponentContent.tags[index];

        // remove the tag
        this.authoringComponentContent.tags.splice(index, 1);

        // insert the tag one index back
        this.authoringComponentContent.tags.splice(index - 1, 0, tag);
      }

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Move a tag down
     * @param index the index of the tag to move down
     */

  }, {
    key: 'moveTagDown',
    value: function moveTagDown(index) {

      if (index < this.authoringComponentContent.tags.length - 1) {
        // the index is not at the bottom so we can move it down

        // remember the tag
        var tag = this.authoringComponentContent.tags[index];

        // remove the tag
        this.authoringComponentContent.tags.splice(index, 1);

        // insert the tag one index forward
        this.authoringComponentContent.tags.splice(index + 1, 0, tag);
      }

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Delete a tag
     * @param index the index of the tag to delete
     */

  }, {
    key: 'deleteTag',
    value: function deleteTag(index) {

      // ask the author if they are sure they want to delete the tag
      var answer = confirm(this.$translate('areYouSureYouWantToDeleteThisTag'));

      if (answer) {
        // the author answered yes to delete the tag

        // remove the tag
        this.authoringComponentContent.tags.splice(index, 1);
      }

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Import any work we need from connected components
     */

  }, {
    key: 'handleConnectedComponents',
    value: function handleConnectedComponents() {

      // get the connected components
      var connectedComponents = this.componentContent.connectedComponents;

      if (connectedComponents != null) {

        var componentStates = [];

        // loop through all the connected components
        for (var c = 0; c < connectedComponents.length; c++) {
          var connectedComponent = connectedComponents[c];

          if (connectedComponent != null) {
            var nodeId = connectedComponent.nodeId;
            var componentId = connectedComponent.componentId;
            var type = connectedComponent.type;

            if (type == 'showWork') {
              // we are getting the work from this student

              // get the latest component state from the component
              var componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(nodeId, componentId);

              if (componentState != null) {
                componentStates.push(this.UtilService.makeCopyOfJSONObject(componentState));
              }

              // we are showing work so we will not allow the student to edit it
              this.isDisabled = true;
            } else if (type == 'importWork' || type == null) {
              // we are getting the work from this student

              // get the latest component state from the component
              var componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(nodeId, componentId);

              if (componentState != null) {
                componentStates.push(this.UtilService.makeCopyOfJSONObject(componentState));
              }
            }
          }
        }

        // merge the student responses from all the component states
        var mergedComponentState = this.createMergedComponentState(componentStates);

        // set the student work into the component
        this.setStudentWork(mergedComponentState);

        if (this.componentContent != null && this.componentContent.background != null) {

          /*
           * this component has a background so we will use it instead of
           * the background from the connected
           */
          this.drawingTool.setBackgroundImage(this.componentContent.background);
        }

        // make the work dirty so that it gets saved
        this.studentDataChanged();
      }
    }

    /**
     * Create a component state with the merged student responses
     * @param componentStates an array of component states
     * @return a component state with the merged student responses
     */

  }, {
    key: 'createMergedComponentState',
    value: function createMergedComponentState(componentStates) {

      // create a new component state
      var mergedComponentState = this.NodeService.createNewComponentState();

      if (componentStates != null) {

        // used to collect the objects from all the component states
        var allObjects = [];

        // the draw data from the first component state
        var firstDrawData = {};

        // loop through all the component state
        for (var c = 0; c < componentStates.length; c++) {
          var componentState = componentStates[c];
          if (componentState.componentType == 'Draw') {
            var studentData = componentState.studentData;

            if (studentData != null) {

              var drawData = studentData.drawData;

              if (drawData != null) {

                // convert the JSON string to a JSON object
                var drawDataJSON = angular.fromJson(drawData);

                if (drawDataJSON != null && drawDataJSON.canvas != null && drawDataJSON.canvas.objects != null) {

                  if (c == 0) {
                    // remember the first draw data
                    firstDrawData = drawDataJSON;
                  }

                  // append the objects
                  allObjects = allObjects.concat(drawDataJSON.canvas.objects);
                }
              }
            }
          } else if (componentState.componentType == 'Graph' || componentState.componentType == 'ConceptMap' || componentState.componentType == 'Embedded' || componentState.componentType == 'Label' || componentState.componentType == 'Table') {
            var connectedComponent = this.UtilService.getConnectedComponentByComponentState(this.componentContent, componentState);
            if (connectedComponent.importWorkAsBackground === true) {
              this.setComponentStateAsBackgroundImage(componentState);
            }
          }
        }

        if (allObjects != null) {

          // create the draw data with all the objects
          var _drawData = firstDrawData;

          if (_drawData != null && _drawData.canvas != null && _drawData.canvas.objects != null) {

            _drawData.canvas.objects = allObjects;
          }

          // set the draw data JSON string into the component state
          mergedComponentState.studentData = {};
          mergedComponentState.studentData.drawData = angular.toJson(_drawData);
        }
      }

      return mergedComponentState;
    }

    /**
     * Create an image from a component state and set the image as the background.
     * @param componentState A component state.
     */

  }, {
    key: 'setComponentStateAsBackgroundImage',
    value: function setComponentStateAsBackgroundImage(componentState) {
      var _this7 = this;

      this.UtilService.generateImageFromComponentState(componentState).then(function (image) {
        _this7.drawingTool.setBackgroundImage(image.url);
      });
    }

    /**
     * Add a connected component
     */

  }, {
    key: 'authoringAddConnectedComponent',
    value: function authoringAddConnectedComponent() {

      /*
       * create the new connected component object that will contain a
       * node id and component id
       */
      var newConnectedComponent = {};
      newConnectedComponent.nodeId = this.nodeId;
      newConnectedComponent.componentId = null;
      newConnectedComponent.type = null;
      this.authoringAutomaticallySetConnectedComponentComponentIdIfPossible(newConnectedComponent);

      // initialize the array of connected components if it does not exist yet
      if (this.authoringComponentContent.connectedComponents == null) {
        this.authoringComponentContent.connectedComponents = [];
      }

      // add the connected component
      this.authoringComponentContent.connectedComponents.push(newConnectedComponent);

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Automatically set the component id for the connected component if there
     * is only one viable option.
     * @param connectedComponent the connected component object we are authoring
     */

  }, {
    key: 'authoringAutomaticallySetConnectedComponentComponentIdIfPossible',
    value: function authoringAutomaticallySetConnectedComponentComponentIdIfPossible(connectedComponent) {
      if (connectedComponent != null) {
        var components = this.getComponentsByNodeId(connectedComponent.nodeId);
        if (components != null) {
          var numberOfAllowedComponents = 0;
          var allowedComponent = null;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var component = _step.value;

              if (component != null) {
                if (this.isConnectedComponentTypeAllowed(component.type) && component.id != this.componentId) {
                  // we have found a viable component we can connect to
                  numberOfAllowedComponents += 1;
                  allowedComponent = component;
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (numberOfAllowedComponents == 1) {
            /*
             * there is only one viable component to connect to so we
             * will use it
             */
            connectedComponent.componentId = allowedComponent.id;
            connectedComponent.type = 'importWork';
            this.authoringSetImportWorkAsBackgroundIfApplicable(connectedComponent);
          }
        }
      }
    }

    /**
     * Delete a connected component
     * @param index the index of the component to delete
     */

  }, {
    key: 'authoringDeleteConnectedComponent',
    value: function authoringDeleteConnectedComponent(index) {

      // ask the author if they are sure they want to delete the connected component
      var answer = confirm(this.$translate('areYouSureYouWantToDeleteThisConnectedComponent'));

      if (answer) {
        // the author answered yes to delete

        if (this.authoringComponentContent.connectedComponents != null) {
          this.authoringComponentContent.connectedComponents.splice(index, 1);
        }

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Get the connected component type
     * @param connectedComponent get the component type of this connected component
     * @return the connected component type
     */

  }, {
    key: 'authoringGetConnectedComponentType',
    value: function authoringGetConnectedComponentType(connectedComponent) {

      var connectedComponentType = null;

      if (connectedComponent != null) {

        // get the node id and component id of the connected component
        var nodeId = connectedComponent.nodeId;
        var componentId = connectedComponent.componentId;

        // get the component
        var component = this.ProjectService.getComponentByNodeIdAndComponentId(nodeId, componentId);

        if (component != null) {
          // get the component type
          connectedComponentType = component.type;
        }
      }

      return connectedComponentType;
    }

    /**
     * The connected component node id has changed
     * @param connectedComponent the connected component that has changed
     */

  }, {
    key: 'authoringConnectedComponentNodeIdChanged',
    value: function authoringConnectedComponentNodeIdChanged(connectedComponent) {
      if (connectedComponent != null) {
        connectedComponent.componentId = null;
        connectedComponent.type = null;
        delete connectedComponent.importWorkAsBackground;
        this.authoringAutomaticallySetConnectedComponentComponentIdIfPossible(connectedComponent);

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * The connected component component id has changed
     * @param connectedComponent the connected component that has changed
     */

  }, {
    key: 'authoringConnectedComponentComponentIdChanged',
    value: function authoringConnectedComponentComponentIdChanged(connectedComponent) {

      if (connectedComponent != null) {

        // default the type to import work
        connectedComponent.type = 'importWork';
        this.authoringSetImportWorkAsBackgroundIfApplicable(connectedComponent);

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * If the component type is a certain type, we will set the importWorkAsBackground
     * field to true.
     * @param connectedComponent The connected component object.
     */

  }, {
    key: 'authoringSetImportWorkAsBackgroundIfApplicable',
    value: function authoringSetImportWorkAsBackgroundIfApplicable(connectedComponent) {
      var componentType = this.authoringGetConnectedComponentType(connectedComponent);
      if (componentType == 'ConceptMap' || componentType == 'Embedded' || componentType == 'Graph' || componentType == 'Label' || componentType == 'Table') {
        connectedComponent.importWorkAsBackground = true;
      } else {
        delete connectedComponent.importWorkAsBackground;
      }
    }

    /**
     * The connected component type has changed
     * @param connectedComponent the connected component that changed
     */

  }, {
    key: 'authoringConnectedComponentTypeChanged',
    value: function authoringConnectedComponentTypeChanged(connectedComponent) {

      if (connectedComponent != null) {

        if (connectedComponent.type == 'importWork') {
          /*
           * the type has changed to import work
           */
        } else if (connectedComponent.type == 'showWork') {}
        /*
         * the type has changed to show work
         */


        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Check if we are allowed to connect to this component type
     * @param componentType the component type
     * @return whether we can connect to the component type
     */

  }, {
    key: 'isConnectedComponentTypeAllowed',
    value: function isConnectedComponentTypeAllowed(componentType) {

      if (componentType != null) {

        var allowedConnectedComponentTypes = this.allowedConnectedComponentTypes;

        // loop through the allowed connected component types
        for (var a = 0; a < allowedConnectedComponentTypes.length; a++) {
          var allowedConnectedComponentType = allowedConnectedComponentTypes[a];

          if (allowedConnectedComponentType != null) {
            if (componentType == allowedConnectedComponentType.type) {
              // the component type is allowed
              return true;
            }
          }
        }
      }

      return false;
    }

    /**
     * The show JSON button was clicked to show or hide the JSON authoring
     */

  }, {
    key: 'showJSONButtonClicked',
    value: function showJSONButtonClicked() {
      // toggle the JSON authoring textarea
      this.showJSONAuthoring = !this.showJSONAuthoring;

      if (this.jsonStringChanged && !this.showJSONAuthoring) {
        /*
         * the author has changed the JSON and has just closed the JSON
         * authoring view so we will save the component
         */
        this.advancedAuthoringViewComponentChanged();

        // scroll to the top of the component
        this.$rootScope.$broadcast('scrollToComponent', { componentId: this.componentId });

        this.jsonStringChanged = false;
      }
    }

    /**
     * The author has changed the JSON manually in the advanced view
     */

  }, {
    key: 'authoringJSONChanged',
    value: function authoringJSONChanged() {
      this.jsonStringChanged = true;
    }
  }, {
    key: 'showCopyPublicNotebookItemButton',
    value: function showCopyPublicNotebookItemButton() {
      return this.ProjectService.isSpaceExists("public");
    }
  }, {
    key: 'copyPublicNotebookItemButtonClicked',
    value: function copyPublicNotebookItemButtonClicked(event) {
      this.$rootScope.$broadcast('openNotebook', { nodeId: this.nodeId, componentId: this.componentId, insertMode: true, requester: this.nodeId + '-' + this.componentId, visibleSpace: "public" });
    }
  }, {
    key: 'importWorkByStudentWorkId',
    value: function importWorkByStudentWorkId(studentWorkId) {
      var _this8 = this;

      this.StudentDataService.getStudentWorkById(studentWorkId).then(function (componentState) {
        if (componentState != null) {
          _this8.setStudentWork(componentState);
          _this8.setParentStudentWorkIdToCurrentStudentWork(studentWorkId);
          _this8.$rootScope.$broadcast('closeNotebook');
        }
      });
    }
  }, {
    key: 'setParentStudentWorkIdToCurrentStudentWork',
    value: function setParentStudentWorkIdToCurrentStudentWork(studentWorkId) {
      this.parentStudentWorkIds = [studentWorkId];
    }

    /**
     * The "Import Work As Background" checkbox was clicked.
     * @param connectedComponent The connected component associated with the
     * checkbox.
     */

  }, {
    key: 'authoringImportWorkAsBackgroundClicked',
    value: function authoringImportWorkAsBackgroundClicked(connectedComponent) {
      if (!connectedComponent.importWorkAsBackground) {
        delete connectedComponent.importWorkAsBackground;
      }
      this.authoringViewComponentChanged();
    }
  }]);

  return DrawController;
}(_componentController2.default);

DrawController.$inject = ['$filter', '$injector', '$mdDialog', '$q', '$rootScope', '$scope', '$timeout', 'AnnotationService', 'ConfigService', 'DrawService', 'NodeService', 'NotebookService', 'ProjectService', 'StudentAssetService', 'StudentDataService', 'UtilService'];

exports.default = DrawController;
//# sourceMappingURL=drawController.js.map
