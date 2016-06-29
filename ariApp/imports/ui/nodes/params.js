import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { Nodes as NodeTypes } from '../../lib/nodes';
import { Nodes } from '../../api/nodes/nodes.js';
import { $ } from 'meteor/jquery';
import './params.html';

Template.nodeParams.events({
  'click .js-close'(e, t) {
    e.preventDefault();

    let params = {};

    const nodeClass = new NodeTypes[this.node.type]();
    _.each(nodeClass.params, (param, name) => {
      if (t.$('input[data-param="'+name+'"]').val()) {
        params[name] = t.$('input[data-param="'+name+'"]').val();
      }
    });
    Nodes.update(this.node._id, {$set: {params}});
    t.data.parent.editingParams.set(false);
  }
});

Template.nodeParams.helpers({
  params() {
    let params = [];
    const nodeClass = new NodeTypes[this.node.type]();
    _.each(nodeClass.params, (param, name) => {
      params.push({
        name,
        value: this.node.params ? this.node.params[name] : ''
      })
    });
    return params;
  }
});
