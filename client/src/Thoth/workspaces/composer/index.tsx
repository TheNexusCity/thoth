<<<<<<< HEAD:client/src/Thoth/workspaces/composer/index.tsx
// @ts-nocheck

import { useEffect } from 'react'
=======
import { useEffect, useRef } from 'react'
>>>>>>> 5877e541b06f80bf5eb248d0c98bd82f6d69e2f8:client/src/features/Thoth/workspaces/composer/index.tsx

import { store } from '@/state/store'
import { useEditor } from '@thoth/contexts/EditorProvider'
import { Layout } from '@thoth/contexts/LayoutProvider'
import { useModule } from '@/contexts/ModuleProvider'
import {
  useLazyGetSpellQuery,
  useSaveSpellMutation,
  selectSpellById,
} from '@/state/api/spells'
import { debounce } from '@/utils/debounce'
import EditorWindow from '@thoth/windows/EditorWindow'
import EventHandler from '@thoth/components/EventHandler'
import Inspector from '@thoth/windows/InspectorWindow'
import Playtest from '@thoth/windows/PlaytestWindow'
import StateManager from '@thoth/windows/StateManagerWindow'
import AgentManager from '@thoth/windows/AgentManagerWindow'
import EntManager from '@thoth/windows/EntManagerWindow'
import ConfigManager from '@thoth/windows/ConfigManagerWindow'
import TextEditor from '@thoth/windows/TextEditorWindow'
import DebugConsole from '@thoth/windows/DebugConsole'
<<<<<<< HEAD:client/src/Thoth/workspaces/composer/index.tsx
import SearchCorpus from '../../windows/SearchCorpusWindow'
import DebugConsole from '@thoth/windows/DebugConsole'
=======
import { Spell } from '../../../../state/api/spells'
>>>>>>> 5877e541b06f80bf5eb248d0c98bd82f6d69e2f8:client/src/features/Thoth/workspaces/composer/index.tsx

const Workspace = ({ tab, tabs, pubSub }) => {
  const spellRef = useRef<Spell>()
  const [loadSpell, { data: spellData }] = useLazyGetSpellQuery()
  const [saveSpell] = useSaveSpellMutation()
  const { saveModule } = useModule()
  const { editor } = useEditor()

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return
    return editor.on(
      'save nodecreated noderemoved',
      debounce(() => {
        if (tab.type === 'spell') {
          saveSpell({ ...spellRef.current, chain: editor.toJSON() })
        }
        if (tab.type === 'module') {
          saveModule(tab.module, { data: editor.toJSON() }, false)
          // when a module is saved, we look for any open spell tabs, and check if they have the module.
          /// if they do, we trigger a save to ensure the module change is captured to the server
          tabs
            .filter(tab => tab.type === 'spell')
            .forEach(filteredTab => {
              if (filteredTab.spell) {
                const spell = selectSpellById(
                  store.getState(),
                  filteredTab.spell
                )
                if (
                  spell?.modules &&
                  spell?.modules.some(module => module.name === tab.module)
                )
                  saveSpell({ ...spell })
              }
            })
        }
      }, 500)
    )
  }, [editor])

  useEffect(() => {
    if (!spellData) return
    spellRef.current = spellData
  }, [spellData])

  useEffect(() => {
    if (!tab || !tab.spell) return
    loadSpell(tab.spell)
  }, [tab])

  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      }
      const component = node.getComponent()
      switch (component) {
        case 'stateManager':
          return <StateManager {...props} />
        case 'agentManager':
          return <AgentManager />
        case 'searchCorpus':
          return <SearchCorpus />
        case 'configManager':
          return <ConfigManager />
        case 'entManager':
          return <EntManager />
        case 'playtest':
          return <Playtest {...props} />
        case 'inspector':
          return <Inspector {...props} />
        case 'textEditor':
          return <TextEditor {...props} />
        case 'editorWindow':
          return <EditorWindow {...props} />
        case 'debugConsole':
          return <DebugConsole {...props} />
        default:
          return <p></p>
      }
    }
  }

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} />
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </>
  )
}

const Wrapped = props => {
  return <Workspace {...props} />
}

export default Wrapped