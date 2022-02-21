export default async (model, date) => {
  const { from, to } = date;
  model.find({ DATE: { $gte: ISODate('2018-01-01'), $lte: ISODate('2018-02-01') } });
};
