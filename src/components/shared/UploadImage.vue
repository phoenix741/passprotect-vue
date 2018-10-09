<template lang="pug">
div.base64-upload
    v-btn#add-image(v-if="!src",fab,large,color="white",v-on:click="addImage()")
      v-icon(color="primary") add_photo_alternate
    v-layout.superposition(v-else,v-on:click="addImage()")
      img(:src="src")
      v-icon(color="primary") add_photo_alternate
    input(ref="fileInput",type="file",accept="image/*",@change="onChange",hidden)
</template>

<script>
export default {
  props: {
    value: String
  },
  data () {
    return {
      base64: this.value
    }
  },
  methods: {
    addImage () {
      this.$refs.fileInput.click()
    },
    onChange (event) {
      if (event.target.files && event.target.files[0]) {
        let file = event.target.files[0]
        let reader = new FileReader()
        reader.addEventListener('load', e => {
          const src = e.target.result
          let [, base64] = src.split(',')
          this.base64 = base64

          this.$emit('input', base64)
        })
        reader.readAsDataURL(file)
      }
    }
  },
  computed: {
    src: function () {
      return this.base64 && 'data:text/plain;base64,' + this.base64
    }
  }
}
</script>

<style scoped lang="stylus">
img
  max-height: 150px

.superposition
  text-align: center
  position: relative
  height: 150px;
  width: 400px;

  img
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    display: block
    margin: auto

  i
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>
