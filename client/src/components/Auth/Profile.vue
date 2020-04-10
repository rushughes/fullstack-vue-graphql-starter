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
        <h2 class="font-weight-light">
          Your Posts
          <span class="font-weight-regular">({{ userPosts.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn
              color="info"
              floating
              fab
              small
              dark
              @click="editPostDialog = true"
            >
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

    <v-dialog xs12 sm6 offset-sm3 v-model="editPostDialog" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-container>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleUpdateUserPost"
          >
            <v-text-field
              :rules="titleRules"
              v-model="title"
              prepend-icon="mdi-account"
              label="Title"
              type="text"
              required
            ></v-text-field>

            <v-text-field
              :rules="imageRules"
              v-model="imageUrl"
              prepend-icon="mdi-email"
              label="Image URL"
              type="text"
              required
            ></v-text-field>

            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px" />
              </v-flex>
            </v-layout>

            <v-select
              v-model="categories"
              :items="['Art', 'Education', 'Travel', 'Photography', 'Technology']"
              multiple
              label="Categories"
              :rules="categoriesRules"
            >
            </v-select>

            <v-textarea
              :rules="descRules"
              v-model="description"
              prepend-icon="mdi-lock"
              label="Description"
              type="text"
              required
            ></v-textarea>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" class="success--text" flat>Update</v-btn>
              <v-btn class="error--text" flat @click="editPostDialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length > 0 || "At least one category is required"
      ],
      descRules: [
        description => !!description || "Description is required",
        description =>
          description.length < 256 ||
          "Description must have less than 256 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "userFavourites", "userPosts"])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {

    }
  }
};
</script>

<style lang="css" scoped></style>
