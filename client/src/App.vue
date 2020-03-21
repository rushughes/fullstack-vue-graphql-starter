<template>
  <v-app>
    <v-toolbar color="primary" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          VueShare
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        flat
        prepend-icon="mdi-magnify"
        placeholder="Search posts"
        color="accent"
        single-line
        high-details
      >
      </v-text-field>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn
          text
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <router-view />
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    horizontalNavItems() {
      return [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock_open", title: "Sign In", link: "/signin" },
        { icon: "mdi-pencil", title: "Sign Up", link: "/signup" }
      ];
    }
  }
};
</script>
