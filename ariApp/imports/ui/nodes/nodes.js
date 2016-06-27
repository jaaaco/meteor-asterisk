import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Nodes } from '../../api/nodes/nodes.js';

import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { $ } from 'meteor/jquery';

import './nodes.html';
import './nodes.less';

Template.nodes.helpers({
  nodes() {
    return Nodes.find({'Workflows._id': Template.currentData().workflowId});
  },
  moving(node) {
    return Template.instance().moving.get() == node._id;
  },
  getInstance() {
    return Template.instance();
  },
  connector(paramName) {
    return Template.instance().connector.get(paramName);
  },
  connectors(node) {
    let lines = [];
    let canvasPos = Template.instance().$('#nodesCanvas').position();
    let nodeId, to, fromPos, toPos;
    //console.log(node._id, node.connectors);
    _.each(node.connectors, (connector, from) => {

      nodeId = _.keys(connector)[0];
      to = _.values(connector)[0];

      if (!Nodes.findOne(nodeId) || !Nodes.findOne(node._id)) {
        return;
      }
      
      fromPos = Template.instance().$('.node[data-id="'+node._id+'"] .js-connector[data-type="'+from+'"]').position();
      toPos = Template.instance().$('.node[data-id="'+nodeId+'"] .js-connector[data-type="'+to+'"]').position();

      lines.push({
        x1: fromPos.left - canvasPos.left + 6,
        y1: fromPos.top - canvasPos.top + 6,
        x2: toPos.left - canvasPos.left - 20,
        y2: toPos.top - canvasPos.top + 6
      });
    });
    return lines;
  }
});

Template.nodes.events({
  'mousedown .js-node-handle' (e, t) {
    e.preventDefault();
    t.moving.set(this.node._id);
    t.moveOffset = {
      x:  e.offsetX,
      y: e.offsetY
    };

    const startingPosition = t.$(e.currentTarget).closest('.node').position();

    t.accumulatedMovement = {
      x: startingPosition.left + t.moveOffset.x,
      y: startingPosition.top + t.moveOffset.y
    };
    t.lastPosition = {
      x: e.pageX,
      y: e.pageY
    };
  },
  'mouseup .nodes' (e, t)  {
    if (t.moving.get()) {
      e.preventDefault();
      Nodes.update(t.moving.get(), {$set: {
        'pos.x': t.accumulatedMovement.x - t.moveOffset.x,
        'pos.y': t.accumulatedMovement.y - t.moveOffset.y
      }});
      t.moving.set(false);
    }

    if (t.connector.get('drawing')) {
      if (t.connector.get('toNode')) {
        Nodes.update(t.connector.get('drawing'), {$set:
          {['connectors.' + t.connector.get('from')]: {[t.connector.get('toNode')]: t.connector.get('to')}}
        });
      }

      t.connector.set('drawing', false);
      t.connector.set('from', false);
      t.connector.set('to', false);
    }

  },
  'mousemove #nodesCanvas' (e,t) {
    if (t.moving.get()) {
      t.accumulatedMovement.x += e.pageX - t.lastPosition.x;
      t.lastPosition.x = e.pageX;

      t.accumulatedMovement.y +=  e.pageY - t.lastPosition.y;
      t.lastPosition.y = e.pageY;

      if (t.accumulatedMovement.x - t.moveOffset.x < 0) {
        t.accumulatedMovement.x = t.moveOffset.x;
      }

      if (t.accumulatedMovement.y - t.moveOffset.y < 0) {
        t.accumulatedMovement.y = t.moveOffset.y;
      }

      t.$('.node[data-id="'+t.moving.get()+'"]')
        .css('left', (t.accumulatedMovement.x - t.moveOffset.x) + 'px')
        .css('top', (t.accumulatedMovement.y - t.moveOffset.y) + 'px');
    }

    if (t.connector.get('drawing')) {
      t.connector.set('toX', e.pageX - $('#nodesCanvas').position().left);
      t.connector.set('toY', e.pageY - $('#nodesCanvas').position().top);
    }
  }
});

Template.nodes.onCreated(function() {
  this.moving = new ReactiveVar(false);
  this.moveOffset = {x: 0, y: 0};
  this.accumulatedMovement = {x: 0, y: 0};
  this.lastPosition = {x: 0, y: 0};

  this.connector = new ReactiveDict();
  this.connector.set('from', false);
  this.connector.set('fromX', 0);
  this.connector.set('fromY', 0);
  this.connector.set('to', false);
  this.connector.set('drawing', false);

  this.autorun(() => {
    this.subscribe('NodesByWorkflow', Template.currentData().workflowId);
  });
});
