const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  * ----[END of EXAMPLE TEST]----
  */

  suite("Routing tests", function() {
    let id_test;

    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/json")
            .send({ title: "title" })
            .end((err, res) => {
              id_test = res.body._id;
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "title");
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/json")
            .send({ title: "" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .set("content-type", "application/json")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/wrongid")
          .set("content-type", "application/json")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get(`/api/books/${id_test}`)
          .set("content-type", "application/json")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "title");
            assert.isString(res.body.title);
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post(`/api/books/${id_test}`)
            .set("content-type", "application/json")
            .send({ comment: "comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "comments");
              assert.equal(
                res.body.comments[res.body.comments.length - 1],
                "comment"
              );
              assert.property(res.body, "title");
              assert.isString(res.body.title);
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function(done) {
          chai
            .request(server)
            .post(`/api/books/${id_test}`)
            .set("content-type", "application/json")
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function(done) {
          chai
            .request(server)
            .get("/api/books/wrongid")
            .set("content-type", "application/json")
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function() {
      test("Test DELETE /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .delete(`/api/books/${id_test}`)
          .set("content-type", "application/json")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/wrongid")
          .set("content-type", "application/json")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
