<template lang="pug">
v-text-field(
    :label="label"
    :type="passwordVisibility ? 'text' : 'password'"
    loading
    :required="required"
    :error-messages="errorMessages"

    :append-icon="passwordVisibility ? 'visibility' : 'visibility_off'"
    @click:append="() => (passwordVisibility = !passwordVisibility)"

    :persistent-hint="true"
    :hint="zxcvbn.feedback.warning"

    :value="value"
    @input="onChange($event)")
    v-progress-linear(slot="progress",:value="zxcvbnProgress",:color="zxcvbnColor",height="3")
</template>

<script type="text/babel">
import zxcvbn from 'zxcvbn'

export default {
  props: {
    label: String,
    value: {
      type: String,
      required: false
    },
    words: {
      type: Array,
      default: () => [],
      required: false
    },
    required: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: Array,
      default: () => [],
      required: false
    }
  },
  methods: {
    onChange (value) {
      this.$emit('input', value)
    }
  },
  data () {
    return {
      passwordVisibility: false
    }
  },
  computed: {
    zxcvbn () {
      return (this.value && zxcvbn(this.value, this.words.filter(e => !!e))) || { feedback: {} }
    },
    zxcvbnProgress () {
      return this.zxcvbn.score * 25
    },
    zxcvbnColor () {
      return ['red accent-2', 'orange', 'amber', 'light-green ', 'green'][this.zxcvbn.score]
    }
  }
}
</script>
