import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

describe("User", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users")
            .send({
                email: "user@example.com",
                name: "User Example"
            });
        expect(response.status).toBe(201);
    });

    it("Should not be able to create a user if the email already exists", async () => {
        const response = await request(app).post("/users")
            .send({
                email: "user@example.com",
                name: "User Example"
            });
        expect(response.status).toBe(400);
    });

    it("Should be able to get all users", async () => {
        await request(app).post("/users")
            .send({
                email: "user1@example.com",
                name: "User1 Example"
            });
        const response = await request(app).get("/users")

        expect(response.body.length).toBe(2);
    });

    it("Should be able to delete a user", async () => {
        const response = await request(app).delete("/users")
            .send({
                email: "user@example.com",
            });
        expect(response.status).toBe(200);
    });

    it("Should not be able to delete a user if the email doesnt exists", async () => {
        const response = await request(app).delete("/users")
            .send({
                email: "user@example.com",
            });
        expect(response.status).toBe(404);
    })
});