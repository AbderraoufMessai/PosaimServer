<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <template #activator="{ on: onDialog, attrs: attrsDialog }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip, attrs: attrsTooltip }">
          <v-btn
            absolute
            dark
            bottom
            left
            fab
            small
            color="primary"
            v-bind="{ ...attrsTooltip, ...attrsDialog }"
            v-on="{ ...onTooltip, ...onDialog }"
          >
            <v-icon>$edit</v-icon>
          </v-btn>
        </template>
        Edit
      </v-tooltip>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <v-card class="rounded-lg" dark color="accent">
          <v-toolbar dense flat color="accent">
            <v-toolbar-title class="text-body-1">
              <v-icon left>$key</v-icon>Edit license key
            </v-toolbar-title>
            <v-spacer />
            <v-tooltip color="red" top>
              <template #activator="{ on, attrs }">
                <v-btn
                  fab
                  dark
                  x-small
                  elevation="0"
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                  @click="dialog = false"
                >
                  <v-icon small>$close</v-icon>
                </v-btn>
              </template>
              Close
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="license key"
                  rules="required"
                >
                  <v-text-field
                    v-model="key"
                    label="License key"
                    :error-messages="errors"
                    hide-details
                    required
                    outlined
                    dense
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn small dark color="green" :disabled="invalid" type="submit">
              <v-icon small left>$save</v-icon> Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </validation-observer>
    <v-snackbar
      v-model="snackbar.active"
      :color="snackbar.color"
      rounded="pill"
      dark
    >
      {{ snackbar.message }}
      <template #action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbar.active = false">
          <v-icon small>$close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  name: "LicenseKeyDialog",
  data: () => ({
    dialog: false,
    key: null,
    snackbar: {
      active: false,
      message: null,
      color: null,
    },
  }),
  computed: {
    license() {
      return this.$store.getters.license;
    },
  },
  methods: {
    reset() {
      this.key = null;
      this.$refs.observer.reset();
    },
    submit() {
      this.$refs.observer.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch("updateLicenseKey", { license_key: this.key })
            .then(() => {
              this.reset();
              if (this.license.errorCode === 0) {
                this.snackbar.color = "green";
                this.snackbar.message = "valid license key.";
                this.snackbar.active = true;
              } else {
                this.snackbar.color = "red";
                this.snackbar.message = this.license.message;
                this.snackbar.active = true;
              }
            });
        }
      });
    },
  },
};
</script>

<style scoped></style>
