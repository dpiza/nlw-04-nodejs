import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);

        const all = await surveysRepository.find();

        return response.json(all);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.body;
        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = await surveysRepository.find({
            id
        });

        if (survey.length == 0) {
            throw new AppError("Survey does not exist!", 404);
        }

        const del = await surveysRepository.remove(survey);
        return response.json(survey);
    }

}

export { SurveysController }