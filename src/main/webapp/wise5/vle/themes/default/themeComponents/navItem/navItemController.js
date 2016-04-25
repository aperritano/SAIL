"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavItemController = function () {
    function NavItemController($rootScope, $scope, $translate, $element, NodeService, ProjectService, StudentDataService) {
        var _this = this;

        _classCallCheck(this, NavItemController);

        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$element = $element;
        this.$translate = $translate;
        this.NodeService = NodeService;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;

        this.expanded = false;

        this.item = this.ProjectService.idToNode[this.nodeId];
        this.isGroup = this.ProjectService.isGroupNode(this.nodeId);
        this.nodeStatuses = this.StudentDataService.nodeStatuses;
        this.nodeStatus = this.nodeStatuses[this.nodeId];

        this.nodeTitle = this.showPosition ? this.ProjectService.idToPosition[this.nodeId] + ': ' + this.item.title : this.item.title;
        this.currentNode = this.StudentDataService.currentNode;
        this.isCurrentNode = this.currentNode.id === this.nodeId;
        this.setNewNode = false;

        // whether this node is a planning node
        this.isPlanning = this.ProjectService.isPlanning(this.nodeId);

        // the array of nodes used for drag/drop planning sorting
        this.availablePlanningNodes = [];

        /*
         * the array of nodes used for drag/drop planning sorting. the elements
         * in this array are not the actual nodes that are in the project.
         * they are just mirrors of them. when the elements in this array
         * are added/moved/deleted we will do the same to the actual nodes
         * that are in the project.
         */
        this.planningNodeInstances = [];

        this.parentGroupId = null;

        // the options for the planning node template tree
        this.treeOptions1 = {
            accept: function accept(sourceNodeScope, destNodesScope, destIndex) {
                /*
                 * do not allow any nodes to be dropped in this tree
                 * since it is the source tree
                 */
                return false;
            }
        };

        /*
         * whether planning mode is on or off which determines if students
         * can edit planning related aspects of the project such as adding,
         * moving, or deleting planning steps.
         */
        this.planningMode = false;

        var parentGroup = this.ProjectService.getParentGroup(this.nodeId);

        if (parentGroup != null) {
            this.parentGroupId = parentGroup.id;
            this.isParentGroupPlanning = this.ProjectService.isPlanning(this.parentGroupId);
        }

        if (this.isPlanning) {
            /*
             * planning is enabled so we will get the available planning
             * nodes that can be used in this group
             */
            this.availablePlanningNodes = this.ProjectService.getAvailablePlanningNodes(this.nodeId);
        }

        if (this.isParentGroupPlanning) {

            if (parentGroup.planningMode) {
                // the parent is currently in planning mode
                this.planningMode = true;
            }

            /*
             * planning is enabled so we will get the available planning
             * nodes that can be used in this group
             */
            this.availablePlanningNodes = this.ProjectService.getAvailablePlanningNodes(this.parentGroupId);

            /*
             * update the nodes in the select drop down used to move planning
             * nodes around
             */
            this.updateSiblingNodeIds();

            this.$scope.$watch(function () {
                // watch the position of this node
                return this.ProjectService.idToPosition[this.nodeId];
            }.bind(this), function (value) {
                // the position has changed for this node so we will update it in the UI
                this.nodeTitle = this.showPosition ? this.ProjectService.idToPosition[this.nodeId] + ': ' + this.item.title : this.item.title;

                /*
                 * update the nodes in the select drop down used to move planning
                 * nodes around
                 */
                this.updateSiblingNodeIds();
            }.bind(this));
        }

        this.$scope.$watch(function () {
            return this.StudentDataService.currentNode;
        }.bind(this), function (newNode) {
            this.currentNode = newNode;
            if (this.StudentDataService.previousStep) {
                this.$scope.$parent.isPrevStep = this.nodeId === this.StudentDataService.previousStep.id;
            }
            this.isCurrentNode = this.currentNode.id === this.nodeId;
            if (this.isCurrentNode || this.ProjectService.isApplicationNode(newNode.id) || newNode.id === this.ProjectService.rootNode.id) {
                this.setExpanded();
            }
        }.bind(this));

        this.$scope.$watch(function () {
            return this.expanded;
        }.bind(this), function (value) {
            this.$scope.$parent.itemExpanded = value;
            if (value) {
                this.zoomToElement();
            }
        }.bind(this));

        // watch the planning node instances used for drag/drop planning sorting
        this.$scope.$watchCollection('navitemCtrl.planningNodeInstances', function (newValue, oldValue) {
            // the planning node instances have changed
            this.planningNodeInstancesChanged(newValue, oldValue);
        }.bind(this));

        this.$rootScope.$on('planningNodeChanged', function () {
            /*
             * update the nodes in the select drop down used to move planning
             * nodes around
             */
            _this.updateSiblingNodeIds();
        });

        // a group node has turned on or off planning mode
        this.$rootScope.$on('togglePlanningModeClicked', function (event, args) {

            // get the group node that has had its planning node changed
            var planningModeClickedNodeId = args.nodeId;
            var planningMode = args.planningMode;

            // get this node's parent group
            var parentGroup = _this.ProjectService.getParentGroup(_this.nodeId);
            var parentGroupId = null;

            if (parentGroup != null) {
                parentGroupId = parentGroup.id;
            }

            if (parentGroupId == planningModeClickedNodeId) {
                // the parent of this node has changed their planning mode
                _this.planningMode = planningMode;
            }
        });

        this.setExpanded();
    }

    _createClass(NavItemController, [{
        key: 'updateSiblingNodeIds',
        value: function updateSiblingNodeIds() {
            var childNodeIds = this.ProjectService.getChildNodeIdsById(this.parentGroupId);

            this.siblingNodeIds = [];
            this.siblingNodeIds.push(this.parentGroupId);
            this.siblingNodeIds = this.siblingNodeIds.concat(childNodeIds);
        }
    }, {
        key: 'getTemplateUrl',
        value: function getTemplateUrl() {
            return this.ProjectService.getThemePath() + '/themeComponents/navItem/navItem.html';
        }
    }, {
        key: 'setExpanded',
        value: function setExpanded() {
            this.$scope.expanded = this.isCurrentNode || this.$scope.isGroup && this.ProjectService.isNodeDescendentOfGroup(this.$scope.currentNode, this.$scope.item);
            if (this.$scope.expanded && this.isCurrentNode) {
                this.expanded = true;
                this.zoomToElement();
            }
        }
    }, {
        key: 'zoomToElement',
        value: function zoomToElement() {
            var _this2 = this;

            setTimeout(function () {
                // smooth scroll to expanded group's page location
                var location = _this2.isGroup ? _this2.$element[0].offsetTop - 32 : 0;
                var delay = _this2.isGroup ? 350 : 0;
                $('#content').animate({
                    scrollTop: location
                }, delay, 'linear', function () {
                    if (_this2.setNewNode) {
                        _this2.setNewNode = false;
                        _this2.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(_this2.nodeId);
                    }
                });
            }, 250);
        }
    }, {
        key: 'itemClicked',
        value: function itemClicked() {
            if (this.isGroup) {
                if (!this.expanded) {
                    this.setNewNode = true;
                }
                this.expanded = !this.expanded;
            } else {
                if (this.StudentDataService.planningMode) {
                    // Don't allow students to enter planning steps while in planning mode
                    this.$translate('planningModeStepsUnVisitable').then(function (planningModeStepsUnVisitable) {
                        alert(planningModeStepsUnVisitable);
                    });
                } else {
                    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
                }
            }
        }
    }, {
        key: 'savePlanningNodeAddedEvent',


        /**
         * Save an event when planning node is added
         * @param planningNodeAdded
         */
        value: function savePlanningNodeAddedEvent(planningNodeAdded) {
            var componentId = null;
            var componentType = null;
            var category = "Planning";
            var eventName = "planningNodeAdded";
            var eventData = {
                nodeIdAdded: planningNodeAdded.id,
                templateNodeId: planningNodeAdded.templateId
            };
            var eventNodeId = this.nodeId;
            this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
        }
    }, {
        key: 'canAddPlanningNode',


        /**
         * Returns true iff this student can add the specified planning node.
         * Limits include reaching the max allowed count
         * @param planningNodeId
         */
        value: function canAddPlanningNode(planningNodeId) {
            var maxAddAllowed = 1; // by default, students can only add up to one planning node.
            var planningGroupNode = null;
            if (this.isParentGroupPlanning) {
                planningGroupNode = this.ProjectService.getNodeById(this.parentGroupId);
            } else {
                planningGroupNode = this.ProjectService.getNodeById(this.nodeId);
            }
            // get the maxAddAllowed value by looking up the planningNode in the project.
            if (planningGroupNode != null && planningGroupNode.availablePlanningNodes != null) {
                for (var a = 0; a < planningGroupNode.availablePlanningNodes.length; a++) {
                    var availablePlanningNode = planningGroupNode.availablePlanningNodes[a];
                    if (availablePlanningNode.nodeId === planningNodeId && availablePlanningNode.max != null) {
                        maxAddAllowed = availablePlanningNode.max;
                    }
                }
            }

            // if maxAddAllowed was not found, it means they can add as many as they want
            if (maxAddAllowed === -1) {
                return true;
            }

            var numPlanningNodesAdded = 0; // keep track of number of instances
            // otherwise, see how many times the planning node template has been used.
            // loop through the child ids in the planning group and see how many times they've been used
            if (planningGroupNode.ids != null) {
                for (var c = 0; c < planningGroupNode.ids.length; c++) {
                    var childPlanningNodeId = planningGroupNode.ids[c];
                    var childPlanningNode = this.ProjectService.getNodeById(childPlanningNodeId);
                    if (childPlanningNode != null && childPlanningNode.templateId === planningNodeId) {
                        numPlanningNodesAdded++;
                    }
                }
            }

            return numPlanningNodesAdded < maxAddAllowed;
        }
    }, {
        key: 'addPlanningNodeInstanceInside',


        /**
         * Create a planning node instance and add it to the project
         * @param groupId the group the new planning node instance will be added to
         * @param templateNodeId the node id of the planning node template
         * @returns the planning node instance
         */
        value: function addPlanningNodeInstanceInside(nodeIdToInsertInside, templateNodeId) {
            // create the planning node instance
            var nextAvailablePlanningNodeId = this.StudentDataService.getNextAvailablePlanningNodeId();
            var planningNodeInstance = this.ProjectService.createPlanningNodeInstance(nodeIdToInsertInside, templateNodeId, nextAvailablePlanningNodeId);

            // add the planning node instance inside
            this.ProjectService.addPlanningNodeInstanceInside(nodeIdToInsertInside, planningNodeInstance);

            /*
             * update the node statuses so that a node status is created for
             * the new planning node instance
             */
            this.StudentDataService.updateNodeStatuses();

            // perform any necessary updating
            this.planningNodeChanged();

            // Save add planning node event
            this.savePlanningNodeAddedEvent(planningNodeInstance);

            return planningNodeInstance;
        }

        /**
         * Create a planning node instance and add it to the project
         * @param groupId the group the new planning node instance will be added to
         * @param nodeId the node id of the planning node template
         */

    }, {
        key: 'addPlanningNodeInstanceAfter',
        value: function addPlanningNodeInstanceAfter(nodeIdToInsertAfter, templateNodeId) {

            var parentGroup = this.ProjectService.getParentGroup(nodeIdToInsertAfter);

            if (parentGroup != null) {
                var parentGroupId = parentGroup.id;

                // create the planning node instance
                var nextAvailablePlanningNodeId = this.StudentDataService.getNextAvailablePlanningNodeId();
                var planningNodeInstance = this.ProjectService.createPlanningNodeInstance(parentGroupId, templateNodeId, nextAvailablePlanningNodeId);

                // insert planning node instance after
                this.ProjectService.addPlanningNodeInstanceAfter(nodeIdToInsertAfter, planningNodeInstance);

                /*
                 * update the node statuses so that a node status is created for
                 * the new planning node instance
                 */
                this.StudentDataService.updateNodeStatuses();

                // perform any necessary updating
                this.planningNodeChanged();

                // Save add planning node event
                this.savePlanningNodeAddedEvent(planningNodeInstance);

                return planningNodeInstance;
            }
        }

        /**
         * Remove the planning node instance
         * @param planningNodeInstanceNodeId the planning node instance to remove
         */

    }, {
        key: 'removePlanningNodeInstance',
        value: function removePlanningNodeInstance(planningNodeInstanceNodeId) {
            // delete the node from the project
            this.ProjectService.deleteNode(planningNodeInstanceNodeId);

            // perform any necessary updating
            this.planningNodeChanged();

            // Save remove planning node event
            var componentId = null;
            var componentType = null;
            var category = "Planning";
            var eventName = "planningNodeRemoved";
            var eventData = {
                nodeIdRemoved: planningNodeInstanceNodeId
            };
            var eventNodeId = this.nodeId;
            this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
        }

        /**
         * Get the node title
         * @param nodeId get the title for this node
         * @returns the title for the node
         */

    }, {
        key: 'getNodeTitle',
        value: function getNodeTitle(nodeId) {
            var node = this.ProjectService.idToNode[nodeId];
            var title = null;

            if (node != null) {
                title = node.title;
            }

            // get the position
            var position = this.ProjectService.idToPosition[nodeId];

            if (position == null) {
                return title;
            } else {
                return position + ': ' + title;
            }
        }

        /**
         * Get the node description
         * @param nodeId get the description for this node
         * @returns the description for the node
         */

    }, {
        key: 'getNodeDescription',
        value: function getNodeDescription(nodeId) {
            var node = this.ProjectService.idToNode[nodeId];
            var description = null;

            if (node != null) {
                description = node.description;
            }

            return description;
        }

        /**
         * Move the planning node. If the other node is a group node, we will
         * insert this node as the first node in the group. If the other node is
         * a step node, we will insert this node after the other node.
         * @param otherNodeId the other node we will move this node inside or after
         */

    }, {
        key: 'movePlanningNode0',
        value: function movePlanningNode0(otherNodeId) {

            /*
             * check that this node is not the same as the other node.
             * if they are the same we don't need to do anything.
             */
            if (this.nodeId != otherNodeId) {
                if (this.ProjectService.isGroupNode(otherNodeId)) {
                    // insert this node inside the group node
                    this.ProjectService.movePlanningNodeInstanceInside(this.nodeId, otherNodeId);
                } else {
                    // insert this node after the other node
                    this.ProjectService.movePlanningNodeInstanceAfter(this.nodeId, otherNodeId);
                }

                // Save move planning node event
                var componentId = null;
                var componentType = null;
                var category = "Planning";
                var eventName = "planningNodeMoved";
                var eventData = {
                    nodeIdMoved: this.nodeId,
                    nodeIdMovedInsideOrAfter: otherNodeId
                };
                var eventNodeId = this.nodeId;
                this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
            }

            // perform any necessary updating
            this.planningNodeChanged();
        }

        /**
         * Move the planning node. If the other node is a group node, we will
         * insert this node as the first node in the group. If the other node is
         * a step node, we will insert this node after the other node.
         * @param otherNodeId the other node we will move this node inside or after
         */

    }, {
        key: 'movePlanningNode',
        value: function movePlanningNode(nodeIdToMove, nodeIdToMoveAfter) {

            /*
             * check that this node is not the same as the other node.
             * if they are the same we don't need to do anything.
             */
            if (nodeIdToMove != nodeIdToMoveAfter) {
                if (this.ProjectService.isGroupNode(nodeIdToMoveAfter)) {
                    // insert this node inside the group node
                    this.ProjectService.movePlanningNodeInstanceInside(nodeIdToMove, nodeIdToMoveAfter);
                } else {
                    // insert this node after the other node
                    this.ProjectService.movePlanningNodeInstanceAfter(nodeIdToMove, nodeIdToMoveAfter);
                }
            }

            // perform any necessary updating
            this.planningNodeChanged();
        }

        /**
         * Something related to planning has changed in the project. This
         * means a planning node was added, moved, or deleted.
         */

    }, {
        key: 'planningNodeChanged',
        value: function planningNodeChanged() {
            this.$rootScope.$broadcast('planningNodeChanged');
        }

        /**
         * Toggle the planning mode on and off. Notify child nodes that 
         * the planning mode has changed so they can act accordingly.
         */

    }, {
        key: 'togglePlanningMode',
        value: function togglePlanningMode() {
            if (this.StudentDataService.planningMode && !this.item.planningMode) {
                // Don't allow multiple concurrent planning modes.
                this.$translate('planningModeOnlyOnePlanningModeAllowed').then(function (planningModeOnlyOnePlanningModeAllowed) {
                    alert(planningModeOnlyOnePlanningModeAllowed);
                });

                return;
            }
            // toggle the planning mode
            this.planningMode = !this.planningMode;
            this.item.planningMode = this.planningMode;
            // also toggle StudentDataService planning mode. This will be used to constrain the entire project when in planning mode.
            this.StudentDataService.planningMode = this.planningMode;

            if (!this.planningMode) {
                // Student is exiting planning mode, so save the changed nodes in NodeState

                var nodeState = this.NodeService.createNewNodeState();
                nodeState.nodeId = this.nodeId;
                nodeState.isAutoSave = false;
                nodeState.isSubmit = false;

                var studentData = {};
                studentData.nodeId = this.nodeId;
                studentData.nodes = [];
                var planningNode = this.ProjectService.getNodeById(this.nodeId);
                studentData.nodes.push(planningNode); // add the planning node (group)
                // loop through the child ids in the planning group and save them also
                if (planningNode.ids != null) {
                    for (var c = 0; c < planningNode.ids.length; c++) {
                        var childPlanningNodeId = planningNode.ids[c];
                        var childPlanningNode = this.ProjectService.getNodeById(childPlanningNodeId);
                        studentData.nodes.push(childPlanningNode);
                    }
                }

                nodeState.studentData = studentData;
                var nodeStates = [];
                nodeStates.push(nodeState);
                this.StudentDataService.saveNodeStates(nodeStates);
            }

            // Save planning mode on/off event
            var componentId = null;
            var componentType = null;
            var category = "Planning";
            var eventName = this.planningMode ? "planningModeOn" : "planningModeOff";
            var eventData = {
                nodeId: this.nodeId
            };
            var eventNodeId = this.nodeId;
            this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);

            // notify the child nodes that the planning mode of this group node has changed
            this.$rootScope.$broadcast('togglePlanningModeClicked', { nodeId: this.nodeId, planningMode: this.planningMode });
        }

        /**
         * The student has clicked the X on a planning step to delete it
         * @param planningNodeInstance the planning node instance object to delete
         */

    }, {
        key: 'deletePlanningNodeInstance',
        value: function deletePlanningNodeInstance(planningNodeInstance) {

            var planningNodeInstances = this.planningNodeInstances;

            if (planningNodeInstances != null) {

                // get the index of the planning node instance we are deleting
                var index = planningNodeInstances.indexOf(planningNodeInstance);

                if (index != null && index != -1) {
                    // delete the planning node instance
                    planningNodeInstances.splice(index, 1);
                }
            }
        }

        /**
         * The planning node instances array has changed
         * @param newValue the new value of the planning instance array
         * @param oldValue the old value of the planning instance array
         */

    }, {
        key: 'planningNodeInstancesChanged',
        value: function planningNodeInstancesChanged(newValue, oldValue) {

            if (newValue.length == oldValue.length) {
                // the length is the same as before

                if (newValue.length == 0) {
                    /*
                     * if the length is 0 it means this function was called during
                     * angular initialization and nothing really changed
                     */
                } else {
                        // the student moved a planning step

                        // find the node that was moved and where it was placed
                        var movedPlanningNodeResults = this.findMovedPlanningNode(newValue, oldValue);

                        if (movedPlanningNodeResults != null) {
                            var movedPlanningNode = movedPlanningNodeResults.movedPlanningNode;
                            var nodeIdAddedAfter = movedPlanningNodeResults.nodeIdAddedAfter;

                            if (nodeIdAddedAfter == null) {
                                // the node was moved to the beginning of the group
                                this.movePlanningNode(movedPlanningNode.id, this.nodeId);
                            } else {
                                // the node was moved after another node in the group
                                this.movePlanningNode(movedPlanningNode.id, nodeIdAddedAfter);
                            }
                        }
                    }
            } else if (newValue.length > oldValue.length) {
                // the student added a planning step

                // find the node that was added and where it was placed
                var addedPlanningNodeResults = this.findAddedPlanningNode(newValue, oldValue);
                var addedPlanningNode = addedPlanningNodeResults.addedPlanningNode;
                var nodeIdAddedAfter = addedPlanningNodeResults.nodeIdAddedAfter;

                var planningNodeInstance = null;

                if (nodeIdAddedAfter == null) {
                    // the node was added at the beginning of the group
                    planningNodeInstance = this.addPlanningNodeInstanceInside(this.nodeId, addedPlanningNode.id);
                } else {
                    // the node was added after another node in the group
                    planningNodeInstance = this.addPlanningNodeInstanceAfter(nodeIdAddedAfter, addedPlanningNode.id);
                }

                // update the ids
                addedPlanningNode.templateId = planningNodeInstance.templateId;
                addedPlanningNode.id = planningNodeInstance.id;
            } else if (newValue.length < oldValue.length) {
                // the student deleted a planning step

                // find the node that was deleted
                var deletedPlanningNode = this.findDeletedPlanningNode(newValue, oldValue);

                // remove the node
                this.removePlanningNodeInstance(deletedPlanningNode.id);
            }
        }

        /**
         * Find the node that was moved and where it was moved to
         * @param newPlanningNodes the new array of planning nodes
         * @param oldPlanningNodes the old array of planning nodes
         * @returns an object containing the node that was moved
         * and the node id it was moved after
         */

    }, {
        key: 'findMovedPlanningNode',
        value: function findMovedPlanningNode(newPlanningNodes, oldPlanningNodes) {
            var movedPlanningNode = null;
            var nodeIdAddedAfter = null;

            // an array used to keep track of the nodes that were moved up
            var planningNodesMovedUp = [];

            // an array used to keep track of the nodes that were moved down
            var planningNodesMovedDown = [];

            // loop through all the old nodes
            for (var o = 0; o < oldPlanningNodes.length; o++) {
                // get the index of the node in the old array
                var oldIndex = o;

                // get the node
                var oldPlanningNode = oldPlanningNodes[o];

                // get the index of the node in the new array
                var newIndex = newPlanningNodes.indexOf(oldPlanningNode);

                if (oldIndex == newIndex) {
                    // the node was not moved
                } else if (oldIndex < newIndex) {
                        // the node was moved down
                        planningNodesMovedDown.push(oldPlanningNode);
                    } else if (oldIndex > newIndex) {
                        // the node was moved up
                        planningNodesMovedUp.push(oldPlanningNode);
                    }
            }

            /*
             * since the student can only drag one node at a time, it means one
             * of the planningNodesMovedDown or planningNodesMovedUp arrays must
             * only contain one element. when referring to nodes moving up and down
             * it is in reference to the UI which is opposite of the array index.
             * moving a node down in the UI will move it up in the array index.
             * consider the case when the student moves a node from the
             * top to the bottom. all the node indexes will have seemed to 
             * move up except for the node that was moved down. the 
             * opposite case of moving a node from the bottom to the top is similar.
             * all the node indexes will have seemed to move down except for the
             * node that was moved up. in all cases only one node will move up and
             * other nodes will move down or one node will move down and other
             * nodes will move up. we will look for the lone node that moved in
             * a given direction as opposed to all the other nodes that moved the
             * other direction.
             */
            if (planningNodesMovedDown.length == 1) {
                // the student moved one node down
                movedPlanningNode = planningNodesMovedDown[0];
            } else if (planningNodesMovedUp.length == 1) {
                // the student moved one node up
                movedPlanningNode = planningNodesMovedUp[0];
            }

            if (movedPlanningNode != null) {
                // get the new index of the node that was moved
                var newIndex = newPlanningNodes.indexOf(movedPlanningNode);

                if (newIndex == 0) {
                    // the node is the first in the group
                    nodeIdAddedAfter = null;
                } else {
                    /*
                     * the node is after a node in the group so we will get
                     * the node id of the node that comes before it
                     */
                    var previousNode = newPlanningNodes[newIndex - 1];

                    if (previousNode != null) {
                        nodeIdAddedAfter = previousNode.id;
                    }
                }
            }

            var returnValue = {};
            returnValue.movedPlanningNode = movedPlanningNode;
            returnValue.nodeIdAddedAfter = nodeIdAddedAfter;

            return returnValue;
        }

        /**
         * Find the node that was added and where it was moved to
         * @param newPlanningNodes the new array of planning nodes
         * @param oldPlanningNodes the old array of planning nodes
         * @returns an object containing the node that was added
         * and the node id it was added after
         */

    }, {
        key: 'findAddedPlanningNode',
        value: function findAddedPlanningNode(newPlanningNodes, oldPlanningNodes) {
            var addedPlanningNode = null;
            var nodeIdAddedAfter = null;

            // loop through all the new nodes
            for (var n = 0; n < newPlanningNodes.length; n++) {
                var newPlanningNode = newPlanningNodes[n];

                if (newPlanningNode != null) {

                    // look up the node in the old nodes array
                    if (oldPlanningNodes.indexOf(newPlanningNode) == -1) {
                        /*
                         * the node was not found in the old array which means
                         * we have found the new node
                         */
                        addedPlanningNode = newPlanningNode;

                        if (n == 0) {
                            // the node is the first in the group
                            nodeIdAddedAfter = null;
                        } else {
                            /*
                             * the node is after a node in the group so we will get
                             * the node id of the node that comes before it
                             */
                            var previousPlanningNode = newPlanningNodes[n - 1];

                            if (previousPlanningNode != null) {
                                nodeIdAddedAfter = previousPlanningNode.id;
                            }
                        }

                        break;
                    }
                }
            }

            var returnValue = {};
            returnValue.addedPlanningNode = addedPlanningNode;
            returnValue.nodeIdAddedAfter = nodeIdAddedAfter;

            return returnValue;
        }

        /**
         * Find the node that was deleted
         * @param newPlanningNodes the new array of planning nodes
         * @param oldPlanningNodes the old array of planning nodes
         * @returns the node that was deleted
         */

    }, {
        key: 'findDeletedPlanningNode',
        value: function findDeletedPlanningNode(newPlanningNodes, oldPlanningNodes) {

            // loop through all the old nodes
            for (var o = 0; o < oldPlanningNodes.length; o++) {
                var oldPlanningNode = oldPlanningNodes[o];

                if (oldPlanningNode != null) {
                    if (newPlanningNodes.indexOf(oldPlanningNode) == -1) {
                        /*
                         * the node was not found in the old array which means
                         * we have found the node that was deleted
                         */
                        return oldPlanningNode;
                    }
                }
            }

            return null;
        }
    }]);

    return NavItemController;
}();

NavItemController.$inject = ['$rootScope', '$scope', '$translate', '$element', 'NodeService', 'ProjectService', 'StudentDataService'];

exports.default = NavItemController;
//# sourceMappingURL=navItemController.js.map