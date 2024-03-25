const express = require("express");
const { BlogDataValidate } = require("../Utils/BlogUtil");
const BlogRouter = express.Router();
const User = require("../Models/UserModel");
const Blog = require("../Models/BlogModel");
const { followingUserList } = require("../Models/FollowModel");

BlogRouter.post("/create-blog", async (req, res) => {
  console.log(req.body);
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = new Date();

  //data validation
  try {
    await BlogDataValidate({ title, textBody, userId });
    const userDb = await User.verifyUserId({ userId });
  } catch (error) {
    return res.status(400).send({
      error: error,
    });
  }

  //fun<---blogmodel
  const blogObj = new Blog({ title, textBody, userId, creationDateTime });

  try {
    const blogDb = await blogObj.createBlog();

    return res.status(201).send({
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
});

// /blog/get-blogs?skip=10
BlogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;

  try {
    //get the following user data

    const followingUserData = await followingUserList({
      followerUserId: req.session.user.userId,
      SKIP,
    });

    let followingUserIds = [];
    followingUserData.map((obj) => {
      followingUserIds.push(obj._id);
    });

    console.log(followingUserIds);
    const blogDb = await Blog.getBlogs({ followingUserIds, SKIP });
    return res.status(200).send({
      message: "Read success",
      data: blogDb,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
});

BlogRouter.get("/my-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  const userId = req.session.user.userId;

  try {
    const myBlogsDb = await Blog.myBlogs({ SKIP, userId });

    return res.status(200).send({
      message: "Reach success",
      data: myBlogsDb,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

// {
//   "data":{
//     "title",
//     "textBody"
//   },
//   blogId;
// }
BlogRouter.post("/edit-blogs", async (req, res) => {
  const { title, textBody } = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  //data validation
  try {
    await BlogDataValidate({ title, textBody, userId });
  } catch (error) {
    return res.status(400).send({
      error: error,
    });
  }

  //find the blog with blogId
  try {
    const blogDb = await Blog.getBlogWithId({ blogId });

    //check the ownership
    //if(userId1.toString() === userId2.toString())
    if (!blogDb.userId.equals(userId)) {
      return res.status(401).send({
        message: "Not allowed to edit, authorization failed",
      });
    }

    //compare the time, <30 mins
    const diff =
      (Date.now() - new Date(blogDb.creationDateTime).getTime()) / (1000 * 60);
    console.log(diff);

    if (diff > 30) {
      return res.status(401).send({
        message: "Not allowed to edit after 30 mins of creation",
      });
    }

    //update the value
    const blogObj = new Blog({
      title,
      textBody,
      userId,
      creationDateTime: blogDb.creationDateTime,
      blogId,
    });
    const oldBlogData = await blogObj.updateBlog();

    return res.status(200).send({
      message: "Update successfull",
      data: oldBlogData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

BlogRouter.delete("/delete-blog", async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    //find the blog

    const blogDb = await Blog.getBlogWithId({ blogId });
    console.log(blogDb);

    //compare the owner
    //id1.equals(id2)
    if (!blogDb.userId.equals(userId)) {
      return res.status(401).send({
        message: "Not allowed to delete, authorization failed",
      });
    }

    //delete the blog

    const deletedBlogDb = await Blog.deleteBlog({ blogId });

    return res.status(200).send({
      message: "delete successfull",
      data: deletedBlogDb,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

module.exports = BlogRouter;
