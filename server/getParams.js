// @ts-check

import controller from '../controller';
import model from '../models';
const params = {
    '/oms2': ['1', 'Итого:'],
    '/oms3': ['Филиал', 'ВСЕГО'],
    '/oms1': [' - По плательщику и профилю', 'Всего'],
  };
  
const keys = {
  '/oms3': ['ID', 'ORD_NAME', 'PATIENT_NUM', 'COD', 'NAME', 'NUM_USL', 'PRICE_ONE', 'NUM_CI', 'TOTAL_PRICE'],
  '/oms2': ['COD', 'NAME', 'PRICE', 'PRICE_D', 'USL', 'DAYS', 'NUM_DV', 'NUM_DOC', 'NUM_CI', 'TOTAL_PRICE', 'DATE', 'TYPE'],
};

const sheets = {
    '/oms1': 'Sheet0',
    '/oms2': 'Sheet0',
    '/oms3': 'ОМС-3',
}

export default (report) => {
    const parserParams = params[report]
    const omsModel = model[report]
    const omsController = controller[report]
    const keyList = keys[report]
    const sheet = sheets[report]
    return { parserParams, omsModel, omsController, keyList, sheet }
}
  