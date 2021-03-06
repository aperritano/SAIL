'use strict';

import HTMLService from './htmlService';
import HTMLController from './htmlController';
import HTMLAuthoringController from './htmlAuthoringController';

let htmlComponentModule = angular.module('htmlComponentModule', [])
  .service(HTMLService.name, HTMLService)
  .controller(HTMLController.name, HTMLController)
  .controller(HTMLAuthoringController.name, HTMLAuthoringController)
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/html/i18n');
    }
  ]);

export default htmlComponentModule;
