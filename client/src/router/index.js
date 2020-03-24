import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import AddPost from "../components/Posts/AddPost.vue";
import Posts from "../components/Posts/Posts.vue";
import Post from "../components/Posts/Post.vue";
import Profile from "../components/Auth/Profile.vue";
import SignUp from "../components/Auth/SignUp.vue";
import SignIn from "../components/Auth/SignIn.vue";
import AuthGuard from "../AuthGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/posts",
    name: "Posts",
    component: Posts
  },
  {
    path: "/post/:postId",
    name: "Post",
    component: Post,
    props: true
  },
  {
    path: "/post/add",
    name: "AddPost",
    component: AddPost,
    beforeEnter: AuthGuard
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: AuthGuard
  },
  {
    path: "/signin",
    name: "SignIn",
    component: SignIn
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
