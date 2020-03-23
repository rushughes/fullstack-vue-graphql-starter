<template lang="html">
  <v-container text-xs-center mt-5 pt-5>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Add Post</h1>
      </v-flex>
    </v-layout>

    <v-form
      v-model="isFormValid"
      lazy-validation
      ref="form"
      @submit.prevent="handleAddPost"
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
          <img :src="imageUrl" height="300px">
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

      <v-btn
        :loading="loading"
        :disabled="!isFormValid || loading"
        color="accent"
        type="submit"
      >
        <span class="custom-loader">
          <v-icon light>mdi-cached</v-icon>
        </span>
        Submit
      </v-btn>

    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [
        image => !!image || "Image is required"
      ],
      categoriesRules: [
        categories => categories.length > 0 || "At least one category is required"
      ],
      descRules: [
        description => !!description || "Description is required",
        description => description.length < 256 || "Description must have less than 256 characters"
      ]
    }
  },
  computed: {
    ...mapGetters(["user", "loading"])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
      }
    }
  }
};
</script>
