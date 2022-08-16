<template>
  <v-card outlined class="rounded-xl">
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              For any question contact us :
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-avatar tile size="20">
            <v-icon color="accent">$phone</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center">
            <v-list-item-subtitle> (+213) 556 572 960 </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-avatar tile size="20">
            <v-icon color="accent">$email</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center">
            <v-list-item-subtitle> contact@posaim.com </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> Or visit our website </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              rounded
              small
              color="primary"
              style="font-family: 'Neon', sans-serif"
              @click="openLink('https://www.posaim.com')"
            >
              Posaim
              <v-icon small right>$open</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "HelpView",
  methods: {
    openLink(link) {
      require("electron").shell.openExternal(link);
    },
  },
};
</script>

<style scoped></style>
