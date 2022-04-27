// @ts-check
import * as Yup from 'yup';

export default Yup.object().shape({
  name: Yup.string().ensure().min(3, 'Логин должен быть не меньше 3 знаков').required(),
  password: Yup.string().ensure().min(6, 'Длинна пароля должна быть не меньше 6 знаков').required(),
});
