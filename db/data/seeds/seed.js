const format = require("pg-format");
const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./utils");

const seed = ({ comicData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS comics;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comics (
        comic_id SERIAL PRIMARY KEY,
        episode INT NOT NULL,
        author VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        likes INT DEFAULT 0 NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        episode INT NOT NULL,
        author VARCHAR NOT NULL,
        body VARCHAR NOT NULL,
        comic_id INT REFERENCES comics(comic_id) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        likes INT DEFAULT 0 NOT NULL
      );`);
    })
    .then(() => {
      const formattedComicData = comicData.map(convertTimestampToDate);
      const insertComicsQueryStr = format(
        "INSERT INTO comics (episode, author, created_at, likes) VALUES %L RETURNING *;",
        formattedComicData.map(
          ({
            episode,
            author,
            created_at,
            likes = 0,
          }) => [
            episode,
            author,
            created_at,
            likes,
          ],
        ),
      );

      return db.query(insertComicsQueryStr);
    })
    .then(({ rows: comicRows }) => {
      const comicIdLookup = createRef(comicRows, "episode", "comic_id");
      const formattedCommentData = formatComments(commentData, comicIdLookup);

      const insertCommentsQueryStr = format(
        "INSERT INTO comments (episode, author, body, comic_id, created_at, likes) VALUES %L;",
        formattedCommentData.map(
          ({
            episode,
            author,
            body,
            comic_id,
            created_at,
            likes = 0,
          }) => [episode, body, author, comic_id, created_at, likes],
        ),
      );
      return db.query(insertCommentsQueryStr);
    });
};

module.exports = seed;
