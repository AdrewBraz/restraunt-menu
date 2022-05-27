// @ts-check
import fs from 'fs';
import multer from 'fastify-multer';
import path from 'path';
import getDates from '../controller/datesController';
import deleteData from '../controller/deleteController';
import storeData from '../controller/storeController';
import parser from './excel/parser';
import json from './json';
import getParams from './getParams'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${path.join(__dirname, '../uploads')}`);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage });

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
      const { omsModel } = getParams(report);
      await deleteData(dates, reply, omsModel)
    })
    .post('/parse',
      { preHandler: upload.single('excel') },
      async (_req, reply) => {
        const { date, report } = _req.body;
        const { keyList, parserParams, omsController, omsModel, sheet } = getParams(report)
        const registeredDates = (await getDates(omsModel)).map((item) => item.getTime());
        if (registeredDates.includes(new Date(date).getTime())) {
          reply.code(500).send('Отчет за этот период времени уже внесен в базу');
          return reply;
        }
        const { path } = _req.file;
        const data = await parser(path, parserParams, sheet, report);
        fs.unlink(_req.file.path, (err) => {
          if (err) throw err;
          console.log(`${path} file was deleted`);
        });
        const result = await json(data, report, keyList);
        await storeData(result, reply, omsModel, date, omsController.parser);
      })
    .get('/report', async (_req, reply) => {
      console.log(_req)
      const { from, to, report } = _req.query;
      const { omsController, omsModel } = getParams(report)
      const { getData } = omsController;
      console.log(report)
      await getData({from, to}, reply, omsModel)
    })
  return router;
};
