import { ThothReteComponent } from "./ThothReteComponent";
import { SocketGeneratorControl } from "../dataControls/SocketGenerator";

const info = `The State Read component allows you to read values from the state.  These can be found in and are managed by the State Manager window.  This window consists of a JSON object.  You can define any number ouf outputs where an outputs name corresponds to a key in the state manager.  Whatever value is assigned to that key will be read ans passed into your chain.`;
export class StateRead extends ThothReteComponent {
  constructor() {
    // Name of the component
    super("State Read");

    this.task = {
      outputs: {},
      init: (task) => { },
    };
    this.category = "State";
    this.info = info;
  }

  builder(node) {
    const outputGenerator = new SocketGeneratorControl({
      connectionType: "output",
      name: "Output sockets",
    });

    node.inspector.add(outputGenerator);

    return node;
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(node, inputs, outputs, { silent, thoth }) {
    const { getCurrentGameState } = thoth
    const gameState = await getCurrentGameState();

    return Object.entries(gameState).reduce((acc, [key, value]) => {
      if (node.data.outputs.some((out) => out.name === key)) {
        acc[key] = value;
      }

      return acc;
    }, {});
  }
}