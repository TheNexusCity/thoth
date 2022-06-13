<template>
  <div
    class="pin"
    :style="{ left: pin.x + 'px', top: pin.y + 'px' }"
    @pointerdown="down"
    @pointerup="pinup"
  ></div>
</template>

  <script>
    const State = { PICKED: 0, MOVED: 1, DROPED: 2 }

    export default {
      props: ['pin', 'change', 'remove'],
      inject: ['editor', 'connection'],
      data() {
        return {
          state: State.DROPED,
        }
      },
      mounted() {
        window.addEventListener('pointermove', this.move)
        window.addEventListener('pointerup', this.up)
      },
      destroyed() {
        window.removeEventListener('pointermove', this.move)
        window.removeEventListener('pointerup', this.up)
      },
      methods: {
        setPosition(x, y) {
          this.$emit('change', { x, y })
          this.$forceUpdate()
        },
        down(e) {
          e.stopPropagation()
          this.state = State.PICKED
        },
        move(e) {
          if (this.state === State.DROPED) return

          this.state = State.MOVED
          e.preventDefault()

          const { mouse } = this.editor.view.area

          this.setPosition(mouse.x, mouse.y)
        },
        up(e) {
          this.state = State.DROPED
        },
        pinup() {
          if (this.state === State.MOVED) return

          this.$emit('remove', this.pin)
        },
      },
    }
  </script>

  <style lang="sass" scoped>
    $size: 20px

    .pin
      position: absolute
      display: inline
      width: $size
      height: $size
      background: lighten(steelblue, 20%)
      border-radius: 50%
      transform: translate(-50%, -50%)
  </style>
</template>
