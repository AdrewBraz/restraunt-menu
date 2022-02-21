import oms1JSONBuilder from './oms1JSONBuilder';
import omsJSONBuilder from './omsJSONBuilder';

const builders = {
  '/oms1': oms1JSONBuilder,
  '/oms2': omsJSONBuilder,
  '/oms3': omsJSONBuilder,
};

export default (path) => builders[path];
