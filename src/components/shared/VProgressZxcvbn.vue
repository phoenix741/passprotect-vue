<template>
  <v-progress-linear :value="zxcvbnProgress" :color="zxcvbnColor" height="3"></v-progress-linear>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import zxcvbn from 'zxcvbn';

@Component({
  name: 'VProgressZxcvbn',
})
export default class VProgressZxcvbn extends Vue {
  @Prop({ type: String, required: false })
  value?: string;

  @Prop({ type: Array, default: () => [], required: false })
  words!: Array<string>;

  get zxcvbn() {
    if (this.value) {
      const result = zxcvbn(this.value, this.words.filter(e => !!e));
      this.$emit('feedback', result.feedback.warning);
      return result;
    }

    this.$emit('feedback', '');
    return { feedback: {}, score: 0 };
  }

  get zxcvbnProgress() {
    return this.zxcvbn.score * 25;
  }

  get zxcvbnColor() {
    return ['red accent-2', 'orange', 'amber', 'light-green ', 'green'][this.zxcvbn.score];
  }
}
</script>
