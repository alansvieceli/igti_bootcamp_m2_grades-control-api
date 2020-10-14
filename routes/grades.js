import express from 'express';
import { logger } from '../modules/log.js';
import { getGrades, selectGradeById } from '../modules/gradeRepository.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const data = await getGrades();

  if (data.error) {
    next(data.error);
  } else {
    res.send(data);
  }
});

router.get('/:id', async (req, res, next) => {
  const data = await selectGradeById(req.params.id);

  if (data.error) {
    next(data.error);
  } else {
    res.send(data);
  }
});

//tratamento de todos os erros q derem acima, e usaram
router.use((err, req, res, next) => {
  logger.error(`${req.method} - ${req.baseUrl}`);
  logger.error(err);
  res.status(400).send({ error: err });
});

export default router;
