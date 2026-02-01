const commentsRouter = require("express").Router();

const {
  deleteComment,
  updateCommentVotes,
} = require("../controllers/comments.controller");



module.exports = commentsRouter;
