import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Workflows } from '../../api/workflows/workflows.js';

import './show.html';

Template.workflowsShow.helpers({
    workflow() {
        return Workflows.findOne(Template.currentData()._id);
    }
});

Template.workflowsShow.onCreated(function() {
    this.autorun(() => {
        this.subscribe('Workflows',{_id: Template.currentData()._id});
    });
});
