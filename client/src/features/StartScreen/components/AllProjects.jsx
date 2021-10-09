import { useLocation } from 'wouter'

import Icon from '../../common/Icon/Icon'
import Panel from '../../common/Panel/Panel'
import css from '../startScreen.module.css'
import FileInput from './FileInput'
import ProjectRow from './ProjectRow'

const AllProjects = ({
  spells,
  openSpell,
  setSelectedSpell,
  selectedSpell,
  loadFile,
}) => {
  return (
    <Panel shadow>
      <h1>
        <Icon
          name={'properties'}
          size={'var(--medium)'}
          style={{ marginRight: 'var(--extraSmall)', top: '3px' }}
        />
        All Spells
      </h1>
      <Panel
        style={{ width: 'var(--c62)', backgroundColor: 'var(--dark-1)' }}
        flexColumn
        gap={'var(--small)'}
        roundness="round"
        unpadded
      >
        {spells.map((spell, i) => (
          <ProjectRow
            key={i}
            setSelectedSpell={setSelectedSpell}
            selectedSpell={selectedSpell}
            label={spell.name}
            onClick={() => {
              setSelectedSpell(spell)
            }}
          />
        ))}
      </Panel>

      <div className={css['button-row']}>
        <button
          onClick={() => {
            window.history.back()
          }}
        >
          back
        </button>
        <FileInput loadFile={loadFile} />
        <button
          onClick={() => {
            openSpell(selectedSpell)
          }}
          className={!selectedSpell ? 'disabled' : 'primary'}
        >
          OPEN
        </button>
      </div>
    </Panel>
  )
}

export default AllProjects
