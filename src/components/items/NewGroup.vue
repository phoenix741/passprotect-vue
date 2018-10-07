<template lang="pug">
v-dialog(v-model="show",max-width="500px")
  v-card
    v-card-title
      h2 {{ $t('item.form.group.dialog.title') }}
    v-card-text
      v-text-field#newGroup(
          :label="$t('item.form.group.dialog.label')"
          :data-vv-as="$t('item.form.group.dialog.label')",
          v-model="newGroup",
          :error-messages="errors.collect('newGroup')",
          v-validate="'required'",
          data-vv-name="newGroup",
          name="newGroup",
          required
      )
  v-card-actions
      v-spacer
      v-btn(color="primary",flat,@click="close") {{ $t('item.form.group.dialog.cancel') }}
      v-btn(color="primary",flat,@click="addGroup") {{ $t('item.form.group.dialog.ok') }}
</template>

<script type="text/babel">

export default {
  $validates: true,
  props: {
    show: Boolean
  },
  name: 'new-group',
  data () {
    return {
      newGroup: ''
    }
  },
  methods: {
    async addGroup () {
      const valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      this.$emit('add', this.newGroup)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
