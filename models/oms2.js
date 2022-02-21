// @ts-check
import mongoose from 'mongoose';

mongoose.set('debug', true);
const { Schema } = mongoose;

const oms2Schema = new Schema({
  COD: String,
  NAME: String,
  PRICE: mongoose.Types.Decimal128,
  PRICE_D: mongoose.Types.Decimal128,
  USL: Number,
  DAYS: Number,
  NUM_DV: Number,
  NUM_DOC: Number,
  NUM_CI: Number,
  TOTAL_PRICE: mongoose.Types.Decimal128,
  DATE: Date,
  TYPE: String,
});

export default mongoose.model('OMS2', oms2Schema, 'oms2');
