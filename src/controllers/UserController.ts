import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        try {
            await schema.validate(request.body, { abortEarly: false })
        } catch (err) {
            throw new AppError(err);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if (userAlreadyExists) {
            throw new AppError("User already exists");
        }

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }

    async show(request: Request, response: Response) {
        const usersRepository = getCustomRepository(UsersRepository);
        const all = await usersRepository.find();

        return response.json(all);
    }

    async delete(request: Request, response: Response) {
        const { email } = request.body;
        const usersRepository = getCustomRepository(UsersRepository);
        const user = await usersRepository.findOne({
            email
        });

        if (!user) {
            throw new AppError("User does not exist!", 404);
        }

        await usersRepository.remove(user);
        return response.json(user);
    }

    async unsubscribe(request: Request, response: Response) {
        const { value } = request.params;

        const usersRepository = getCustomRepository(UsersRepository);
        const user = await usersRepository.findOne({
            email: String(value)
        });

        if (!user) {
            throw new AppError("User does not exist!", 404);
        }

        await usersRepository.remove(user);
        return response.json(user);
    }
}

export { UserController };