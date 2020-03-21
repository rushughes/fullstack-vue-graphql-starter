import Vue from "vue";
import Vuex from "vuex";
import { gql } from "apollo-boost";
import { defaultClient as apolloClient } from "../main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    getPosts: () => {
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
        console.log("DATA", data);
      }).catch(err => {
        console.error("ERROR", err);
      })
    }
  },
  modules: {

  }
});
