const {
  selectComics,
  selectComicById,
  changeLikes,
  checkComicExists,
  addComic,
  removeComic,
  totalComicCount,
} = require("../models/comics.model");

exports.getComics = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const limit = req.query.limit;
  const p = req.query.p;
  const promises = [
    selectComics(sort_by, order, limit, p),
    totalComicCount(sort_by, order),
  ];
  Promise.all(promises)
    .then(([comics, total_count]) => {
      return res.status(200).send({ comics, total_count });
    })
    .catch(next);
};

exports.getComicById = (req, res, next) => {
  const comic_id = req.params.comics_id;
  selectComicById(comic_id)
    .then((comic) => {
      return res.status(200).send({ comic });
    })
    .catch(next);
};

exports.updateLikes = (req, res, next) => {
  const newLikes = req.body;
  const comic_id = req.params.comic_id;
  const promises = [changeLikes(newLikes, comic_id)];
  if (comic_id) {
    promises.push(checkComicExists(comic_id));
  }
  Promise.all(promises)
    .then(([comic]) => {
      return res.status(200).send({ comic });
    })
    .catch(next);
};

exports.postComic = (req, res, next) => {
  const newComic = req.body;
  addComic(newComic)
    .then((comic_id) => {
      return selectComicById(comic_id).then((comic) => {
        res.status(201).send({ comic });
      });
    })
    .catch(next);
};

exports.deleteComic = (req, res, next) => {
  const { comic_id } = req.params;
  const promises = [];
  if (comic_id) {
    promises.push(checkComicExists(comic_id));
    promises.push(removeComic(comic_id));
  }
  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
