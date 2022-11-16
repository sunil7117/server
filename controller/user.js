import { createError } from "../error.js";
import user from "../models/user.js";
import video from "../models/video.js";
// update user
export const getall = async (req, res, next) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    const updateUser = await user.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } else {
    return next(createError(403, "you can update onlu your account"));
  }
};
// delete user
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    await user.findByIdAndDelete(req.params.id);
    res.status(200).json("user deleted");
  } else {
    return next(createError(403, "you can update onlu your account"));
  }
};
// get  user
export const getUser = async (req, res, next) => {
  try {
    const getUser = await user.findById(req.params.id);
    res.status(200).json(getUser);
  } catch (err) {
    next(err);
  }
};
// subscribe a   user
export const subscribe = async (req, res, next) => {
  try {
    await user.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await user.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });
    res.status(200).json("Subscrinion successful");
  } catch (err) {
    next(err);
  }
};
// unsubscribe a   user
export const unsubscribe = async (req, res, next) => {
  try {
    await user.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await user.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } });
    res.status(200).json("unsubscrinion successful");
  } catch (err) {
    next(err);
  }
};
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  console.log("like");
  try {
    const user = await video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json("The video has been liked." + user.likes.length);
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The video has been disliked.");
  } catch (err) {
    next(err);
  }
};
