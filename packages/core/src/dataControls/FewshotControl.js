import { DataControl } from '../plugins/inspector'

export class FewshotControl extends DataControl {
  constructor({
    language = 'plaintext',
    icon = 'fewshot',
    dataKey = 'fewshot',
    name = 'fewshot',
  }) {
    const options = {
      dataKey,
      name,
      component: 'longText',
      icon,
      options: {
        editor: true,
        language: language,
      },
    }

    super(options)
  }

  onData() {
    return
  }
}
