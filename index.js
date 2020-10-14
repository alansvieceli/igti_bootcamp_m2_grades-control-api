import express from 'express';
import cors from 'cors';
import { logger } from './modules/log.js';
import gradesRountes from './routes/grades.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); //Libera o cors
app.use('/grades', gradesRountes);

app.listen(port, () => {
  logger.info(`API iniciada ( http://localhost:${port})`);
});
