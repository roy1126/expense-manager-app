<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app :style="darkModeStyle">
      <v-list-item>
        <v-list-item-content :style="darkModeStyle">
          <v-list-item-title class="text-h6">
            Expense Manager
          </v-list-item-title>
          <v-list-item-subtitle :style="darkModeStyle">
            v1.0.0
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content :style="darkModeStyle">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevation="0" app :style="darkModeStyle">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main :style="darkModeStyle">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      { title: "Profile", icon: "mdi-account", to: "/profile" },
      { title: "Monthly", icon: "mdi-alpha-m-circle-outline", to: "/" },
      {
        title: "Calendar",
        icon: "mdi-calendar-clock",
        to: "/calendar",
      },
      { title: "Settings", icon: "mdi-cog-outline", to: "/settings" },
    ],
  }),
  watch: {
    darkMode(value) {
      document
        .querySelectorAll(".theme--light.v-icon")
        .forEach((a) => (a.style.color = value ? "white" : "#0000008a"));
    },
  },
  computed: {
    darkMode() {
      return this.$store.getters.getSettings.darkMode;
    },
    darkModeStyle() {
      const darkMode = this.$store.getters.getSettings.darkMode;
      return `background-color: ${darkMode ? "#3c3c3c" : "#f5f5f5"} ; color: ${
        darkMode ? "white" : "black"
      } `;
    },
  },
};
</script>

<style></style>
