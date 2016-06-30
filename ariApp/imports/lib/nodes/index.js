import { connectorTypes, paramTypes } from './_types.js';
import { Base } from './base.js';
import { AddToBridge } from './addToBridge.js';
import { Answer } from './answer.js';
import { Bridge } from './bridge.js';
import { Originate } from './originate.js';
import { Ring } from './ring.js';
import { Timeout } from './timeout.js';
import { Moh, StopMoh } from './moh.js';
import { Playback } from './playback.js';
import { TimeCondition } from './timeCondition.js';
import { Record } from './record.js';
import { Speech } from './speech.js';
import { Start } from './start.js';
import { Hangup } from './hangup.js';
import { Workflow } from './workflow.js';
import { WaitForEvent } from './waitForEvent.js';
import { ListenEvent } from './listenEvent.js';
import { StopRing} from './stopRing.js';
import { DtmfMenu } from './dtmfMenu.js';
import { WaitForDtmf} from './waitForDtmf.js';

export const Nodes = {
  Base,
  AddToBridge,
  Answer,
  Bridge,
  Originate,
  Ring,
  Timeout,
  Moh,
  StopMoh,
  Playback,
  TimeCondition,
  Record,
  Speech,
  Start,
  Hangup,
  Workflow,
  WaitForEvent,
  ListenEvent,
  StopRing,
  DtmfMenu,
  WaitForDtmf,
  Types: {
    connectorTypes,
    paramTypes
  }
};
