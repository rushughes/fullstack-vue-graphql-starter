import Vue from "vue";
import Vuex from "vuex";
import { defaultClient as apolloClient } from "../main";
import { GET_POSTS } from "../queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
    getPosts: (context) => {
      context.commit("setLoading", true);
      apolloClient.query({
        query: GET_POSTS
      }).then(data => {
        context.commit("setLoading", false);
        context.commit("setPosts", data.data.getPosts);
      }).catch(err => {
        context.commit("setLoading", false);
        console.error("ERROR", err);
      })
    }
  },
  modules: {

  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
});
