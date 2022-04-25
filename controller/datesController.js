// @ts-check

export default async (model) => {
  const coll = await model.find().distinct('DATE');
  return coll;
};
