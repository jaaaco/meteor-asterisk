import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { Nodes as NodeTypes } from '../../lib/nodes';
import { Nodes } from '../../api/nodes/nodes.js';

import './add.html';

Template.nodesAdd.helpers({
    nodes() {
        return _.keys(NodeTypes);
    }
});

Template.nodesAdd.events({
    'click .js-add' (e) {
        e.preventDefault();
        Nodes.insert({type: this, 'Workflows._id': this.workflowId});
    }
});