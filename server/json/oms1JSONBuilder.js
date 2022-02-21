// @ts-check

const addtoObject = (obj, field, item) => {
  switch (field) {
    case 'Наименование':
      obj.SMO_NAME = item.replace(/"([^"]+(?="))"/g, '$1');
      break;
    case 'Профиль':
      obj.PROFILE = item;
      break;
    case 'МС':
      obj.MDSTAND = item;
      break;
    case 'Усл':
      obj.USL = item;
      break;
    case 'Сумма':
      obj.TOTAL_PRICE = item.toString().replace(/\s+/g, '').replace(/[,]/g, '.');
      break;
    default:
  }
};

export default async (data) => {
  const keys = data[0];
  const json = data.slice(1).reduce((acc, row) => {
    const obj = {};
    row.forEach((item, i) => {
      addtoObject(obj, keys[i], item);
    });
    acc.push(obj);
    return acc;
  }, []);
  return JSON.stringify(json);
};
