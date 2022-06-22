<template>
  <v-app>
    <v-system-bar app color="primary">
      <v-spacer />
      <v-icon v-if="isDevelopment" small @click="resetSettings">$cancel</v-icon>
      <v-icon v-if="isDevelopment" small @click="openConsole">$console</v-icon>
      <v-icon small @click="minimizeWindow">$minimize</v-icon>
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
              :disabled="!isRunning && item.server"
              @click="$router.push({ name: item.path }).catch(() => {})"
            >
              <v-icon v-text="item.icon" />
            </v-btn>
          </template>
          {{ item.title }}
        </v-tooltip>
        <v-tooltip v-if="isActivated || isTrial" left>
          <template #activator="{ on, attrs }">
            <v-btn
              fab
              dark
              :color="isRunning ? 'red' : 'green'"
              :loading="loading"
              v-bind="attrs"
              v-on="on"
              @click.stop="switchServer"
            >
              <v-icon> $power </v-icon>
            </v-btn>
          </template>
          {{ isRunning ? "Close Server" : "Start Server" }}
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
                :color="isRunning ? 'green' : 'red'"
                v-text="isRunning ? '$online' : '$offline'"
              />
            </template>
            <span
              v-text="isRunning ? 'Server is online' : 'Server is offline'"
            />
          </v-tooltip>
        </v-col>
        <v-col class="text-center">
          <small v-text="'Copyright © ' + new Date().getFullYear()" />
        </v-col>
        <v-col class="text-right">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-icon
                left
                v-bind="attrs"
                v-on="on"
                :color="isActivated ? 'green' : isTrial ? '' : 'red'"
                v-text="isActivated ? '$unlock' : '$lock'"
              />
            </template>
            <span
              v-text="
                isActivated
                  ? 'App is activated'
                  : isTrial
                  ? 'Trial mode'
                  : 'App is locked'
              "
            />
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
    loading: false,
    itemsNavigation: [
      { title: "Home", path: "home", icon: "$home" },
      { title: "Network", path: "network", icon: "$network", server: true },
      { title: "Database", path: "database", icon: "$database", server: false },
      {
        title: "Administration",
        path: "administration",
        icon: "$administration",
        server: true,
      },
      { title: "Help", path: "help", icon: "$help" },
    ],
  }),
  mounted() {
    this.$store.dispatch("validateLicenseKey").then(() => {
      let interval;
      if (!this.isActivated) {
        interval = setInterval(() => {
          this.$store.dispatch("validateTrial").then(() => {
            if (!this.isTrial && !this.isActivated) {
              this.$store.dispatch("closeServer");
            }
          });
        }, 1000);
      } else {
        clearInterval(interval);
      }
    });
  },
  computed: {
    isDevelopment() {
      return this.$store.getters.isDevelopment;
    },
    isTrial() {
      return this.$store.getters.isTrial;
    },
    isActivated() {
      return this.$store.getters.isActivated;
    },
    isRunning() {
      return this.$store.getters.isRunning;
    },
  },
  methods: {
    resetSettings() {
      this.$store.dispatch("reset");
    },
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
      this.loading = true;
      if (this.isRunning) {
        this.closeServer().then(() => {
          this.loading = false;
        });
      } else {
        this.startServer().then(() => {
          this.loading = false;
        });
      }
    },
    async startServer() {
      await this.$store.dispatch("startServer");
      this.$router.push({ name: "network" }).catch(() => {});
    },
    async closeServer() {
      await this.$store.dispatch("closeServer");
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
