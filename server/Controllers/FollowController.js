const express = require("express");
const FollowRouter = express.Router();
const User = require("../Models/UserModel");
const {
  followUser,
  followingUserList,
  followerUserList,
  unfollowUser,
} = require("../Models/FollowModel");

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid following userId",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followerUserId, followingUserId });
    return res.status(201).send({
      message: "Follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

// follow/following-list?skip=8
FollowRouter.get("/following-list", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  const followerUserId = req.session.user.userId;

  //validate the userID
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    const followingList = await followingUserList({ followerUserId, SKIP });

    if (followingList.length === 0) {
      return res.status(200).send({
        message: "following list is empty",
      });
    }

    return res.status(200).send({
      message: "Read Success",
      data: followingList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

FollowRouter.get("/followers-list", async (req, res) => {
  const SKIP = req.query.skip || 0;
  const followingUserId = req.session.user.userId;

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid following userId",
      error: error,
    });
  }

  try {
    const followerList = await followerUserList({ followingUserId, SKIP });

    return res.status(200).send({
      message: "Read success",
      data: followerList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

FollowRouter.post("/unfollow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid following userId",
      error: error,
    });
  }

  try {
    const followDb = await unfollowUser({ followerUserId, followingUserId });

    return res.status(200).send({
      message: "Unfollow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

module.exports = FollowRouter;
