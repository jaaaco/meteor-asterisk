import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { Nodes as NodeTypes } from '../../lib/nodes';
import { Nodes } from '../../api/nodes/nodes.js';

import './add.html';

Template.nodesAdd.helpers({
    nodes() {
        return _.keys(NodeTypes).sort();
    },
    getLabel(node) {
        const nodeInstance = new NodeTypes[node]();
        return nodeInstance.label;
    }
});

Template.nodesAdd.events({
    'click .js-node-add' (e, t) {
        e.preventDefault();
        Nodes.insert({type: $(e.currentTarget).data('type'), Workflows: {_id: this.workflowId}});
    }
});