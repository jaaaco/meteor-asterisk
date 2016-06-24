import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Workflows } from '../../api/workflows/workflows.js';

import './add.html';

Template.workflowsAdd.events({
    'click .js-workflows-add' (e) {
        e.preventDefault();
        FlowRouter.go('workflows.show', {
            _id: Workflows.insert({ type: this, 'Workflows._id': this.workflowId })
        });
    }
});