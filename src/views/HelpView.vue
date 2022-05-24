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
            <v-list-item-subtitle> (+213) 556 57 29 60 </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-avatar tile size="20">
            <v-icon color="accent">$email</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center">
            <v-list-item-subtitle>
              abderraoufmessai@gmail.com
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "HelpView",
};
</script>

<style scoped></style>
