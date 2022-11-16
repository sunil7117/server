import { createError } from "../error.js";
import user from "../models/user.js";
import video from "../models/video.js";
export const addVideo = async (req, res, next) => {
  const newVideo = new video({ userId: req.user.id, ...req.body });
  try {
    const saveVideo = await newVideo.save();
    res.status(200).json(saveVideo);
  } catch (err) {
    next(err);
  }
};
export const updateVideo = async (req, res, next) => {
  try {
    const video = await video.findById(req.params.id);
    if (!video) return next(createError(404, "video not found"));
    if (req.user.id === video.userId) {
      const updatedVideo = await video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateVideo);
    } else {
      return next(createError(403, "you can update only your video"));
    }
  } catch (err) {
    next(err);
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await video.findById(req.params.id);
    if (!video) return next(createError(404, "video not found"));
    if (req.user.id === video.userId) {
      await video.findByIdAndDelete(req.params.id);
      res.status(200).json("the video has been deleted");
    } else {
      return next(createError(403, "you can delete only your video"));
    }
  } catch (err) {
    next(err);
  }
};
export const getVideo = async (req, res, next) => {
  try {
    const Video = await video.findById(req.params.id);

    res.status(200).json(Video);
  } catch (err) {
    next(err);
  }
};
export const addView = async (req, res, next) => {
  try {
    await video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.status(200).json("The view has been increased");
  } catch (err) {
    next(err);
  }
};
export const random = async (req, res, next) => {
  try {
    const videos = await video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const trend = async (req, res, next) => {
  try {
    const videos = await video.find().sort({ view: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const sub = async (req, res, next) => {
  try {
    const users = await user.findById(req.user.id);
    const subscribedChannels = users.subscribedUsers;
    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await video.find({ userId: channelId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};
export const getByTag = async (req, res, next) => {
  const tags = req.query.split(",");
  try {
    const videos = await video.find({ tags: { $in: tags } });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
