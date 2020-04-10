<template lang="html">
  <!-- <v-container v-if="infiniteScrollPosts" text-xs-center>
    <div v-for="post in infiniteScrollPosts.posts" :key="post._id">
      <img :src="post.imageUrl" height="100px" />
      <h3>{{ post.title }}</h3>
    </div>
    <v-btn @click="showMorePosts" v-if="showMoreEnabled">Fetch More</v-btn>
  </v-container> -->

  <v-container fluid grid-list-xl>
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex
        xs12
        sm6
        v-for="post in infiniteScrollPosts.posts"
        :key="post._id"
      >
        <v-card>
          <v-img
            hover
            @click.native="goToPost(post._id)"
            :src="post.imageUrl"
            height="30vh"
            lazy
          >
          </v-img>
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline" hover @click="goToPost(post._id)">
                  {{ post.title }}
                </div>
                <span class="grey--text">
                  {{ post.likes }} likes - {{ post.messages.length }} comments
                </span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showPostCreator = !showPostCreator">
              <v-icon>
                {{ `mdi-chevron-${showPostCreator ? "up" : "down"}` }}
              </v-icon>
            </v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="post.createdBy.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text--primary">
                    {{ post.createdBy.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-weight-thin">
                    Added {{ formatCreatedDate(post.createdDate) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">
                      mdi-information
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout column v-if="showMoreEnabled">
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn color="info" @click="showMorePosts">Fetch More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import { INFINITE_SCROLL_POSTS } from "../../queries";

const pageSize = 2;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/post/${postId}`);
    },
    formatCreatedDate(date) {
      return moment(parseInt(date)).format("ll");
    },
    showMorePosts() {
      this.pageNum += 1;
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          console.log("previous result", prevResult.infiniteScrollPosts.posts);
          console.log("fetch more result", fetchMoreResult);
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    }
  }
};
</script>

<style lang="css" scoped></style>
