import React from "react";
import { useRete } from "../../../contexts/Rete";
import { useSpell } from "../../../contexts/Spell";
import classnames from "classnames";
import { VscClose } from "react-icons/vsc";
import MenuBar from '../MenuBar/MenuBar'

import css from "./tabBar.module.css";

const Tab = (props) => {
  const title = `${props.type}- ${props.name}`;
  const tabClass = classnames({
    [css["tabbar-tab"]]: true,
    [css["active"]]: props.active,
    [css["inactive"]]: !props.active,
  });
  return (
    <div className={tabClass}>
      <p>{title}</p>
      <span>
        <VscClose />
      </span>
    </div>
  );
};

const TabBar = ({ tabs }) => {
  const { serialize } = useRete();
  const { saveCurrentSpell } = useSpell();

  const onSave = () => {
    const serialized = serialize();
    saveCurrentSpell({ graph: serialized });
  };

  const onSerialize = () => {
    const serialized = serialize();
    console.log(JSON.stringify(serialized));
  };

  const menuBarItems = {
    save: {
      onClick: onSave
    },
    load: {},
    export: {
      onClick: onSerialize,
    },
    studio: {
      items: {
        text_editor: {
          onClick: null
        },
        state_manager: {
          onClick: null
        },
        playtest: {
          onClick: null
        },
        inspector: {
          onClick: null
        },
        enki: {
          items: {
            serialization: {
              onClick: null
            },
            preamble: {
              onClick: null
            },
            fewshot_data: {
              onClick: null
            },
          }
        }
      }
    }
  }

  return (
    <div className={css["th-tabbar"]}>
      <div className={css["tabbar-section"]}>
        <MenuBar />
      </div>
      <div className={css["tabbar-section"]}>
        {tabs && tabs.map((tab, i) => <Tab {...tab} key={i} />)}
      </div>
    </div>
  );
};

export default TabBar;
