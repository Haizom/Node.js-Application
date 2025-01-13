const request = require("supertest");
const http = require("http");
const app = require("../app"); // Import the app

jest.mock("../models/userModel", () => {
  const mockData = {
    "test@example.com": { email: "test@example.com", age: 25 },
  };

  return {
    readUsers: jest.fn(() => mockData),
    writeUsers: jest.fn((newData) => {
      Object.assign(mockData, newData);
    }),
  };
});

describe("User Routes", () => {
  let server;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done); // Start server
  });

  afterAll((done) => {
    server.close(() => {
      jest.clearAllMocks(); // Clear mocks
      done(); // Ensure all resources are cleaned up
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("POST /add_user should add a new user", async () => {
    const response = await request(server)
      .post("/add_user")
      .send({ email: "newuser@example.com", age: 30 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User added successfully");
  });

  test("GET /get_user/:email should return user information", async () => {
    const response = await request(server).get("/get_user/test@example.com");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ email: "test@example.com", age: 25 });
  });

  test("PUT /update_user/:email should update user information", async () => {
    const response = await request(server)
      .put("/update_user/test@example.com")
      .send({ age: 28 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
  });

  test("DELETE /delete_user/:email should delete a user", async () => {
    const response = await request(server).delete(
      "/delete_user/test@example.com"
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  test("POST /add_user should return 400 if parameters are missing", async () => {
    const response = await request(server)
      .post("/add_user")
      .send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email and age are required");
  });

  test("GET /get_user/:email should return 404 for a non-existent user", async () => {
    const response = await request(server).get(
      "/get_user/nonexistent@example.com"
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });
});
