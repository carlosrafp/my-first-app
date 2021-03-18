import * as yup from 'yup';

export default yup.object().shape({
  title: yup.string().required('Campo Obrigatório'),
  url: yup.string().url('URL tem que ser válida').required('Campo Obrigatório'),
  imageUrl: yup
    .string()
    .url('URL tem que ser válida')
    .required('Campo Obrigatório'),
  price: yup.number().required('Campo Obrigatório'),
});
