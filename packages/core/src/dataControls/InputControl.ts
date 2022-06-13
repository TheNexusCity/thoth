import { DataControl } from '../plugins/inspector'

export class InputControl extends DataControl {
  constructor({
    dataKey = '',
    name = '',
    icon = 'hand',
    defaultValue,
  }: {
    dataKey: string
    name: string
    icon?: string
    defaultValue?: unknown
  }) {
    super({
      dataKey: dataKey,
      name: name,
      component: 'input',
      defaultValue,
      icon,
    })
  }

  onData = () => {
    return
  }
}
