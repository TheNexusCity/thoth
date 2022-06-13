/* eslint-disable no-empty */
import { DataControl } from '../plugins/inspector'

export class ArrayControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand' }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
      type: 'array',
    }

    super(options)
  }

  onData() {
    return
  }
}
