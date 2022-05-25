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

export default async (data, report, reportKeys) => {
  const keys = report === '/oms1' ?  data[0] : reportKeys;
  const dataByReport = report === '/oms1' ? data.slice(1) : data
  const json = dataByReport.reduce((acc, row) => {
    console.log(report)
    const obj = {};
    row.forEach((item, i) => {
      if(report === '/oms1'){
        addtoObject(obj, keys[i], item)
      } else {
      console.log('MAKE ITEM')
      obj[keys[i]] = item
      }
    });
    acc.push(obj);
    return acc;
  }, []);
  return JSON.stringify(json);
};
