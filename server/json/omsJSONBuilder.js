// @ts-check

<<<<<<< HEAD
export default (data, keys = ['ID', 'ORD_NAME', 'PATIENT_NUM', 'COD', 'NAME', 'NUM_USL', 'PRICE_ONE', 'NUM_CI', 'TOTAL_PRICE']) => {
  const json = data.slice(1).reduce((acc, row) => {
=======
const keysByReport = {
  '/oms2': ['COD', 'NAME', 'PRICE', 'PRICE_D', 'USL', 'DAYS', 'NUM_DV', 'NUM_DOC', 'NUM_CI', 'TOTAL_PRICE', 'DATE', 'TYPE'],
  '/oms3': ['ID', 'ORD_NAME', 'PATIENT_NUM', 'COD', 'NAME', 'NUM_USL', 'NUM_CI', 'TOTAL_PRICE', 'DATE'],
};

export default (data, report) => {
  const json = data.slice(1).reduce((acc, row) => {
    const keys = keysByReport[report]
>>>>>>> 871a933f8cda60d1af0fee56a97d3e800080761d
    const obj = {};
    row.forEach((item, i) => {
      obj[keys[i]] = item;
    });
    acc.push(obj);
    return acc;
  }, []);
  return JSON.stringify(json);
};
