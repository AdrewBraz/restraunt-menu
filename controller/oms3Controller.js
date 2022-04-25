// @ts-check
import excelController from '../server/excel/excel';

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

const parser = (data) => {
  const result = JSON.parse(data).map((item) => {
    if (typeof item.COD === 'string') {
      item.COD = parseInt(item.COD.replace(/^0*/, ''));
    }
    item.TOTAL_PRICE = item.TOTAL_PRICE.toString().replace(/\s+/g, '');
    item.PRICE_ONE = item.PRICE_ONE.toString().replace(/\s+/g, '');
    item.ORD_NAME = item.ORD_NAME.toUpperCase();
    return item
  });
  return result
}


const oms3Controller = {
  getData,
  parser
};

export default oms3Controller;
