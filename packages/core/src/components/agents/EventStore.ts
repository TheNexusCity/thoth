process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import Rete from 'rete'

import {
  Agent,
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, agentSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Event Store is used to store events for an agent and user'

export class EventStore extends ThothComponent<Promise<void>> {
  constructor() {
    super('Store Event')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', agentSocket)
    const factsInp = new Rete.Input('primary', 'Primary Event', stringSocket)

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
    })

    node.inspector.add(nameInput).add(type)

    const factaInp = new Rete.Input(
      'secondary',
      'Secondary Event (Opt)',
      stringSocket
    )

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(factsInp)
      .addInput(factaInp)
      .addInput(agentInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { storeEvent } = thoth
    const agent = (inputs['agent'][0] ?? inputs['agent']) as Agent
    const primary = inputs['primary'][0] as string
    const secondary = inputs['secondary'] && inputs['secondary'][0] as string

    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    let respUser
    let respAgent

    if (primary && primary !== '') {
      respUser = await storeEvent({
        type,
        agent: agent.agent,
        speaker: agent.speaker,
        sender: agent.speaker,
        text: primary,
        client: agent.client,
        channel: agent.channel,
      })
    }

    if (secondary && secondary !== '') {
      respAgent = await storeEvent({
        type,
        agent: agent.agent,
        speaker: agent.speaker,
        sender: agent.agent,
        text: secondary,
        client: agent.client,
        channel: agent.channel,
      })
    }
    if (!silent) node.display(respUser?.data + '|' + respAgent?.data)

    // If we are on the client, we want to refresh the event table UI
    // if (this?.editor?.refreshEventTable) this.editor.refreshEventTable()
  }
}
