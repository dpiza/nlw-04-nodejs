import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

describe("Survey", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it("Should be able to create a survey", async () => {
        const response = await request(app).post("/surveys")
            .send({
                name: "Name Example",
                title: "Title Example",
                description: "Description Example"
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys", async () => {
        await request(app).post("/surveys")
            .send({
                name: "Name Example2",
                title: "Title Example2",
                description: "Description Example2"
            });
        const response = await request(app).get("/surveys/all");

        expect(response.body.length).toBe(2);
    });

    it("Should be able to get a survey", async () => {
        const response = await request(app).get("/surveys")
            .send({
                name: "Name Example2",
            });

        expect(response.status).toBe(200);
    });

    it("Should not be able to get a survey if the name doesent exist", async () => {
        const response = await request(app).get("/surveys")
            .send({
                name: "Name Example3",
            });

        expect(response.status).toBe(404);
    });

    it("Should be able to delete a survey", async () => {
        const response = await request(app).delete("/surveys")
            .send({
                name: "Name Example2"
            });

        expect(response.status).toBe(200);
    });

    it("Should not be able to delete a survey if the name doesent exists", async () => {
        const response = await request(app).delete("/surveys")
            .send({
                name: "Name Example2"
            });

        expect(response.status).toBe(404);
    });
});