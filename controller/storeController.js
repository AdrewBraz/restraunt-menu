// @ts-check
export default async (data, reply, model, date = '2018-01-01', func) => {
  const finalData = func ? func(data) : JSON.parse(data)
  console.log(finalData)
    finalData.forEach(async (el) => {
        console.log(el)
      const newItem = new model({
        ...el,
        DATE: date,
      });
      await newItem.save();
    });
    await reply.send({ message: 'Отчет успешно добавлен в базу', status: true });
  };