<template>
  <v-app>
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-icon @click="toggleSideNav">mdi-menu</v-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card class="mx-auto" max-width="400" tile>
        <v-list>
          <v-list-item
            v-for="item in sideNavItems"
            :key="item.title"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item key="Profile" to="/profile" v-if="user">
            <v-list-item-icon>
              <v-icon>mdi-face-profile</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Profile
            </v-list-item-title>
          </v-list-item>

          <v-list-item key="Signout" to="/signout" v-if="user" @click="handleSignOutUser">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Sign Out
            </v-list-item-title>
          </v-list-item>

        </v-list>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
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
    </v-app-bar>
    <v-content>
      <transition name="fade">
        <router-view />
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      sideNav: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
    horizontalNavItems() {
      let items = [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open-outline", title: "Sign In", link: "/signin" },
        { icon: "mdi-pencil", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "mdi-chat", title: "Posts", link: "/posts" },
          { icon: "mdi-folder-plus", title: "Create Post", link: "/post/add" },
          { icon: "mdi-face-profile", title: "Profile", link: "/profile" },
          { icon: "mdi-logout", title: "Sign Out", link: "/signout" },
        ];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open-outline", title: "Sign In", link: "/signin" },
        { icon: "mdi-pencil", title: "Sign Up", link: "/signup" }
      ];
      // if (this.user) {
      //   items = [
      //     { icon: "mdi-chat", title: "Posts", link: "/posts" },
      //     { icon: "mdi-folder-plus", title: "Create Post", link: "/post/add" },
      //     { icon: "mdi-face-profile", title: "Profile", link: "/profile" },
      //   ];
      // }
      return items;
    }
  },
  methods: {
    handleSignOutUser() {
      this.$store.dispatch("signOutUser");
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-dutration: 0.25s;
}

.fade-enter-active {
  transiation-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
