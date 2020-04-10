<template lang="html">
  <v-container class="text-xs-center">
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ user.username }}</div>
                <div>Joined {{ user.joinDate }}</div>
                <div class="hidden-xs-only font-weight-thin">
                  {{ user.favourites.length }} Favourites
                </div>
                <div class="hidden-xs-only font-weight-thin">
                  {{ userPosts.length }} Posts Added
                </div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <v-container v-if="!userFavourites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no favourites currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favourited
          <span class="font-weight-regular">
            ({{ userFavourites.length }})
          </span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          v-for="favourite in userFavourites"
          :key="favourite._id"
        >
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img height="30vh" :src="favourite.imageUrl"></v-img>
            <v-card-text>{{ favourite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no posts currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Your Posts
          <span class="font-weight-regular">
            ({{ userPosts.length }})
          </span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn color="info" floating fab small dark>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" floating fab small dark>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-img height="30vh" :src="post.imageUrl"></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user", "userFavourites", "userPosts"])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', {
        userId: this.user._id
      });
    }
  }
};
</script>

<style lang="css" scoped></style>
