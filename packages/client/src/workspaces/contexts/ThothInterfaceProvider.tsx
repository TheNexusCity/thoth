import {
  EditorContext,
  Spell,
  ThothWorkerInputs,
} from '@thothai/thoth-core/types'
import { useContext, createContext, useRef, useEffect } from 'react'
import { usePubSub } from '../../contexts/PubSubProvider'
import { useGetSpellQuery, useRunSpellMutation } from '@/state/api/spells'

const Context = createContext<EditorContext>(undefined!)

export const useThothInterface = () => useContext(Context)

const ThothInterfaceProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub()
  const spellRef = useRef<Spell | null>(null)
  const [_runSpell] = useRunSpellMutation()
  const { data: _spell } = useGetSpellQuery(
    {
      spellId: tab.spellId,
    },
    {
      skip: !tab.spellId,
    }
  )

  useEffect(() => {
    if (!_spell) return
    spellRef.current = _spell
  }, [_spell])

  const {
    $PLAYTEST_INPUT,
    $PLAYTEST_PRINT,
    $INSPECTOR_SET,
    $DEBUG_PRINT,
    $DEBUG_INPUT,
    $TEXT_EDITOR_CLEAR,
    $SAVE_SPELL_DIFF,
    $NODE_SET,
    ADD_SUBSPELL,
    UPDATE_SUBSPELL,
    $SUBSPELL_UPDATED,
    $PROCESS,
    $TRIGGER,
  } = events

  const onTrigger = (node, callback) => {
    let isDefault = node === 'default' ? 'default' : null
    return subscribe($TRIGGER(tab.id, isDefault ?? node.id), (event, data) => {
      publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const onInspector = (node, callback) => {
    return subscribe($NODE_SET(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const onAddModule = callback => {
    return subscribe(ADD_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onUpdateModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onSubspellUpdated = (spellId: string, callback: Function) => {
    return subscribe($SUBSPELL_UPDATED(spellId), (event, data) => {
      callback(data)
    })
  }

  const onDeleteModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const sendToInspector = data => {
    publish($INSPECTOR_SET(tab.id), data)
  }

  const sendToDebug = data => {
    publish($DEBUG_PRINT(tab.id), data)
  }

  const onDebug = (node, callback) => {
    return subscribe($DEBUG_INPUT(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const sendToPlaytest = data => {
    publish($PLAYTEST_PRINT(tab.id), data)
  }

  const onPlaytest = callback => {
    return subscribe($PLAYTEST_INPUT(tab.id), (event, data) => {
      publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const processCode = (code, inputs, data, state) => {
    const flattenedInputs = Object.entries(inputs as ThothWorkerInputs).reduce(
      (acc, [key, value]) => {
        // @ts-ignore
        acc[key as string] = value[0] as any
        return acc
      },
      {} as Record<string, any>
    )
    // eslint-disable-next-line no-new-func
    const result = new Function('"use strict";return (' + code + ')')()(
      flattenedInputs,
      data,
      state
    )
    if (result.state) {
      updateCurrentGameState(result.state)
    }
    return result
  }

  const runSpell = async (inputs, spellId, state) => {
    const response = await _runSpell({ inputs, spellId, state })

    if ('error' in response) {
      throw new Error(`Error running spell ${spellId}`)
    }

    return response.data.outputs
  }

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const getCurrentGameState = () => {
    if (!spellRef.current) return {}

    return spellRef.current?.gameState ?? {}
  }

  const setCurrentGameState = newState => {
    if (!spellRef.current) return

    const update = {
      gameState: newState,
    }
    publish($SAVE_SPELL_DIFF(tab.id), update)
  }

  const updateCurrentGameState = _update => {
    if (!spellRef.current) return
    const spell = spellRef.current

    // lets delete out all undefined properties coming in
    Object.keys(_update).forEach(
      key => _update[key] === undefined && delete _update[key]
    )

    const update = {
      gameState: {
        ...spell.gameState,
        ..._update,
      },
    }

    // Temporarily update the spell refs game state to account for multiple state writes in a spell run
    spellRef.current = {
      ...spell,
      ...update,
    }
    publish($SAVE_SPELL_DIFF(tab.id), update)
  }

  const publicInterface = {
    onTrigger,
    onInspector,
    onAddModule,
    onUpdateModule,
    onDeleteModule,
    onSubspellUpdated,
    sendToInspector,
    sendToDebug,
    onDebug,
    sendToPlaytest,
    onPlaytest,
    clearTextEditor,
    getCurrentGameState,
    setCurrentGameState,
    updateCurrentGameState,
    processCode,
    runSpell,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default ThothInterfaceProvider
