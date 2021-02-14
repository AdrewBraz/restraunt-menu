// @ts-check
import fs from 'fs';
import multer from 'fastify-multer';
import path from 'path';
import controller from '../controller';
import model from '../models'
import parser from './excel/parser';

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
  oms2: ['1', 'Итого:'],
  oms3: ['Филиал', 'ВСЕГО'],
  oms1: [' - По плательщику и профилю', 'Всего'],
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
    .post('/parse',
      { preHandler: upload.single('excel') },
      async (_req, reply) => {
        const { date, report } = _req.body;
        const parserParams = params[report];
        const { path } = _req.file;
        const sheet = report === 'oms3' ? 'ОМС-3' : 'Sheet0';
        const data = await parser(path, parserParams, sheet);
        fs.unlink(_req.file.path, (err) => {
          if (err) throw err;
          console.log(`${path} file was deleted`);
        });
        // const result = oms1Parser(data)
        // await storeData(data, reply, date)
        await reply.send({ data });
      });
  ['/oms1', '/oms2', '/oms3'].forEach((route) => {
    router.post(route, async (_req, reply) => {
      const omsController = controller[_req.url];
      const omsModel = model[_req.url]
      const { getData } = omsController
      await getData(_req, reply, omsModel);
    });
  });
  return router;
};
