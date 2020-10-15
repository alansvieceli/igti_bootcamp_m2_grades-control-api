import express from 'express';
import { logger } from '../modules/log.js';
import {
  getGrades,
  getGradeById,
  insertGrade,
  updateGrade,
  deleteGrade,
  getGradeByStudentAndSubject,
  getAverage,
  getBestGrades,
} from '../modules/gradeRepository.js';

const router = express.Router();

const doExecuteReturnData = async (req, res, next, func, execEnd = false) => {
  const data = await func();
  if (data.error) {
    next(data.error);
  } else {
    if (execEnd) {
      res.end();
    } else {
      res.send(data);
    }
  }
};

router.get('/', async (req, res, next) => {
  await doExecuteReturnData(req, res, next, () => getGrades());
});

//http://localhost:3000/grades/nota?student=XX&subject=YY
router.get('/nota', async (req, res, next) => {
  await doExecuteReturnData(req, res, next, () =>
    getGradeByStudentAndSubject(req.query.student, req.query.subject)
  );
});

//http://localhost:3000/grades/media?subject=YY&type=XX
router.get('/media', async (req, res, next) => {
  await doExecuteReturnData(req, res, next, () =>
    getAverage(req.query.subject, req.query.type)
  );
});

router.get('/melhoresNotas', async (req, res, next) => {
  await doExecuteReturnData(req, res, next, () =>
    getBestGrades(req.query.subject, req.query.type)
  );
});

router.get('/:id', async (req, res, next) => {
  await doExecuteReturnData(req, res, next, () => getGradeById(req.params.id));
});

router.post('/', async (req, res, next) => {
  await doExecuteReturnData(req, res, next, () => insertGrade(req.body));
});

router.put('/', async (req, res, next) => {
  await doExecuteReturnData(req, res, next, () => updateGrade(req.body));
});

router.delete('/:id', async (req, res, next) => {
  await doExecuteReturnData(
    req,
    res,
    next,
    () => deleteGrade(req.params.id),
    true
  );
});

//tratamento de todos os erros q derem acima, e usaram
router.use((err, req, res, next) => {
  logger.error(`${req.method} - ${req.baseUrl}`);
  logger.error(err);
  res.status(400).send({ error: err });
});

export default router;
