// @ts-check

export default (data, keys = ['ID', 'ORD_NAME', 'PATIENT_NUM', 'COD', 'NAME', 'NUM_USL', 'PRICE_ONE', 'NUM_CI', 'TOTAL_PRICE']) => {
  const json = data.slice(1).reduce((acc, row) => {
    const obj = {};
    row.forEach((item, i) => {
      obj[keys[i]] = item;
    });
    acc.push(obj);
    return acc;
  }, []);
  return JSON.stringify(json);
};
