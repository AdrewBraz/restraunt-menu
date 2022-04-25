// @ts-check
export default async (dates, reply, model) => {
  const { from, to } = dates;
  await model.find({ DATE: { $gte: new Date(from), $lte: new Date(to) } }).deleteMany().exec()
  await reply.send({ message: 'Документы удалены', status: true });
}
