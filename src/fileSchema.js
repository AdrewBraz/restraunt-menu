// @ts-check
import * as Yup from 'yup';

export default Yup.object().shape({
  report: Yup.string().ensure().required(),
  month: Yup.string().ensure().required(),
  year: Yup.string().ensure().required(),
  excel: Yup.string().ensure().required(),
});
