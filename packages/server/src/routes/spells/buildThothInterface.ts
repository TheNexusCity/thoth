import { CustomError } from './../../utils/CustomError'
import {
  EngineContext,
  GraphData,
  ThothWorkerInputs,
  Spell as SpellType,
} from '@thothai/thoth-core/types'
import Koa from 'koa'
import vm2 from 'vm2'
import { GetEventArgs, CreateEventArgs } from '@thothai/thoth-core/types'

import { searchWikipedia } from '../wikipedia/helpers'
import queryGoogle from '../utils/queryGoogle'

import { database } from './../../database'
import SpellRunner from '@thothai/thoth-core/src/spellManager/SpellRunner'

const getEvents = async ({
  type,
  agent,
  speaker,
  client,
  channel,
  maxCount,
  max_time_diff,
}: GetEventArgs) => {
  const event = await database.instance.getEvents({
    type,
    agent,
    speaker,
    client,
    channel,
    maxCount,
    max_time_diff,
  })

  if (!event) return null

  return event
}

const createEvent = async (args: CreateEventArgs) => {
  const { type, agent, speaker, client, channel, text, sender } = args
  return await database.instance.createEvent({
    type,
    agent,
    speaker,
    sender,
    client,
    channel,
    text,
  })
}

export const buildThothInterface = (
  initialGameState: Record<string, unknown>
): EngineContext => {
  // eslint-disable-next-line functional/no-let
  let gameState = { ...initialGameState }

  return {
    runSpell: async (flattenedInputs, spellId, state) => {
      const rootSpell = await database.instance.models.spells.findOne({
        where: { name: spellId },
      })

      const thothInterface = buildThothInterface(state)
      const spellRunner = new SpellRunner({ thothInterface })

      const spellToRun = {
        // TOTAL HACK HERE
        ...(rootSpell as any).toJSON(),
        gameState: state,
      }

      await spellRunner.loadSpell(spellToRun as SpellType)

      // Get the outputs from running the spell
      const outputs = await spellRunner.defaultRun(flattenedInputs)

      return outputs
    },
    queryGoogle: async query => {
      const response = await queryGoogle(query)
      return response
    },
    processCode: (
      code: unknown,
      inputs: ThothWorkerInputs,
      data: Record<string, any>,
      state: Record<string, any>
    ) => {
      const { VM } = vm2
      const vm = new VM()

      // Inputs are flattened before we inject them for a better code experience
      const flattenInputs = Object.entries(inputs).reduce(
        (acc, [key, value]: [string, any]) => {
          acc[key] = value[0]
          return acc
        },
        {} as Record<string, any>
      )

      // Freeze the variables we are injecting into the VM
      vm.freeze(data, 'data')
      vm.freeze(flattenInputs, 'input')
      vm.protect(state, 'state')

      // run the code
      const codeToRun = `"use strict"; function runFn(input,data,state){ return (${code})(input,data,state)}; runFn(input,data,state);`

      try {
        const codeResult = vm.run(codeToRun)
        console.log('CODE RESULT', codeResult)
        return codeResult
      } catch (err) {
        console.log({ err })
        throw new CustomError(
          'server-error',
          'Error in spell runner: processCode component: ' + code
        )
      }
    },
    setCurrentGameState: state => {
      gameState = state
    },
    getCurrentGameState: () => {
      return gameState
    },
    updateCurrentGameState: (update: Record<string, unknown>) => {
      const newState = {
        ...gameState,
        ...update,
      }

      gameState = newState
    },
    // IMPLEMENT THESE INTERFACES FOR THE SERVERbuildThothInterface
    getEvent: async (args: GetEventArgs) => {
      return await getEvents(args)
    },
    storeEvent: async (args: CreateEventArgs) => {
      return await createEvent(args)
    },
    getWikipediaSummary: async (keyword: string) => {
      let out = null
      try {
        out = (await searchWikipedia(keyword as string)) as any
      } catch (err) {
        throw new Error('Error getting wikipedia summary')
      }

      console.log('WIKIPEDIA SEARCH', out)

      return out
    },
  }
}
