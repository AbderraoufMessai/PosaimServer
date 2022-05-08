<template>
  <v-app>
    <v-system-bar app color="primary">
      <v-spacer />
      <v-icon small @click="openConsole">$console</v-icon>
      <v-icon small @click="minimizeWindow">$minimize</v-icon>
      <!--      <v-icon small disabled>$maximize</v-icon>-->
      <v-icon small @click="closeWindow">$close</v-icon>
    </v-system-bar>
    <v-app-bar
      app
      fixed
      dark
      dense
      clipped-left
      flat
      color="accent"
      class="rounded-b-xl"
    >
      <v-spacer />
      <v-app-bar-title>
        <v-icon left>$server</v-icon>
        Posaim Server
      </v-app-bar-title>
      <v-spacer />
      <v-speed-dial
        v-model="menu"
        top
        right
        absolute
        direction="bottom"
        transition="slide-y-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn v-model="menu" fab color="success">
            <v-icon v-if="menu" color="black"> $close </v-icon>
            <v-icon v-else color="black" v-text="'$' + $route.name" />
          </v-btn>
        </template>
        <v-tooltip v-for="item in itemsNavigation" :key="item.title" left>
          <template #activator="{ on, attrs }">
            <v-btn
              fab
              dark
              small
              v-bind="attrs"
              v-on="on"
              :disabled="!running && item.server"
              @click="$router.push({ name: item.path }).catch(() => {})"
            >
              <v-icon v-text="item.icon" />
            </v-btn>
          </template>
          {{ item.title }}
        </v-tooltip>
        <v-tooltip v-if="valid" left>
          <template #activator="{ on, attrs }">
            <v-btn
              fab
              dark
              :color="running ? 'red' : 'green'"
              v-bind="attrs"
              v-on="on"
              @click.stop="switchServer"
            >
              <v-icon> $power </v-icon>
            </v-btn>
          </template>
          {{ running ? "Close Server" : "Start Server" }}
        </v-tooltip>
      </v-speed-dial>
    </v-app-bar>
    <v-main
      class="align-center"
      height="100%"
      style="background-color: rgb(230, 230, 230)"
    >
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-footer app fixed dark color="accent" class="rounded-t-xl">
      <v-row dense>
        <v-col class="text-left">
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-icon
                left
                v-bind="attrs"
                v-on="on"
                :color="running ? 'green' : 'red'"
                v-text="valid ? '$online' : '$offline'"
              />
            </template>
            <span v-text="running ? 'Server is online' : 'Server is offline'" />
          </v-tooltip>
        </v-col>
        <v-col class="text-center">
          {{ "Copyright © " + new Date().getFullYear() }}
        </v-col>
        <v-col class="text-right">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-icon
                left
                v-bind="attrs"
                v-on="on"
                :color="valid ? 'green' : 'red'"
                v-text="valid ? '$unlock' : '$lock'"
              />
            </template>
            <span v-text="valid ? 'App is activated' : 'App is locked'" />
          </v-tooltip>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    menu: false,
    drawer: false,
    key: null,
    itemsNavigation: [
      { title: "Home", path: "home", icon: "$home" },
      { title: "Network", path: "network", icon: "$network", server: true },
      { title: "Database", path: "database", icon: "$database", server: true },
      {
        title: "Administration",
        path: "administration",
        icon: "$administration",
        server: true,
      },
      { title: "Help", path: "help", icon: "$help" },
    ],
  }),
  async mounted() {
    await this.$store.dispatch("verifyLicenseKey");
    window.setInterval(async () => {
      await this.$store.dispatch("verifyLicenseKey").then(async () => {
        if (!this.valid) {
          await this.$store.dispatch("closeServer");
        }
      });
    }, 1000); // every 1 second
  },
  computed: {
    valid() {
      return this.$store.getters.valid;
    },
    running() {
      return this.$store.getters.running;
    },
  },
  methods: {
    openConsole() {
      this.$store.dispatch("openConsole");
    },
    closeWindow() {
      this.$store.dispatch("closeWindow");
    },
    minimizeWindow() {
      this.$store.dispatch("minimizeWindow");
    },
    switchServer() {
      if (this.running) {
        this.closeServer();
      } else {
        this.startServer();
      }
    },
    startServer() {
      this.$store.dispatch("startServer");
    },
    closeServer() {
      this.$store.dispatch("closeServer");
      this.$router.push({ name: "home" }).catch(() => {});
    },
  },
};
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>
