<template>
  <div>
    <Pin
      v-for="pin in pins"
      :pin="pin"
      @change="change(pin, $event)"
      @remove="remove(pin)"
      :key="pin.x + ' ' + pin.y"
    />
  </div>
</template>

<script>
import Pin from './Pin.vue'

export default {
  props: ['pins'],
  inject: ['editor', 'connection'],
  methods: {
    change(pin, { x, y }) {
      pin.x = x
      pin.y = y
      this.editor.view.connections.get(this.connection).update()
    },
    remove(pin) {
      this.pins.splice(this.pins.indexOf(pin), 1)
      this.editor.view.connections.get(this.connection).update()
      this.$forceUpdate()
    },
  },
  components: {
    Pin,
  },
}
</script>
