const comicsRouter = require("express").Router();

const {
  getComics,
  getComicById,
  updateLikes,
  postComic,
  deleteComic,
} = require("../controllers/comics.controller");
const {
  getCommentsByComic,
  postComment,
} = require("../controllers/comments.controller");

comicsRouter.get("/", getComics);

comicsRouter.get("/:comics_id", getComicById);

comicsRouter.post("/", postComic);

comicsRouter.get("/:comics_id/comments", getCommentsByComic);

comicsRouter.post("/:comic_id/comments", postComment);

comicsRouter.patch("/:comic_id", updateLikes);

comicsRouter.delete("/:comic_id", deleteComic);

module.exports = comicsRouter;
