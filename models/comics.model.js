const db = require("../db/connection");

exports.selectComics = (
  sort_by = "episode",
  order = "DESC",
  limit = 10,
  p
) => {
  const validSortBy = [
    "episode",
    "comic_id",
    "created_at",
    "likes",
    "comment_count",
  ];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let sqlQuery = `SELECT comics.author, comics.episode, comics.comic_id, comics.created_at, comics.likes, COUNT(comments.comment_id)::INT AS comment_count
      FROM comics
      LEFT JOIN comments
      ON comics.comic_id = comments.comic_id `;
  const queryValues = [];
  sqlQuery += `GROUP BY comics.comic_id `;
  if (sort_by) {
    sqlQuery += `ORDER BY ${sort_by} `;
  }
  if (order) {
    sqlQuery += `${order} `;
  }
  if (limit) {
    sqlQuery += `LIMIT ${limit} `;
  }
  if (p) {
    sqlQuery += `OFFSET (${p}-1) * ${limit} `;
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectComicById = (comic_id) => {
  return db
    .query(
      `SELECT comics.author, comics.episode, comics.comic_id, comics.created_at, comics.likes, COUNT(comments.comment_id)::INT AS comment_count
      FROM comics
      LEFT JOIN comments
      ON comics.comic_id = comments.comic_id WHERE comics.comic_id = $1 GROUP BY comics.comic_id;`,
      [comic_id],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return rows[0];
    });
};

exports.changeLikes = (newLikes, comic_id) => {
  const alteredLikes = newLikes.inc_likes;
  return db
    .query(
      `UPDATE comics
      SET likes = likes + $1
      WHERE comic_id = $2
      RETURNING *;`,
      [alteredLikes, comic_id],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return rows[0];
    });
};

exports.addComic = (newComic) => {
  const { author, episode } = newComic;
  return db
    .query(
      `INSERT INTO comics (author, episode)
      VALUES ($1, $2)
      RETURNING *;`,
      [author, episode],
    )
    .then(({ rows: [{ comic_id }] }) => {
      return comic_id;
    });
};

exports.removeComic = (comic_id) => {
  return db.query(
    `DELETE FROM comics
      WHERE comic_id = $1`,
    [comic_id],
  );
};

exports.checkComicExists = (comic_id) => {
  return db
    .query(`SELECT * FROM comics WHERE comic_id = $1`, [comic_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};

exports.totalComicCount = (sort_by = "created_at", order = "DESC") => {
  let sqlQuery = `SELECT comics.author, comics.episode, comics.comic_id, comics.created_at, comics.likes,COUNT(comments.comment_id)::INT AS comment_count, COUNT(comics.comic_id)::INT AS total_count
      FROM comics
      LEFT JOIN comments
      ON comics.comic_id = comments.comic_id `;
  const queryValues = [];
  sqlQuery += `GROUP BY comics.comic_id `;
  if (sort_by) {
    sqlQuery += `ORDER BY ${sort_by} `;
  }
  if (order) {
    sqlQuery += `${order} `;
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows.length;
  });
};
