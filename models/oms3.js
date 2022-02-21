// @ts-check
import mongoose from 'mongoose';

mongoose.set('debug', true);
const { Schema } = mongoose;

const oms3Schema = new Schema({
  ID: String,
  ORD_NAME: String,
  PATIENT_NUM: String,
  COD: String,
  NAME: String,
  NUM_USL: Number,
  NUM_CI: Number,
  TOTAL_PRICE: mongoose.Types.Decimal128,
  DATE: Date,
});

export default mongoose.model('OMS3', oms3Schema, 'oms3');
