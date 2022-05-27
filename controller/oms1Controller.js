// @ts-check
import excelController from '../server/excel/excel';

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

const oms1Controller = {
  getData,
};

export default oms1Controller;
