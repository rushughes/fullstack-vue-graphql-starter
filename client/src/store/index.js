import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import { defaultClient as apolloClient } from "../main";
import { GET_POSTS, GET_CURRENT_USER, SIGNIN_USER } from "../queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    clearUser: state => (state.user = null),
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(data => {
          commit("setLoading", false);
          commit("setUser", data.data.getCurrentUser);
          console.log(data);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getPosts: context => {
      context.commit("setLoading", true);
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(data => {
          context.commit("setLoading", false);
          context.commit("setPosts", data.data.getPosts);
        })
        .catch(err => {
          context.commit("setLoading", false);
          console.error("ERROR", err);
        });
    },
    signInUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signOutUser: async ({ commit }) => {
      commit("clearUser");
      localStorage.setItem("token", "");
      await apolloClient.resetStore();
      router.push("/");
    }
  },
  modules: {},
  getters: {
    posts: state => state.posts,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  }
});
