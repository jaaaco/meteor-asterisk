import {Base} from './base.js';
import { connectorTypes, paramTypes } from './_types.js';

export class Playback extends Base {
  get params() {
    return _.extend(super.params, {
      media: {
        type: paramTypes.string
      }
    });
  }

  get outputs() {
    return [
      {
        name: 'finished',
        type: connectorTypes.success
      },
      {
        name: 'played',
        type: connectorTypes.generic
      },
      {
        name: 'error',
        type: connectorTypes.error
      }
    ];
  }

  job() {
    const playback = this.ari.Playback();

    playback.on('PlaybackFinished', event => {
      if (this.node.connectors && this.node.connectors.finished) {
        this.resolve('finished');
      }
    });

    this.channel.play({media: this.node.params.media}, playback).then(()=>{
      if (this.node.connectors && this.node.connectors.played) {
        this.resolve('played');
      }

    }).catch(err => {
      this.resolve('error');
    });
  }
}
