<template>
  <v-dialog v-model="dialog" class="rounded-xl" persistent>
    <template #activator="{ on: onDialog, attrs: attrsDialog }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip, attrs: attrsTooltip }">
          <v-btn
            icon
            color="primary"
            :disabled="disabled"
            v-bind="{ ...attrsTooltip, ...attrsDialog }"
            v-on="{ ...onTooltip, ...onDialog }"
          >
            <v-icon>$key</v-icon>
          </v-btn>
        </template>
        Activate Application
      </v-tooltip>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <v-card class="rounded-xl" dark color="accent" tile>
          <v-toolbar dense flat color="accent">
            <v-toolbar-title class="text-body-1">
              Activate Application
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
          <v-divider />
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  v-model="machineId"
                  label="Machine id"
                  append-icon="$machine"
                  color="primary"
                  hide-details
                  dense
                  readonly
                  outlined
                  rounded
                  rows="1"
                  no-resize
                  @click="copy(machineId)"
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="license key"
                  rules="required"
                >
                  <v-textarea
                    v-model="key"
                    label="License key"
                    append-icon="$key"
                    color="primary"
                    :error-messages="errors"
                    :hide-details="errors.length === 0"
                    dense
                    outlined
                    rounded
                    rows="1"
                    no-resize
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn rounded dark color="green" :disabled="invalid" type="submit">
              <v-icon small left>$save</v-icon> Activate
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
  name: "ActivateApplicationDialog",
  props: {
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
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
    machineId() {
      return this.$store.getters.machineId;
    },
    licenseKey() {
      return this.$store.getters.licenseKey;
    },
    isActivated() {
      return this.$store.getters.isActivated;
    },
  },
  mounted() {
    this.key = this.licenseKey;
  },
  methods: {
    async copy(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.snackbar.message = "Has been copied.";
        this.snackbar.color = "green";
        this.snackbar.active = true;
      } catch ($e) {
        this.snackbar.message = "Cannot be copied.";
        this.snackbar.color = "red";
        this.snackbar.active = true;
      }
    },
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
              if (this.isActivated) {
                this.dialog = false;
                this.snackbar.color = "green";
                this.snackbar.message = "valid license key.";
                this.snackbar.active = true;
              } else {
                this.reset();
                this.snackbar.color = "red";
                this.snackbar.message = "invalid license key";
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
