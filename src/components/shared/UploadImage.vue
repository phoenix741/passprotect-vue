<template lang="pug">
div.base64-upload
    v-btn#add-image(v-if="!src",fab,color="white",v-on:click="addImage()")
        v-icon(color="primary") add_photo_alternate
    img(v-else,:src="src",v-on:click="addImage()")
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
      return 'data:text/plain;base64,' + this.base64
    }
  }
}
</script>

<style scoped>
img {
  max-width: 150px;
  max-height: 150px;
}
</style>
