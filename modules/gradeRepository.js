import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const databaseGrades = './data/grades.json';

const saveGrades = async value => {
  await writeFile(databaseGrades, JSON.stringify(value));
};

const readGrades = async () => {
  return JSON.parse(await readFile(databaseGrades));
};

/*
1. Crie um endpoint para criar uma grade. Este endpoint deverá receber como parâmetros
os campos student, subject, type e value conforme descritos acima. Esta grade deverá ser
salva no arquivo json grades.json, e deverá ter um id único associado. No campo
timestamp deverá ser salvo a data e hora do momento da inserção. O endpoint deverá
retornar o objeto da grade que foi criada. A API deverá garantir o incremento automático
deste identificador, de forma que ele não se repita entre os registros. Dentro do arquivo
grades.json que foi fornecido para utilização no desafio o campo nextId já está com um
valor definido. Após a inserção é preciso que esse nextId seja incrementado e salvo no
próprio arquivo, de forma que na próxima inserção ele possa ser utilizado.
*/
const validarObjeto = obj => {
  return !obj.student || !obj.subject || !obj.type || obj.value == null;
};

export const insertGrade = async obj => {
  try {
    if (validarObjeto(obj)) {
      throw new Error(
        'Os campos student, subject, type e value são obrigatórios'
      );
    }

    const data = await readGrades();
    const newData = {
      id: data.nextId++, //usa e depois incrementa
      student: obj.student,
      type: obj.type,
      value: obj.value,
      timestamp: new Date(),
    };

    data.grades.push(newData);
    await saveGrades(data);
    return newData;
  } catch (err) {
    return { error: err.message };
  }
};

/*
2. Crie um endpoint para atualizar uma grade. Este endpoint deverá receber como
parâmetros o id da grade a ser alterada e os campos student, subject, type e value. O
endpoint deverá validar se a grade informada existe, caso não exista deverá retornar um
erro. Caso exista, o endpoint deverá atualizar as informações recebidas por parâmetros
no registro, e realizar sua atualização com os novos dados alterados no arquivo
grades.json.
*/
export const updateGrade = async obj => {
  try {
    if (!obj.id || validarObjeto(obj)) {
      throw new Error(
        'Os campos id, student, subject, type e value são obrigatórios.'
      );
    }
    const data = await readGrades();
    const index = data.grades.findIndex(a => a.id === parseInt(obj.id));

    if (index <= 0) {
      throw new Error(`Registro com id ${obj.id} não encontrado.`);
    }

    obj.timestamp = new Date();
    data.grades[index] = obj;
    await saveGrades(data);
    return data.grades[index];
  } catch (err) {
    return { error: err.message };
  }
};

/*
3. Crie um endpoint para excluir uma grade. Este endpoint deverá receber como
parâmetro o id da grade e realizar sua exclusão do arquivo grades.json.
*/
export const deleteGrade = async id => {
  try {
    const data = await readGrades();
    data.grades = data.grades.filter(a => a.id !== parseInt(id));
    await saveGrades(data);
    return true;
  } catch (err) {
    return { error: err.message };
  }
};

/*
4. Crie um endpoint para consultar uma grade em específico. Este endpoint deverá
receber como parâmetro o id da grade e retornar suas informações.
*/
export const getGrades = async () => {
  try {
    const data = await readGrades();
    delete data.nextId;
    return data;
  } catch (err) {
    return { error: err.message };
  }
};

export const getGradeById = async id => {
  try {
    const data = await getGrades();
    const result = data.grades.find(a => a.id === parseInt(id));
    if (result) return result;
    else return {};
  } catch (err) {
    return { error: err.message };
  }
};

/*
5. Crie um endpoint para consultar a nota total de um aluno em uma disciplina. O
endpoint deverá receber como parâmetro o student e o subject, e realizar a soma de
todas os as notas de atividades correspondentes a aquele subject para aquele student. O
endpoint deverá retornar a soma da propriedade value dos registros encontrados.
*/
export const getGradeByStudentAndSubject = async (student, subject) => {
  try {
    if (!student || !subject) {
      throw new Error('Os campos student e subject são obrigatórios');
    }

    const data = await getGrades();
    const result = data.grades.filter(
      g => g.student === student && g.subject === subject
    );

    const total = result.reduce((acc, curr) => {
      return acc + curr.value;
    }, 0);

    return { value: total };
  } catch (err) {
    return { error: err.message };
  }
};

/*
6. Crie um endpoint para consultar a média das grades de determinado subject e type. O
endpoint deverá receber como parâmetro um subject e um type, e retornar a média. A
média é calculada somando o registro value de todos os registros que possuem o subject
e type informados, e dividindo pelo total de registros que possuem este mesmo subject e
type.
*/
const getBySubjectAndType = async (subject, type) => {
  if (!subject || !type) {
    throw new Error('Os campos subject e type são obrigatórios');
  }

  const data = await getGrades();
  const result = data.grades.filter(
    g => g.subject === subject && g.type === type
  );

  return result;
};

export const getAverage = async (subject, type) => {
  try {
    const data = await getBySubjectAndType(subject, type);

    const media =
      data.reduce((acc, curr) => {
        return acc + curr.value;
      }, 0) / data.length;

    return { value: media };
  } catch (err) {
    return { error: err.message };
  }
};

/*
7. Crie um endpoint para retornar as três melhores grades de acordo com determinado
subject e type. O endpoint deve receber como parâmetro um subject e um type retornar
um array com os três registros de maior value daquele subject e type. A ordem deve ser
do maior para o menor.
*/

export const getBestGrades = async (subject, type) => {
  try {
    const data = await getBySubjectAndType(subject, type);
    const arraySort = data.sort((a, b) => b.value - a.value);
    const arrayResult = [];

    for (
      let index = 0;
      index < (arraySort.length > 3 ? 3 : arraySort.length);
      index++
    ) {
      arrayResult.push(arraySort[index]);
    }

    return arrayResult;
  } catch (err) {
    return { error: err.message };
  }
};
