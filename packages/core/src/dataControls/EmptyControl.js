import { DataControl } from '../plugins/inspector'

export class EmptyControl extends DataControl {
  constructor({ dataKey, ignored = [] }) {
    const options = {
      dataKey: dataKey,
      name: 'empty',
      component: 'none',
      data: {
        ignored,
      },
    }

    super(options)
  }

  onData() {
    return
  }
}
