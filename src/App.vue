<template>
  <v-app v-if="valid">
    <v-system-bar app color="primary">
      <v-icon>mdi-lock-clock</v-icon>
      <span
        v-text="`Expired at ${new Date(license.date).toLocaleDateString()}`"
      />
      <v-spacer />
      <v-btn x-small icon @click="openConsole">
        <v-icon>mdi-console</v-icon>
      </v-btn>
      <v-btn x-small icon @click="minimizeWindow">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn class="mx-2" x-small icon disabled>
        <v-icon>mdi-checkbox-blank-outline</v-icon>
      </v-btn>
      <v-btn x-small icon @click="closeWindow">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar
      app
      fixed
      dark
      dense
      flat
      clipped-left
      color="accent"
      class="rounded-br-xl"
    >
      <v-spacer />
      <v-app-bar-title>
        <v-icon right>mdi-server</v-icon>
        Supermarket Server
      </v-app-bar-title>
      <v-spacer />
      <v-tooltip v-if="!serverIsRunning" color="green" left>
        <template #activator="{ on, attrs }">
          <v-btn
            color="error"
            dark
            absolute
            bottom
            right
            v-bind="attrs"
            v-on="on"
            fab
            @click="startServer"
          >
            <v-icon large> mdi-power </v-icon>
          </v-btn>
        </template>
        <v-icon small left> mdi-power-on </v-icon> Click to Start Server
      </v-tooltip>
      <v-tooltip v-else color="error" left>
        <template #activator="{ on, attrs }">
          <v-btn
            color="green"
            dark
            absolute
            bottom
            right
            v-bind="attrs"
            v-on="on"
            fab
            @click="closeServer"
          >
            <v-icon large> mdi-power </v-icon>
          </v-btn>
        </template>
        <v-icon small left> mdi-power-off </v-icon> Click to Stop Server
      </v-tooltip>
    </v-app-bar>
    <v-navigation-drawer
      app
      dark
      permanent
      mini-variant
      expand-on-hover
      fixed
      clipped
      touchless
      style="z-index: 100"
      width="200"
      color="accent"
      class="rounded-br-xl"
    >
      <v-divider />
      <v-list nav dense rounded>
        <v-list-item
          v-for="(item, i) in itemsNavigation"
          :to="item.path"
          :key="i"
          link
          color="primary"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" />
          </v-list-item-icon>
          <v-list-item-title v-text="item.title" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main
      class="align-center"
      height="100%"
      style="background-color: rgb(230, 230, 230)"
    >
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
  <v-app v-else>
    <v-system-bar app color="primary">
      <v-spacer />
      <v-btn x-small icon @click="openConsole">
        <v-icon>mdi-console</v-icon>
      </v-btn>
      <v-btn x-small icon @click="minimizeWindow">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn class="mx-2" x-small icon disabled>
        <v-icon>mdi-checkbox-blank-outline</v-icon>
      </v-btn>
      <v-btn x-small icon @click="closeWindow">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar app fixed dark dense flat color="accent" class="rounded-b-xl">
      <v-spacer />
      <v-app-bar-title>
        <v-icon right>mdi-server</v-icon>
        Supermarket Server
      </v-app-bar-title>
      <v-spacer />
    </v-app-bar>
    <v-main
      class="align-center"
      height="100%"
      style="background-color: rgb(230, 230, 230)"
    >
      <v-container>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <v-card
              color="accent"
              dark
              max-width="450"
              class="mx-auto rounded-xl"
              elevation="24"
              outlined
            >
              <v-card-text>
                <v-text-field
                  v-model="machineId"
                  label="Machine Id"
                  append-icon="mdi-desktop-classic "
                  color="primary"
                  outlined
                  rounded
                  dense
                  readonly
                />
                <validation-provider
                  v-slot="{ errors }"
                  name="license"
                  rules="required"
                >
                  <v-text-field
                    v-model="key"
                    label="License key"
                    append-icon="mdi-key"
                    :error-messages="errors"
                    color="primary"
                    outlined
                    rounded
                    dense
                    required
                  />
                </validation-provider>
              </v-card-text>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    absolute
                    bottom
                    color="secondary"
                    left
                    v-bind="attrs"
                    v-on="on"
                    fab
                    small
                    @click="reset"
                  >
                    <v-icon color="black"> mdi-cancel </v-icon>
                  </v-btn>
                </template>
                Reset
              </v-tooltip>
              <v-tooltip color="green" bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="green"
                    dark
                    absolute
                    bottom
                    right
                    v-bind="attrs"
                    v-on="on"
                    fab
                    small
                    type="submit"
                    :disabled="invalid"
                  >
                    <v-icon> mdi-check </v-icon>
                  </v-btn>
                </template>
                Update
              </v-tooltip>
            </v-card>
          </form>
        </validation-observer>
      </v-container>
    </v-main>
    <v-footer dark color="accent">
      <v-icon left small>mdi-phone</v-icon>
      <span class="text-body-2"> (+213) 556 57 29 60 </span>
      <v-spacer />
      <v-icon left small>mdi-email</v-icon>
      <span class="text-body-2"> abderraoufmessai@gmail.com </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    key: null,
    itemsNavigation: [
      { title: "Network", path: "/", icon: "mdi-network" },
      { title: "Database", path: "/database", icon: "mdi-database" },
      {
        title: "Administration",
        path: "/administration",
        icon: "mdi-shield-account",
      },
    ],
  }),
  async mounted() {
    await this.$store.dispatch("verifyLicenseKey").then(() => {
      this.key = this.license ? this.license.license : null;
    });
  },
  computed: {
    machineId() {
      return this.$store.getters.machineId;
    },
    license() {
      return this.$store.getters.license;
    },
    valid() {
      return this.$store.getters.valid;
    },
    serverIsRunning() {
      return this.$store.getters.serverIsRunning;
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
    startServer() {
      this.$store.dispatch("startServer");
    },
    closeServer() {
      this.$store.dispatch("closeServer");
    },
    reset() {
      this.key = null;
      this.$refs.observer.reset();
    },
    submit() {
      this.$refs.observer.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch("updateLicenseKey", {
              license_key: this.key,
            })
            .then(() => {
              const error = this.license
                ? { license: this.license.message }
                : null;
              if (error && this.$refs.observer) {
                this.$refs.observer.setErrors(error);
              }
            });
        }
      });
    },
  },
};
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>
