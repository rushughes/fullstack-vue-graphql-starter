import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import { defaultClient as apolloClient } from "../main";
import {
  ADD_POST,
  DELETE_USER_POST,
  GET_CURRENT_USER,
  GET_POSTS,
  GET_USER_POSTS,
  INFINITE_SCROLL_POSTS,
  SEARCH_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  UPDATE_USER_POST
} from "../queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authError: null,
    error: null,
    loading: false,
    posts: [],
    searchResults: [],
    user: null,
    userPosts: []
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    clearUser: state => (state.user = null),
    clearSearchResults: state => (state.searchResults = []),
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: state => (state.error = null),
    setAuthError: (state, payload) => {
      state.authError = payload;
    }
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
    getUserPosts: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(data => {
          commit("setLoading", false);
          commit("setUserPosts", data.data.getUserPosts);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error("ERROR", err);
        });
    },
    searchPosts: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(data => {
          commit("setLoading", false);
          commit("setSearchResults", data.data.searchPosts);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error("ERROR", err);
        });
    },
    addPost: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            const data = cache.readQuery({ query: GET_POSTS });
            data.getPosts.unshift(addPost);
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          optimisticResponde: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(data => {
          console.log(data);
          commit("setLoading", false);
          //localStorage.setItem("token", data.signinUser.token);
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setLoading", false);
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setLoading", false);
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
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
    signUpUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
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
    searchResults: state => state.searchResults,
    posts: state => state.posts,
    user: state => state.user,
    userPosts: state => state.userPosts,
    userFavourites: state => state.user && state.user.favourites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
