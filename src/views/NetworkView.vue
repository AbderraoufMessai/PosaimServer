<template>
  <div>
    <v-card outlined class="rounded-xl">
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-avatar size="20">
              <v-icon color="green">$globe</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title> Server is running ... </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <template v-for="ip in ips">
            <v-list-item :key="ip">
              <v-list-item-avatar size="15">
                <v-icon>$link</v-icon>
              </v-list-item-avatar>
              <v-list-item-content class="text-center">
                <v-list-item-subtitle v-text="`http://${ip}:${port}/`" />
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="copy(`http://${ip}:${port}/`)"
                >
                  <v-icon small>$copy</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn
                  icon
                  small
                  color="success"
                  @click="openLink(`http://${ip}:${port}/`)"
                >
                  <v-icon small>$open</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="ip !== ips[ips.length - 1]" :key="ip + 'd'" />
          </template>
        </v-list>
      </v-card-text>
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
  </div>
</template>

<script>
export default {
  name: "NetworkView",
  data: () => ({
    ips: [],
    snackbar: {
      active: false,
      message: null,
      color: null,
    },
  }),
  computed: {
    port() {
      return this.$store.getters.port;
    },
  },
  mounted() {
    this.getAddressIP();
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
    openLink(link) {
      require("electron").shell.openExternal(link);
    },
    getAddressIP() {
      let pc = new RTCPeerConnection();
      let ips = [];

      pc.createDataChannel("");
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));

      pc.onicecandidate = (event) => {
        if (!event || !event.candidate) {
          this.ips = ips;
        } else {
          let parts = event.candidate.candidate.split(" ");
          let ip = parts[4];
          if (!ips.some((e) => e === ip)) ips.push(ip);
        }
      };
    },
  },
};
</script>

<style scoped></style>
