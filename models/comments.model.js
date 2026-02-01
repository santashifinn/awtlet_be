const db = require("../db/connection");

exports.selectCommentsByComic = (comic_id, limit = 10, p) => {
  let sqlQuery = `SELECT * FROM comments
      WHERE comments.comic_id = ${comic_id}
      ORDER BY created_at DESC `;
  if (limit) {
    sqlQuery += `LIMIT ${limit} `;
  }
  if (p) {
    sqlQuery += `OFFSET (${p}-1) * ${limit} `;
  }
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.insertComment = (comment, comic_id) => {
  const { author, body } = comment;
  return db
    .query(
      `INSERT INTO comments (author, body, comic_id) VALUES ($1, $2, $3) RETURNING *;`,
      [author, body, comic_id],
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments
      WHERE comment_id = $1`,
    [comment_id]
  );
};

exports.changeCommentLikes = (newLikes, comment_id) => {
  const alteredLikes = newLikes.inc_likes;
  return db
    .query(
      `UPDATE comments
      SET likes = likes + $1
      WHERE comment_id = $2
      RETURNING *;`,
      [alteredLikes, comment_id]
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

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};

exports.totalCommentCount = (comic_id) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE comments.comic_id = $1;`,
      [comic_id],
    )
    .then(({ rows }) => {
      return rows.length;
    });
};
