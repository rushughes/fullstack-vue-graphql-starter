<template lang="html">
  <v-container text-xs-center mt-5 pt-5>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Sign Up</h1>
      </v-flex>
    </v-layout>

    <v-form
      v-model="isFormValid"
      lazy-validation
      ref="form"
      @submit.prevent="handleSignUpUser"
    >
      <v-text-field
        :rules="usernameRules"
        v-model="username"
        prepend-icon="mdi-account"
        label="Username"
        type="text"
        required
      ></v-text-field>

      <v-text-field
        :rules="emailRules"
        v-model="email"
        prepend-icon="mdi-email"
        label="Email"
        type="text"
        required
      ></v-text-field>

      <v-text-field
        :rules="passwordRules"
        v-model="password"
        prepend-icon="mdi-lock"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-text-field
        :rules="passwordRules"
        v-model="passwordConfirmation"
        prepend-icon="mdi-lock"
        label="Confirm Password"
        type="password"
        required
      ></v-text-field>

      <v-btn
        :loading="loading"
        :disabled="!isFormValid || loading"
        color="accent"
        type="submit"
      >
        <span class="custom-loader">
          <v-icon light>mdi-cached</v-icon>
        </span>
        Sign Up
      </v-btn>

      <h3>
        Already have an account?
        <router-link to="/signin">Sign In</router-link>
      </h3>

    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SignUp",
  data() {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        username => !!username || "Username is required",
        username =>
          username.length < 10 || "Username must be less than 10 characters"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          password.length > 7 || "Password must be greater than 7 characters",
        confirmation =>
            confirmation === this.password || "Both passwords must match"
      ],
      emailRules: [
        email => !!email || "Email is required"
      ]
    }
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    ...mapGetters(["loading", "error", "user"])
  },
  methods: {
    handleSignUpUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signUpUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>

<style lang="css" scoped></style>
