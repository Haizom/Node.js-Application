import chai from "chai";
import chaiHttp from "chai-http";
import server from "../app.js"; // Adjust the path as necessary
const should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {
  before((done) => {
    // Clear the users.json file before running tests
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(__dirname, "../models/users.json");
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2), "utf8");
    done();
  });

  describe("/POST user", () => {
    it("it should add a user", (done) => {
      let user = {
        email: "test@example.com",
        age: 30,
      };
      chai
        .request(server)
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
      let user = {
        age: 30,
      };
      chai
        .request(server)
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
      let user = {
        email: "test@example.com",
      };
      chai
        .request(server)
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
      let user = {
        email: "test@example.com",
        age: 30,
      };
      chai
        .request(server)
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
        .request(server)
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
        .request(server)
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
      let user = {
        age: 31,
      };
      chai
        .request(server)
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
      let user = {
        age: 31,
      };
      chai
        .request(server)
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
      let user = {};
      chai
        .request(server)
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
        .request(server)
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
        .request(server)
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
