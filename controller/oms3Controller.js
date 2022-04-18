// @ts-check
import excelController from '../server/excel/excel';

const getDates = async (model) => {
  const coll = await model.find().distinct('DATE');
  return coll;
};

const getData = async (dates, reply, model) => {
  const { from, to } = dates;
  const coll1 = await model.aggregate([
    { $match: { DATE: { $gte: new Date(from), $lte: new Date(to) } } },
    {
      $group: {
        _id: { ORD_NAME: '$ORD_NAME', COD: '$COD', NAME: '$NAME' }, NUM_USL: { $sum: '$NUM_USL' }, NUM_CI: { $sum: '$NUM_CI' }, TOTAL_PRICE: { $sum: '$TOTAL_PRICE' },
      },
    },
    {
      $group: {
        _id: '$_id.ORD_NAME',
        codes: {
          $push: {
            ORD_NAME: '$_id.ORD_NAME', COD: { $toInt: '$_id.COD' }, NAME: '$_id.NAME', NUM_USL: { $sum: '$NUM_USL' }, NUM_CI: { $sum: '$NUM_CI' }, TOTAL_PRICE: { $toString: { $sum: '$TOTAL_PRICE' } },
          },
        },
      },
    },
  ]);

  const coll2 = await model.aggregate([
    { $match: { DATE: { $gte: new Date(from), $lte: new Date(to) } } },
    { $group: { _id: { ORD_NAME: '$ORD_NAME' }, PATIENT_NUM: { $sum: '$PATIENT_NUM' } } },
  ]);

  const data = coll1.reduce((acc, department) => {
    console.log(department._id);
    department.codes.forEach((item) => {
      acc.push(item);
    });
    return acc;
  }, []);

  await excelController({ from, to }, data);

  reply.send(data);
};

const storeData = async (data, reply, model, date = '2018-01-01') => {
  const jsonData = JSON.parse(data);
  jsonData.forEach((item) => {
    if (typeof item.COD === 'string') {
      item.COD = parseInt(item.COD.replace(/^0*/, ''));
    }
    item.TOTAL_PRICE = item.TOTAL_PRICE.toString().replace(/\s+/g, '');
    item.PRICE_ONE = item.PRICE_ONE.toString().replace(/\s+/g, '');
    item.ORD_NAME = item.ORD_NAME.toUpperCase();
  });

  jsonData.forEach(async (el) => {
    const newItem = new model({
      ID: el.ID,
      ORD_NAME: el.ORD_NAME,
      PATIENT_NUM: el.PATIENT_NUM,
      COD: el.COD,
      NAME: el.NAME,
      NUM_USL: el.NUM_USL,
      PRICE_ONE: el.PRICE_ONE,
      NUM_CI: el.NUM_CI,
      TOTAL_PRICE: el.TOTAL_PRICE,
      DATE: date,
    });
    await newItem.save();
  });
  await reply.send({ message: 'Отчет успешно добавлен в базу', status: true });
};

const oms3Controller = {
  getDates,
  getData,
  storeData,
};

export default oms3Controller;
