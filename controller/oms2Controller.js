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
        _id: { COD: '$COD', NAME: '$NAME', TYPE: '$TYPE' }, USL: { $sum: '$USL' }, NUM_DV: { $sum: '$NUM_DV' }, NUM_DOC: { $sum: '$NUM_DOC' }, NUM_CI: { $sum: '$NUM_CI' }, TOTAL_PRICE: { $sum: '$TOTAL_PRICE' },
      },
    },
    {
      $addFields: {
        COD: { $toInt: '$_id.COD' }, NAME: '$_id.NAME', TYPE: '$_id.TYPE', TOTAL_PRICE: { $toString: '$TOTAL_PRICE' },
      },
    },
    { $sort: { COD: 1 } },
    {
      $project: {
        _id: 0, COD: '$COD', NAME: '$NAME', TYPE: '$_id.TYPE', USL: '$USL', NUM_DV: '$NUM_DV', NUM_DOC: '$NUM_DOC', NUM_CI: '$NUM_CI', TOTAL_PRICE: '$TOTAL_PRICE',
      },
    },
  ]);

  await excelController({ from, to }, coll);
  reply.send(coll);
};

const parser = (data) => {
  console.log(typeof data)
  console.log(data)
  try{console.log(JSON.parse(data))}catch(err){console.log(err)}
  const result = JSON.parse(data).map((item) => {
    console.log(item)
    item.COD = parseInt(item.COD.replace(/^0*/, ''));
    item.PRICE = item.PRICE.toString().replace(/\s+/g, '');
    item.PRICE_D = item.PRICE_D.toString().replace(/\s+/g, '');
    item.TOTAL_PRICE = item.TOTAL_PRICE.toString().replace(/\s+/g, '');
    item.TYPE = item.COD < 60000 ? 'AMB' : 'STAC';
    return item
  });
  console.log(result)
  return result
}

const oms2Controller = {
  getData,
  parser
};

export default oms2Controller;
