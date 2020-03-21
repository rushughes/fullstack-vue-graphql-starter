import Vue from "vue";
import Vuex from "vuex";
import { gql } from "apollo-boost";
import { defaultClient as apolloClient } from "../main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    }
  },
  actions: {
    getPosts: (context) => {
      apolloClient.query({
        query: gql`
          query {
            getPosts {
              _id
              title
              imageUrl
            }
          }
        `
      }).then(data => {
        context.commit("setPosts", data.data.getPosts);
        console.log("DATA", data.data.getPosts);
      }).catch(err => {
        console.error("ERROR", err);
      })
    }
  },
  modules: {

  },
  getters: {
    posts: state => state.posts
  }
});
