import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Nodes } from '../../api/nodes/nodes.js';

import './nodes.html';
import './nodes.less';

Template.nodes.helpers({
  nodes() {
    return Nodes.find({'Workflows._id': Template.currentData().workflowId});
  }
});


Template.nodes.onCreated(function() {
  this.autorun(() => {
    this.subscribe('NodesByWorkflow', Template.currentData().workflowId);
  });
});