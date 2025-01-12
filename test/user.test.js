(async () => {
  const chai = await import("chai");
  const chaiHttp = await import("chai-http");
  const app = require("../app.js"); // CommonJS import for your app
  const should = chai.should();

  chai.use(chaiHttp);

  describe("Users", () => {
    before((done) => {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../models/users.json");
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2), "utf8");
      done();
    });

    describe("/POST user", () => {
      it("it should add a user", (done) => {
        const user = {
          email: "test@example.com",
          age: 30,
        };
        chai
          .request(app)
          .post("/api/users")
          .send(user)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("User added successfully");
            done();
          });
      });

      it("it should not add a user without email", (done) => {
        const user = {
          age: 30,
        };
        chai
          .request(app)
          .post("/api/users")
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have
              .property("error")
              .eql("Email and age are required");
            done();
          });
      });

      it("it should not add a user without age", (done) => {
        const user = {
          email: "test@example.com",
        };
        chai
          .request(app)
          .post("/api/users")
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have
              .property("error")
              .eql("Email and age are required");
            done();
          });
      });

      it("it should not add a user that already exists", (done) => {
        const user = {
          email: "test@example.com",
          age: 30,
        };
        chai
          .request(app)
          .post("/api/users")
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("error").eql("User already exists");
            done();
          });
      });
    });

    describe("/GET user", () => {
      it("it should GET a user", (done) => {
        chai
          .request(app)
          .get("/api/users/test@example.com")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("email").eql("test@example.com");
            res.body.should.have.property("age").eql(30);
            done();
          });
      });

      it("it should not GET a user that does not exist", (done) => {
        chai
          .request(app)
          .get("/api/users/nonexistent@example.com")
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object");
            res.body.should.have.property("error").eql("User not found");
            done();
          });
      });
    });

    describe("/PUT user", () => {
      it("it should UPDATE a user", (done) => {
        const user = {
          age: 31,
        };
        chai
          .request(app)
          .put("/api/users/test@example.com")
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("User updated successfully");
            done();
          });
      });

      it("it should not UPDATE a user that does not exist", (done) => {
        const user = {
          age: 31,
        };
        chai
          .request(app)
          .put("/api/users/nonexistent@example.com")
          .send(user)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object");
            res.body.should.have.property("error").eql("User not found");
            done();
          });
      });

      it("it should not UPDATE a user without age", (done) => {
        const user = {};
        chai
          .request(app)
          .put("/api/users/test@example.com")
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("error").eql("Age is required");
            done();
          });
      });
    });

    describe("/DELETE user", () => {
      it("it should DELETE a user", (done) => {
        chai
          .request(app)
          .delete("/api/users/test@example.com")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("User deleted successfully");
            done();
          });
      });

      it("it should not DELETE a user that does not exist", (done) => {
        chai
          .request(app)
          .delete("/api/users/nonexistent@example.com")
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object");
            res.body.should.have.property("error").eql("User not found");
            done();
          });
      });
    });
  });
})();
