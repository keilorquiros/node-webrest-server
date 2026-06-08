import {
  describe,
  test,
  expect,
  jest,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import { testServer } from "../../test-server";
import { prisma } from "../../../src/data/postgres";
import { createHash } from "node:crypto";

describe("routes.test.ts", () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    await testServer.close();
  });

  const todo1 = { text: "Todo 1" };
  const todo2 = { text: "Todo 2" };

  test("should return TODOs api/todos", async () => {
    await prisma.todo.create({ data: todo1 });
    await prisma.todo.create({ data: todo2 });

    const { body } = await request(testServer.app)
      .get("/api/todos")
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
    expect(body[0].completedAt).toBeNull();
    expect(body[0].isCompleted).toBe(false);
  });

  test("should return a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .get("/api/todos/" + todo.id)
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        id: todo.id,
        text: todo1.text,
        isCompleted: todo.isCompleted,
        completedAt: todo.completedAt,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  test('should return a "Todo not found" api/todos/:id', async () => {
    const id = 1;
    const { body } = await request(testServer.app)
      .get("/api/todos/" + id)
      .expect(404);

    expect(body).toEqual({ error: "Todo with id " + id + " not found" });
  });

  test("should return a new TODO api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send(todo1)
      .expect(201);

    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        text: todo1.text,
        isCompleted: false,
        completedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  test('should return a "Text is required" api/todos', async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({ text: "" })
      .expect(400);

    expect(body).toEqual({ error: "Text is required" });
  });

  test("should return a updated TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put("/api/todos/" + todo.id)
      .send({ text: "Todo 1 updated", isCompleted: true })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: "Todo 1 updated",
      isCompleted: true,
      completedAt: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('update - should return a "Todo not found" api/todos/:id', async () => {
    const { body } = await request(testServer.app)
      .put("/api/todos/1")
      .send({ text: "Todo 1 updated", isCompleted: true })
      .expect(404);

    expect(body).toEqual({ error: "Todo with id 1 not found" });
  });

  test("should update only isCompleted api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
      .put("/api/todos/" + todo.id)
      .send({ isCompleted: true })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo1.text,
      isCompleted: true,
      completedAt: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test("should return a erorr if isCompleted is not a boolean api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
      .put("/api/todos/" + todo.id)
      .send({ isCompleted: "trues" })
      .expect(400);

    expect(body).toEqual({ error: "isCompleted must be a boolean" });
  });

  test('should return a "Todo is already completed" and "Todo is already not completed" api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body: body1 } = await request(testServer.app)
      .put("/api/todos/" + todo.id)
      .send({ isCompleted: false })
      .expect(400);

    await request(testServer.app)
      .put("/api/todos/" + todo.id)
      .send({ isCompleted: true })
      .expect(200);

    const { body: body2 } = await request(testServer.app)
      .put("/api/todos/" + todo.id)
      .send({ isCompleted: true })
      .expect(400);

    expect(body1).toEqual({ error: "Todo is already not completed" });
    expect(body2).toEqual({ error: "Todo is already completed" });
  });

  test('should return a "Nothing to update" api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
      .put("/api/todos/" + todo.id)
      .send({})
      .expect(400);

    expect(body).toEqual({ error: "Nothing to update" });
  });

  test("should delete a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .delete("/api/todos/" + todo.id)
      .expect(200);

    expect(body).toEqual({
      deletedTodo: {
        id: todo.id,
        text: todo1.text,
        isCompleted: expect.any(Boolean),
        completedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      message: "Todo deleted",
    });
  });

  test('should return a "Todo not found" api/todos/:id', async () => {
    const id = 1;
    const { body } = await request(testServer.app)
      .delete("/api/todos/" + id)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${id} not found` });
  });
});
