<template>
  <v-card outlined class="rounded-xl">
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
          <v-textarea
            v-model="key"
            label="License key"
            append-icon="$key"
            color="primary"
            hide-details
            dense
            readonly
            outlined
            rounded
            rows="1"
            no-resize
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="expired"
            label="Expired at"
            append-icon="$date"
            color="primary"
            type="date"
            hide-details
            dense
            readonly
            outlined
            rounded
          />
        </v-col>
      </v-row>
    </v-card-text>
    <LicenseKeyDialog />
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
  </v-card>
</template>

<script>
import LicenseKeyDialog from "@/components/LicenseKeyDialog";
export default {
  name: "HomeView",
  components: { LicenseKeyDialog },
  data: () => ({
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
    license() {
      return this.$store.getters.license;
    },
    key() {
      return this.license ? this.license.key : null;
    },
    expired() {
      return this.license
        ? this.license.expiration
          ? new Date(this.license.expiration).toISOString().substr(0, 10)
          : null
        : null;
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
  },
};
</script>

<style scoped></style>
