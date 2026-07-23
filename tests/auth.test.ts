import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";
describe("Auth flow", () => {
  const testUser = {
    email: "test-auth@example.com",
    password: "supersecret123",
    name: "Test User",
  };

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it("registers a new user and returns tokens", async () => {
    const res = await request(app).post("/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("rejects duplicate registration", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  it("blocks access to protected routes without a token", async () => {
    const res = await request(app).get("/subjects");
    expect(res.status).toBe(401);
  });
});
