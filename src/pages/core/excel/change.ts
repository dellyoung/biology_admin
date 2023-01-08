import ExcelJS from 'exceljs';

const excel = async (list, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('My Sheet');
  worksheet.columns = [
    { header: 'name', key: 'name', width: 20 },
    { header: 'value', key: 'value', width: 20 },
  ];
  worksheet.addRows(list);
  // workbook.xlsx.writeFile(`/Users/yimingyang/tech/yijie/${fileName}.xlsx`);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  link.download = `${fileName}.xlsx`;
  link.target = 'blank';
  // blob --> url
  link.href = URL.createObjectURL(blob);
  link.click();
};

const getSameList = (list, filter) => {
  if (filter) {
    const newList = [...list].sort((a, b) => a.value - b.value);
    const abs1 = Math.abs(newList[1].value - newList[0].value);
    const abs2 = Math.abs(newList[3].value - newList[2].value);
    const value = abs1 > abs2 ? newList[0].value : newList[3].value;
    return list.filter((item) => item.value !== value);
  }
  return list;
};

const changeExcel = async ({ data, filter, fileName, beginLine }) => {
  const list = data
    .split('\n')
    .map((item) => item.split('\t'))
    .filter((item, index) => index > beginLine - 1 && item.length && item[0])
    .sort((a, b) => {
      const getVal = (val) => {
        return Number(val[2].slice(1));
      };
      return getVal(a) - getVal(b);
    });
  const newList = [];
  let itemList = [];
  list.forEach((item) => {
    if (item[2].indexOf('A') !== -1) {
      itemList = [];
      newList.push(itemList);
    }
    itemList.push(item);
  });
  const resultList = [];
  while (true) {
    newList.forEach((item) => {
      const nowList = [];
      const list = [0, 0, 0, 0];
      list.forEach((dd) => {
        const nowData = item.shift();
        nowList.push({
          name: nowData[2],
          value: Number(nowData[4].replace(/\s/g, '')),
        });
        console.log({
          name: nowData[2],
          value: Number(nowData[4].replace(/\s/g, '')),
        });
      });
      resultList.push(...getSameList(nowList, filter));
    });
    if (newList[newList.length - 1].length === 0) {
      break;
    }
  }
  await excel(resultList, fileName);
};

export { changeExcel };
