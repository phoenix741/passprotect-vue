<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <h2>{{ $t('item.form.group.dialog.title') }}</h2>
      </v-card-title>
      <v-card-text>
        <v-text-field
          id="new-group"
          :label="$t('item.form.group.dialog.label')"
          :data-vv-as="$t('item.form.group.dialog.label')"
          v-model="newGroup"
          :error-messages="errors.collect('newGroup')"
          v-validate="'required'"
          data-vv-name="newGroup"
          name="newGroup"
          required="required"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click="close">{{ $t('item.form.group.dialog.cancel') }}</v-btn>
        <v-btn id="create-group" color="primary" flat="flat" @click="addGroup">{{ $t('item.form.group.dialog.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';

@Component({
  name: 'new-group-dialog',
})
export default class NewGroupDialog extends Vue {
  @Prop({
    type: Boolean,
  })
  show?: boolean;
  newGroup: string = '';

  async addGroup() {
    const valid = await this.$validator.validateAll();
    if (!valid) {
      return;
    }

    this.$emit('add', this.newGroup);
  }

  close() {
    this.$emit('close');
  }
}
</script>
