import { Router } from 'express';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';
import { SendMailController } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();

const sendMailController = new SendMailController();

const answerController = new AnswerController();

const npsController = new NpsController();

router.post("/users", userController.create);
router.get("/users", userController.show);
router.delete("/users", userController.delete);

router.get("/unsubscribe/:value", userController.unsubscribe);

router.post("/surveys", surveysController.create);
router.get("/surveys/all", surveysController.showAll);
router.get("/surveys", surveysController.show);
router.delete("/surveys", surveysController.delete);

router.post("/sendmail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

export { router };
