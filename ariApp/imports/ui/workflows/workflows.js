import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Workflows } from '../../api/workflows/workflows.js';

import './workflows.html';

Template.workflows.helpers({
    workflows() {
        return Workflows.find();
    },
    element: function() {
        return Elements.findOne(Session.get('elements.active'));
    }
});

Template.workflows.onCreated(function() {
    this.autorun(() => {
        this.subscribe('Workflows');
    });
});