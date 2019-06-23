<template>
  <v-text-field
    :id="id"
    :name="name"
    :label="label"
    :type="passwordVisibility ? 'text' : 'password'"
    loading="loading"
    :required="required"
    :error-messages="errorMessages"
    :append-icon="passwordVisibility ? 'visibility' : 'visibility_off'"
    @click:append="() => (passwordVisibility = !passwordVisibility)"
    :persistent-hint="true"
    :hint="feedback"
    :value="value"
    @input="onChange($event)"
  >
    <VProgressZxcvbn slot="progress" :value="value" :words="words" @feedback="feedback = $event"></VProgressZxcvbn>
  </v-text-field>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import zxcvbn from 'zxcvbn';

@Component({
  name: 'VPasswordInput',
  components: {
    VProgressZxcvbn: () => import('./VProgressZxcvbn.vue'),
  },
})
export default class VPasswordInput extends Vue {
  @Prop({ type: String })
  id?: string;
  @Prop({ type: String })
  name?: string;
  @Prop({ type: String })
  label?: string;
  @Prop({ type: String, required: false })
  value?: string;
  @Prop({ type: Array, default: () => [], required: false })
  words!: Array<string>;
  @Prop({ type: Boolean, default: false })
  required?: boolean;
  @Prop({ type: Array, default: () => [], required: false })
  errorMessages!: Array<string>;

  passwordVisibility = false;
  feedback = '';

  onChange(value: string) {
    this.$emit('input', value);
  }
}
</script>
