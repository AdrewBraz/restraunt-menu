// @ts-check

import Excel from 'exceljs';

export default async (path, params = [], sheet) => {
  const workbook = new Excel.Workbook();
  const [start, end] = params;
  const filters = [start, end, 'Итого', ' ', null, undefined];
  const data = await workbook.xlsx.readFile(path)
    .then(() => {
      const worksheet = workbook.getWorksheet(sheet);
      const arr = [];
      let isNeeded = false;
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const el = row.values[1];
        if (el === start) {
          isNeeded = true;
        }
        if (el === end) {
          isNeeded = false;
        }
        isNeeded ? arr.push(row.values.slice(1)) : null;
      });
      return arr;
    })
    .catch((err) => {
      console.log(err);
    });
  const filteredData = data.filter((item) => !filters.includes(item[0]));
  console.log(filteredData);
  return filteredData;
};
