<template>
  <input ref="fileInput" type="file" accept="image/*" @change="onChange" hidden="hidden"/>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';

@Component({
  name: 'v-upload-image',
})
export default class VUploadImage extends Vue {
  @Prop({ type: String })
  value?: string;

  addImage() {
    (this.$refs.fileInput as HTMLInputElement).click();
  }

  onChange(event: any) {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.addEventListener('load', (e: any) => {
        const src = e.target.result;
        let [, base64] = src.split(',');
        this.$emit('input', base64);
      });
      reader.readAsDataURL(file);
    }
  }
}
</script>
