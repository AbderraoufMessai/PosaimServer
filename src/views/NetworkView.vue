<template>
  <v-card outlined class="rounded-xl" elevation="10">
    <v-card-title> Network </v-card-title>
    <v-card-text>
      <v-select
        v-model="ips"
        :items="ips"
        label="Address Ip"
        append-icon="mdi-server-network"
        chips
        color="primary"
        multiple
        readonly
        outlined
        rounded
      />
      <v-select
        v-model="port"
        :items="[port]"
        label="Port"
        append-icon="mdi-web"
        chips
        color="primary"
        readonly
        outlined
        rounded
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "NetworkView",
  data: () => ({
    ips: [],
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
