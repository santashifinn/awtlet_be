const { comicData, commentData } = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");

const app = require("../app");

beforeEach(() => seed({ comicData, commentData}));
afterAll(() => db.end());

describe("GET /api/comics", () => {
  test("200: Responds with an array of all comic objects, minus the body parameter, plus a comment_count parameter", () => {
    return request(app)
      .get("/api/comics")
      .expect(200)
      .then(({ body: { comics } }) => {
        expect(comics.length).toBe(100);
        comics.forEach((comic) => {
          expect(typeof comic.author).toBe("string");
          expect(typeof comic.comic_id).toBe("number");
          expect(typeof comic.created_at).toBe("string");
          expect(typeof comic.likes).toBe("number");
          expect(typeof comic.comment_count).toBe("number");
        });
      });
  });
//   test("200: Responds with an array in descending order of date created", () => {
//     return request(app)
//       .get("/api/comics")
//       .expect(200)
//       .then(({ body: { comics } }) => {
//         expect(comics).toBeSortedBy("created_at", {
//           descending: true,
//         });
//       });
//   });
});

describe("POST /api/comics/:comic_id/comments", () => {
  test("201: Inserts a new comment", () => {
    const newComment = {
      author: "Bob",
      body: "I want to say hey.",
    };
    return request(app)
      .post("/api/comics/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.body).toBe("I want to say hey.");
        expect(comment.comment_id).toBe(3);
        expect(comment.comic_id).toBe(4);
        expect(comment.author).toBe("Bob");
        expect(comment.likes).toBe(0);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("400: Responds with an error message when given an invalid comic id", () => {
    const newComment = {
      author: "icellusedkars",
      body: "I want to add something to this discussion.",
    };
    return request(app)
      .post("/api/comics/12345678/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given incomplete required data, ex. missing body", () => {
    const newComment = {
      author: "Bob",
    };
    return request(app)
      .post("/api/comics/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});