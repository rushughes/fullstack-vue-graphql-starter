<template lang="html">
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn large icon v-if="user" @click="handleToggleLike">
              <v-icon
                large
                :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'"
              >
                mdi-heart
              </v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} Likes</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>
              mdi-arrow-left
            </v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img
              @click="toggleImageDialog"
              :src="getPost.imageUrl"
              id="post__image"
            >
            </v-img>
          </v-tooltip>

          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">
                {{ category }}
              </v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <div class="mt-3">
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleAddPostMessage"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  clearable
                  :append-outer-icon="messageBody && 'mdi-send'"
                  label="Add Message"
                  type="text"
                  prepend-icon="mdi-email"
                  required
                  v-model="messageBody"
                  @click:append-outer="handleAddPostMessage"
                  :rules="messageRules"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{ getPost.messages.length }})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>
              <v-list-item inset :key="message.title">
                <v-list-item-avatar>
                  <v-img :src="message.messageUser.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ message.messageBody }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ message.messageUser.username }}
                    <span class="grey--text text--lighten-1 hidden-xs-only">
                      {{ message.messageDate }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="hidden-xs-only">
                  <v-icon
                    :color="checkIfOwnMessage(message) ? 'accent' : 'grey'"
                  >
                    mdi-message
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST
} from "../../queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      dialog: false,
      isFormValid: true,
      messageBody: "",
      messageRules: [
        message => !!message || "Message is required",
        message =>
          message.length < 50 || "Message must be less than 50 characters"
      ],
      postLiked: false
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavourites"])
  },
  methods: {
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    },
    checkIfPostLiked(postId) {
      if (
        this.userFavourites &&
        this.userFavourites.some(fave => fave._id === postId)
      ) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.messages.unshift(addPostMessage);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset();
            console.log(data.addPostMessage);
          })
          .catch(err => console.error(err));
      }
    },
    handleLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      console.log("Variables", variables);
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables,
          update: cache => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favourites: data.likePost.favourites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleUnlikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables,
          update: cache => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favourites: data.unlikePost.favourites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    toggleImageDialog() {
      if (window.innterWidth > 500) {
        this.dialog = !this.dialog;
      }
    }
  }
};
</script>

<style lang="css" scoped>
#post __image {
  height: 400px!;
}
</style>
