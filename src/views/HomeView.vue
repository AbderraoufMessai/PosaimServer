<template>
  <v-card outlined class="rounded-xl">
    <v-card-text>
      <v-list dense>
        <v-list-item>
          <v-list-item-avatar tile>
            <v-icon color="accent">$server</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center">
            <v-list-item-subtitle>Status of application</v-list-item-subtitle>
            <v-list-item-title
              v-text="isActivated ? 'Activated' : 'Inactivated'"
            />
          </v-list-item-content>
          <v-list-item-action>
            <activate-application-dialog :disabled="!!isActivated" />
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item v-if="!isActivated">
          <v-list-item-avatar tile>
            <v-icon color="accent">$pending</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center">
            <v-list-item-subtitle>Trial Mode</v-list-item-subtitle>
            <v-list-item-title
              v-text="trialRest < 0 ? 'Trial is over' : `${trialRest} Days`"
            />
          </v-list-item-content>
          <v-list-item-action>
            <free-trial-dialog :disabled="!!isTrial" />
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="!isActivated" />
        <v-list-item>
          <v-list-item-avatar tile>
            <v-icon color="accent">$online</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center">
            <v-list-item-subtitle>Status of Server</v-list-item-subtitle>
            <v-list-item-title>Offline</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              :disabled="!isRunning"
              color="primary"
              @click="$router.push({ name: 'network' }).catch(() => {})"
            >
              <v-icon>$network</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-avatar tile>
            <v-icon color="accent">$app</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center">
            <v-list-item-subtitle>Open Application</v-list-item-subtitle>
            <v-list-item-title>POSAIM</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn tag="a" href="posaim://" icon color="primary">
              <v-icon>$open</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import ActivateApplicationDialog from "@/components/ActivateApplicationDialog";
import FreeTrialDialog from "@/components/FreeTrialDialog";
export default {
  name: "HomeView",
  components: { FreeTrialDialog, ActivateApplicationDialog },
  data: () => ({}),
  computed: {
    isTrial() {
      return this.$store.getters.isTrial;
    },
    trialFinish() {
      return this.$store.getters.trialFinish;
    },
    trialRest() {
      if (this.trialFinish) {
        return Math.round(
          (this.trialFinish - Date.now()) / (1000 * 60 * 60 * 24)
        );
      }
      return 30;
    },
    isActivated() {
      return this.$store.getters.isActivated;
    },
    isRunning() {
      return this.$store.getters.isRunning;
    },
  },
  methods: {},
};
</script>

<style scoped></style>
