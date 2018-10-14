<template lang="pug">
v-list-tile#add-image(v-on:click="addImage()")
  v-list-tile-title
    slot
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
          this.$emit('input', base64)
        })
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

