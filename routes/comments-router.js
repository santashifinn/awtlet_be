const commentsRouter = require("express").Router();

const {
  deleteComment,
  updateCommentLikes,
} = require("../controllers/comments.controller");

commentsRouter.delete("/:comic_id/:comment_id", deleteComment);

commentsRouter.patch("/:comic_id/:comment_id", updateCommentLikes);

module.exports = commentsRouter;
