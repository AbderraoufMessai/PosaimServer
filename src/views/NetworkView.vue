<template>
  <v-card outlined class="rounded-xl">
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <span>
            <v-icon color="green" small left>$run</v-icon>
            Server is running ...
          </span>
          <div class="text-center">
            <span v-for="ip in ips" :key="ip">
              <a
                v-text="`http://${ip}:${port}/`"
                @click="openLink(`http://${ip}:${port}/`)"
              />
              <br />
            </span>
          </div>
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="ips"
            :items="ips"
            label="Address Ip"
            append-icon="$link"
            chips
            dense
            hide-details
            color="primary"
            multiple
            readonly
            outlined
            rounded
          />
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="port"
            :items="[port]"
            label="Port"
            append-icon="$globe"
            hide-details
            dense
            chips
            color="primary"
            readonly
            outlined
            rounded
          />
        </v-col>
      </v-row>
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
