// @ts-check
import excelController from '../server/excel/excel';

const getDates = async (model) => {
  const coll = await model.find().distinct('DATE');
  return coll;
};

const getData = async (dates, reply, model) => {
  const { from, to } = dates;
  const coll = await model.aggregate([
    { $match: { DATE: { $gte: new Date(from), $lte: new Date(to) } } },
    {
      $group: {
        _id: { SMO_NAME: '$SMO_NAME', PROFILE: '$PROFILE' }, USL: { $sum: '$USL' }, MDSTAND: { $sum: '$MDSTAND' }, TOTAL_PRICE: { $sum: '$TOTAL_PRICE' },
      },
    },
    {
      $group: {
        _id: '$_id.SMO_NAME',
        smoName: {
          $push: {
            PROFILE: '$_id.PROFILE', USL: { $sum: '$USL' }, MDSTAND: { $sum: '$MDSTAND' }, TOTAL_PRICE: { $sum: '$TOTAL_PRICE' }
          }
        }
      }
    }
  ]);

  console.log(coll);

  await excelController({ from, to }, coll);
  reply.send(coll);
};

const storeData = async (data, reply, model, date = '2018-01-01') => {
  const Schema = model;
  JSON.parse(data).forEach(async (el) => {
    const newItem = new Schema({
      ...el,
      DATE: date,
    });
    await newItem.save();
  });

  await reply.send({ message: 'Отчет успешно добавлен в базу', status: true });
};

const oms1Controller = {
  getDates,
  getData,
  storeData,
};

export default oms1Controller;
