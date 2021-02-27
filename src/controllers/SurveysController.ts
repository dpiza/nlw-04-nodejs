import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
    async create(request: Request, response: Response) {
        const { name, title, description } = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = surveysRepository.create({
            name,
            title,
            description
        });

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    async showAll(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);

        const all = await surveysRepository.find();

        return response.json(all);
    }

    async show(request: Request, response: Response) {
        const { name } = request.body;
        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = await surveysRepository.findOne({
            name
        });

        if (!survey) {
            throw new AppError("Survey does not exist!", 404);
        }

        return response.json(survey);
    }

    async delete(request: Request, response: Response) {
        const { name } = request.body;
        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = await surveysRepository.findOne({
            name
        });

        if (!survey) {
            throw new AppError("Survey does not exist!", 404);
        }

        const del = await surveysRepository.remove(survey);
        return response.json(survey);
    }

}

export { SurveysController }