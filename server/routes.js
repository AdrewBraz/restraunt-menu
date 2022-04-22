// @ts-check
import fs from 'fs';
import multer from 'fastify-multer';
import path from 'path';
import controller from '../controller';
import model from '../models';
import parser from './excel/parser';
import json from './json';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${path.join(__dirname, '../uploads')}`);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage });

const params = {
  '/oms2': ['1', 'Итого:'],
  '/oms3': ['Филиал', 'ВСЕГО'],
  '/oms1': [' - По плательщику и профилю', 'Всего'],
};

const keys = {
  '/oms3': ['ID', 'ORD_NAME', 'PATIENT_NUM', 'COD', 'NAME', 'NUM_USL', 'PRICE_ONE', 'NUM_CI', 'TOTAL_PRICE'],
  '/oms2': ['COD', 'NAME', 'PRICE', 'PRICE_D', 'USL', 'DAYS', 'NUM_DV', 'NUM_DOC', 'NUM_CI', 'TOTAL_PRICE', 'DATE', 'TYPE'],
};

export default (router) => {
  router
    .get('/', (_req, reply) => {
      reply.view('index.pug');
    })
    .get('/download', async (_req, reply) => {
      const file = fs.readFileSync(`${__dirname}/export.xlsx`);
      const stat = fs.statSync(`${__dirname}/export.xlsx`);
      reply.header('Content-Length', stat.size);
      reply.header('Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      reply.header('Content-Disposition', 'attachment; filename=export.xlsx');
      reply.send(file);
    })
    .get('/*', (_req, reply) => {
      reply.redirect('/');
    })
    .post('/delete_data',
    { preHandler: upload.single('excel') },
     async (_req, reply) => {
      const { dateFrom, dateTo, report } = _req.body;
      const dates = {
        from: dateFrom,
        to: dateTo
      }
      const omsController = controller[report];
      const omsModel = model[report];
      await omsController.deleteData(dates, reply, omsModel)
    })
    .post('/parse',
      { preHandler: upload.single('excel') },
      async (_req, reply) => {
        console.log(_req.body)
        const { date, report } = _req.body;
        const omsController = controller[report];
        const omsModel = model[report];
        const jsonBuilder = json(report);
        const registeredDates = (await omsController.getDates(omsModel)).map((item) => item.getTime());
        if (registeredDates.includes(new Date(date).getTime())) {
          reply.code(500);
          reply.send('Отчет за этот период времени уже внесен в базу');
          return reply;
        }
        const parserParams = params[report];
        const { path } = _req.file;
        const sheet = report === '/oms3' ? 'ОМС-3' : 'Sheet0';
        const data = await parser(path, parserParams, sheet);
        console.log(data)
        fs.unlink(_req.file.path, (err) => {
          if (err) throw err;
          console.log(`${path} file was deleted`);
        });
        const keyList = keys[report];
        const result = report === '/oms1' ? await jsonBuilder(data) : jsonBuilder(data, keyList);
        await omsController.storeData(result, reply, omsModel, date);
      })
    .get('/report', async (_req, reply) => {
      const { from, to, report } = _req.query;
      console.log(from, to, report)
      const omsController = controller[report];
      const omsModel = model[report];
      const { getData, deleteData } = omsController;
      await getData({from, to}, reply, omsModel)
    })
  // ['/oms1', '/oms2', '/oms3'].forEach((route) => {
  //   router.post(route, async (_req, reply) => {
  //     const omsController = controller[_req.url];
  //     const omsModel = model[_req.url];
  //     const { getData } = omsController;
  //     await getData(_req, reply, omsModel);
  //   });
  // });
  return router;
};
