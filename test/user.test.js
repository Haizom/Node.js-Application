const request = require("supertest");
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
  // Test for adding a user
  test("POST /add_user should add a new user", async () => {
    const response = await request(app)
      .post("/add_user")
      .send({ email: "newuser@example.com", age: 30 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User added successfully");
  });

  // Test for retrieving a user
  test("GET /get_user/:email should return user information", async () => {
    const response = await request(app).get("/get_user/test@example.com");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ email: "test@example.com", age: 25 });
  });

  // Test for updating a user
  test("PUT /update_user/:email should update user information", async () => {
    const response = await request(app)
      .put("/update_user/test@example.com")
      .send({ age: 28 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
  });

  // Test for deleting a user
  test("DELETE /delete_user/:email should delete a user", async () => {
    const response = await request(app).delete("/delete_user/test@example.com");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  // Test for missing parameters
  test("POST /add_user should return 400 if parameters are missing", async () => {
    const response = await request(app).post("/add_user").send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email and age are required");
  });

  // Test for non-existent user
  test("GET /get_user/:email should return 404 for a non-existent user", async () => {
    const response = await request(app).get(
      "/get_user/nonexistent@example.com"
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });
});
