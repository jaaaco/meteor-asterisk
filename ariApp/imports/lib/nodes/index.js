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
import { Record, RecordStop } from './record.js';
import { Speech } from './speech.js';
import { Start } from './start.js';
import { Hangup } from './hangup.js';
import { Workflow } from './workflow.js';
import { WaitForEvent } from './waitForEvent.js';
import { ListenEvent } from './listenEvent.js';
import { StopRing} from './stopRing.js';
import { DtmfMenu } from './dtmfMenu.js';
import { WaitForDtmf} from './waitForDtmf.js';

import { Crm } from './crm';

export const Nodes = {
  CrmGetCallerId: Crm.GetCallerId,
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
  RecordStop,
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
