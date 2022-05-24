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
            <v-icon>$play</v-icon>
          </v-btn>
        </template>
        Start Free Trial
      </v-tooltip>
    </template>
    <v-card class="rounded-xl" dark color="accent" tile>
      <v-toolbar dense flat color="accent">
        <v-toolbar-title class="text-body-1"> Free Trial Mode </v-toolbar-title>
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
      <v-card-text class="pt-5">
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
            <v-textarea
              v-model="duration"
              label="Duration"
              append-icon="$duration"
              color="primary"
              dense
              hide-details
              readonly
              outlined
              rounded
              rows="1"
              no-resize
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn rounded dark color="green" @click="startTrial">
          <v-icon small left>$run</v-icon> Start
        </v-btn>
      </v-card-actions>
    </v-card>
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
  name: "FreeTrialDialog",
  props: {
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    dialog: false,
    duration: "30 days",
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
    async startTrial() {
      await this.$store.dispatch("startTrial").then(() => {
        this.dialog = false;
      });
    },
  },
};
</script>

<style scoped></style>
