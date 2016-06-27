import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { Nodes as NodeTypes } from '../../lib/nodes';
import { Nodes } from '../../api/nodes/nodes.js';
import { $ } from 'meteor/jquery';
import './node.html';
import './node.less';

Template.node.events({
  'mousedown .js-connector' (e, t) {
    let connector = this;
    let node = t.data.node;

    t.data.parent.connector.set('drawing', node._id);
    t.data.parent.connector.set('from', connector.name);

    let startPos = {x: e.pageX, y: e.pageY};
    startPos.x -= e.offsetX;
    startPos.x += t.$(e.currentTarget).width()/2;

    startPos.y -= e.offsetY;
    startPos.y += t.$(e.currentTarget).height()/2;

    t.data.parent.connector.set('fromX', startPos.x - $('#nodesCanvas').position().left);
    t.data.parent.connector.set('fromY', startPos.y - $('#nodesCanvas').position().top);

    t.data.parent.connector.set('toX', startPos.x - $('#nodesCanvas').position().left);
    t.data.parent.connector.set('toY', startPos.y - $('#nodesCanvas').position().top);

    e.preventDefault();
  },
  'mouseenter .js-connector' (e, t) {
    let connector = this;
    let node = t.data.node;

    if (!t.data.parent.connector.get('drawing') || t.data.parent.connector.get('drawing') === node._id) {
      return;
    }

    t.data.parent.connector.set('toNode', node._id);
    t.data.parent.connector.set('to', connector.name);

    let startPos = {x: e.pageX, y: e.pageY};
    startPos.x -= e.offsetX;
    startPos.x += t.$(e.currentTarget).width()/2;

    startPos.y -= e.offsetY;
    startPos.y += t.$(e.currentTarget).height()/2;

    t.data.parent.connector.set('toX', startPos.x - $('#nodesCanvas').position().left);
    t.data.parent.connector.set('toY', startPos.y - $('#nodesCanvas').position().top);
  },
  'mouseleave .js-connector' (e, t) {
    let connector = this;
    let node = t.data.node;

    if (!t.data.parent.connector.get('drawing') || t.data.parent.connector.get('drawing') === node._id) {
      return;
    }

    t.data.parent.connector.set('toNode', false);
    t.data.parent.connector.set('to', false);
  },
  'click .js-node-remove' (e, t) {
    e.preventDefault();
    e.stopPropagation();
    Nodes.remove(this.node._id);
  }
});

Template.node.helpers({
  attributes() {
    if (this.node.pos) {
      return {
        style: 'left: ' + this.node.pos.x + 'px; top: ' + this.node.pos.y + 'px'
      }
    }
  },
  inputs() {
    const nodeInstance = new NodeTypes[this.node.type]();
    return nodeInstance.inputs;
  },
  outputs() {
    const nodeInstance = new NodeTypes[this.node.type]();
    return nodeInstance.outputs;
  },
  params() {
    let params = [];
    const nodeInstance = new NodeTypes[this.node.type]();
    _.each(nodeInstance.params, (param, type) => {
      params.push({
        label: type,
        value: this.node.params ? this.node.params[type] : '-'
      })
    });
    return params;
  },

  getConnectorColor(connector, node) {
    if (Template.parentData().parent.connector.get('from') === connector.name
      && Template.parentData().parent.connector.get('drawing') === node._id) {
      return 'yellow';
    }

    if (Template.parentData().parent.connector.get('to') === connector.name
      && Template.parentData().parent.connector.get('toNode') === node._id) {
      return 'yellow';
    }

    switch (connector.type) {
      case NodeTypes.Base.connectorTypes.generic:
        return 'blue';
      case NodeTypes.Base.connectorTypes.error:
        return 'red';
      case NodeTypes.Base.connectorTypes.success:
        return 'green';
      default:
        return 'black';
    }
  }
});
