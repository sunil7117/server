import { createError } from "../error.js";
import comment from "../models/comment.js";
import video from "../models/video.js";

export const addComment = async (req, res, next) => {
  const newComment = new comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await comment.findById(res.params.id);
    const video = await video.findById(req.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await comment.findByIdAndDelete(req.params.id);
      res.status(200).json("the comment has been deleted");
    } else {
      return next(createError(403, "You can delete only your comments"));
    }
  } catch (err) {
    next(err);
  }
};
export const getComment = async (req, res, next) => {
  try {
    const comments = await comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
