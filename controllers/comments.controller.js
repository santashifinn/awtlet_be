const {
  selectCommentsByComic,
  insertComment,
  checkCommentExists,
  removeComment,
  changeCommentLikes,
  totalCommentCount,
} = require("../models/comments.model");
const { checkComicExists } = require("../models/comics.model");

exports.getCommentsByComic = (req, res, next) => {
  const comic_id = req.params.comics_id;
  const limit = req.query.limit;
  const p = req.query.p;
  const promises = [
    selectCommentsByComic(comic_id, limit, p),
    totalCommentCount(comic_id),
  ];
  if (comic_id) {
    promises.push(checkComicExists(comic_id));
  }
  Promise.all(promises)
    .then(([comments, total_count]) => {
      return res.status(200).send({ comments, total_count });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const comic_id = req.params.comic_id;
  insertComment(newComment, comic_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [];
  if (comment_id) {
    promises.push(checkCommentExists(comment_id));
    promises.push(removeComment(comment_id));
  }
  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.updateCommentLikes = (req, res, next) => {
  const newLikes = req.body;
  const comment_id = req.params.comment_id;
  const promises = [changeCommentLikes(newLikes, comment_id)];
  if (comment_id) {
    promises.push(checkCommentExists(comment_id));
  }
  Promise.all(promises)
    .then(([comment]) => {
      return res.status(200).send({ comment });
    })
    .catch(next);
};
