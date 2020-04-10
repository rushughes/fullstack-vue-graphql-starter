<template>
  <v-app>
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark text>
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

          <v-list-item
            key="Signout"
            to="/signout"
            v-if="user"
            @click="handleSignOutUser"
          >
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
        text
        prepend-icon="mdi-magnify"
        placeholder="Search posts"
        color="accent"
        single-line
        high-details
        v-model="searchTerm"
        @input="handleSearchPosts"
      >
      </v-text-field>

      <v-card
        dark
        v-if="searchResults && searchResults.length"
        id="search__card"
      >
        <v-list>
          <v-list-item
            @click="goToSearchResult(result._id)"
            v-for="result in searchResults"
            :key="result._id"
          >
            <v-list-item-title>
              {{ result.title }}
              <span class="font-weight-thin">
                {{ formatDescription(result.description) }}
              </span>
            </v-list-item-title>

            <v-list-item-action v-if="checkIfUserFavourite(result._id)">
              <v-icon>mdi-heart</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

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

        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-xm-only" left>mdi-account</v-icon>
          <v-badge
            right
            color="blue darken-2"
            :class="{ bounce: badgeAnimated }"
          >
            <span slot="badge" v-if="userFavourites.length">
              {{ userFavourites.length }}
            </span>
          </v-badge>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view />
        </transition>
        <v-snackbar
          color="success"
          bottom
          left
          v-model="authSnackbar"
          :timeout="5000"
        >
          <v-icon class="mr-3">mdi-check-circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark text @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <v-snackbar
          color="warning"
          bottom
          left
          v-model="authErrorSnackbar"
          :timeout="5000"
          v-if="authError"
        >
          <v-icon class="mr-3">mdi-cancel</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark text to="/signin">Signin</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false,
      searchTerm: ""
    };
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavourites(value) {
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["user", "authError", "userFavourites", "searchResults"]),
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
          { icon: "mdi-logout", title: "Sign Out", link: "/signout" }
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
    checkIfUserFavourite(resultId) {
      return (
        this.userFavourites &&
        this.userFavourites.some(fave => fave._id === resultId)
      );
    },
    formatDescription(desc) {
      return desc.length > 20 ? `{desc.slice(0,20)}...` : desc;
    },
    goToSearchResult(resultId) {
      this.searchTerm = "";
      this.$router.push(`/post/${resultId}`);
      this.$store.commit("clearSearchResults");
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
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
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

.bounce {
  animation: bounce 1s both;
  @keyframes bounce {
    0%,
    20%,
    53%,
    80%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    40%,
    43% {
      transform: translate3d(0, -20px, 0);
    }
    70% {
      transform: translate3d(0, -10px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
  }
}
</style>
