import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Nodes } from '../../api/nodes/nodes.js';

import './node.html';
import './node.less';

Template.node.helpers({
  attributes() {
    if (this.node.pos) {
      return {
        style: 'left: ' + this.node.pos.x + 'px; top: ' + this.node.pos.y + 'px'
      }
    }
  },
  moving() {
    return Template.instance().moving.get();
  }
});

Template.node.events({
  'mousedown .js-node-handle' (e, t) {
    e.preventDefault();
    t.moving.set(true);
  },
  'mouseup .js-node-handle' (e, t) {
    e.preventDefault();
    t.moving.set(false);
  },
  'mousemove' (e,t) {
    if (t.moving.get()) {
      console.log(this.node._id, e.originalEvent.movementX);
      Nodes.update(this.node._id, {$inc: {
        'pos.x': e.originalEvent.movementX,
        'pos.y': e.originalEvent.movementY
      }});
    }
  }
});

Template.node.onCreated(function() {
  this.moving = new ReactiveVar(false);
});
