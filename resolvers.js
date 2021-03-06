const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
}


module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      } else {
        const user = await User.findOne({ username: currentUser.username }).populate({
          path: 'favourites',
          model: 'Post'
        });
        return user;
      }
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post;
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({}).sort({ createdDate: "desc" }).populate({
          path: "createdBy",
          model: "User"
        }).limit(pageSize);
      } else {
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({}).sort({ createdDate: "desc" }).populate({
          path: "createdBy",
          model: "User"
        }).skip(skips).limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return {
        posts,
        hasMore
      };
    },
    searchPosts: async (parent, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          { $text: { $search: searchTerm } },
          { score: { $meta: 'textScore' } }
        ).sort({
          score: { $meta: 'textScore' },
          likes: 'desc'
        }).limit(5);
        return searchResults;
      }
    }
  },
  Mutation: {
    addPost: async (parent, { title, imageUrl, categories, description, creatorId }, { Post }) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    updateUserPost: async (parent, { postId, userId, title, description, imageUrl, categories }, { Post }) => {
      const post = await Post.findOneAndUpdate(
        {
          _id: postId,
          createdBy: userId
        },
        { $set: { title, imageUrl, categories, description } },
        { new: true }
      );
      return post;
    },
    addPostMessage: async (parent, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId,
      };
      const post = await Post.findOneAndUpdate(
        // get post
        { _id: postId },
        // add message
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // get freshest data
        { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User'
      });
      return post.messages[0];
    },
    deleteUserPost: async(parent, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    likePost: async(parent, { postId, username }, { Post, User }) => {
      // find Post, add 1 to it's like value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favourites: postId } },
        { new: true }
      ).populate({
        path: 'favourites',
        model: 'Post'
      });
      return { likes: post.likes, favourites: user.favourites };
    },
    unlikePost: async(parent, { postId, username }, { Post, User }) => {
      // find Post, add 1 to it's like value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favourites: postId } },
        { new: true }
      ).populate({
        path: 'favourites',
        model: 'Post'
      });
      return { likes: post.likes, favourites: user.favourites };
    },
    signinUser: async (parent, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      } else {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid Password");
        } else {
          return { token: createToken(user, process.env.SECRET, "1hr") };
        }
      }
    },
    signupUser: async (parent, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
}
