import { useEffect } from "react";
import { useLayout } from "../../../contexts/LayoutProvider";
import { useEditor } from "../../../contexts/EditorProvider";
import { useSpell } from "../../../contexts/SpellProvider";
import { useModule } from "../../../contexts/ModuleProvider";
import { useTabManager } from "../../../contexts/TabManagerProvider";

const EventHandler = ({ pubSub, tab }) => {
  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout();
  const { serialize, editorRef } = useEditor();
  const { getModule } = useModule()
  const { saveCurrentSpell, getSpell } = useSpell();

  const { activeTab } = useTabManager();

  const { events, subscribe } = pubSub;

  const {
    $SAVE_SPELL,
    $CREATE_STATE_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
    $CLOSE_EDITOR,
  } = events;

  const saveSpell = async () => {
    const graph = serialize();
    await saveCurrentSpell({ graph });
  };

  const createStateManager = () => {
    createOrFocus(windowTypes.STATE_MANAGER, "State Manager");
  };

  const createPlaytest = () => {
    createOrFocus(windowTypes.PLAYTEST, "Playtest");
  };

  const createInspector = () => {
    createOrFocus(windowTypes.INSPECTOR, "Inspector");
  };

  const createTextEditor = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, "Text Editor");
  };

  const onSerialize = () => {
    console.log(serialize());
  };

  const onExport = async () => {
    console.log("exporting in workspace!");
    let activeTabDoc
    if (activeTab.type === "spell"){
      activeTabDoc = await getSpell(activeTab.spell);
    }
    if (activeTab.type === "module"){
      activeTabDoc = await getModule(activeTab.module);
    }
    const exportDoc = activeTabDoc.toJSON();
    const json = JSON.stringify(exportDoc);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${exportDoc.name}.thoth`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  };

  // clean up anything inside the editor which we need to shut down.
  // mainly subscriptions, etc.
  const onCloseEditor = () => {
    if (editorRef.current.moduleSubscription)
      editorRef.current.moduleSubscription.unsubscribe();
  };

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_STATE_MANAGER(tab.id)]: createStateManager,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$SERIALIZE(tab.id)]: onSerialize,
    [$EXPORT(tab.id)]: onExport,
    [$CLOSE_EDITOR(tab.id)]: onCloseEditor,
  };

  useEffect(() => {
    if (!tab) return;

    const subscriptions = Object.entries(handlerMap).map(([event, handler]) => {
      return subscribe(event, handler);
    });

    // unsubscribe from all subscriptions on unmount
    return () => {
      subscriptions.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [tab]);

  return null;
};

export default EventHandler;
