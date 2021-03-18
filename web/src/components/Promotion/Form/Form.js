import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import FormField from 'components/Form/Field';
import useAPI from 'components/utils/useAPI';
import UIButton from 'components/UI/Button/Button';
import schema from './schema';
import './Form.css';

const initialValue = {
  title: '',
  url: '',
  imageUrl: '',
  price: undefined,
};

const PromotionForm = ({ id }) => {
  const history = useHistory(); // para redirecionar para outra pagina
  const [load, loadInfo] = useAPI({
    //nao precisa do segunda varivel, neste caso, apemas load
    url: `/promotions/${id}`,
    method: 'get', // nao tem params
  });
  const [save, saveInfo] = useAPI({
    url: id ? `/promotions/${id}` : '/promotions',
    method: id ? 'put' : 'post',
    // data: values,    /// suprimi por que onSubmit passara os valores agora
    onCompleted: (response) => {
      if (!response.error) {
        history.push('/');
      }
    },
  });

  useEffect(() => {
    // para rodar antes de montar o componente
    if (id) {
      load(); // usar api para buscar dados
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // [] significa rodar apenas na montagem
  // ambos produzem mesmo resultado pq id nao vai mudar a nao ser a pagina toda mude

  function onSubmit(formValues) {
    //onSubmit do Formik ja tem ev.preventDefault
    save({
      data: formValues, // poderiam ser formatados antes de serem passados, por exemplo
    });
  }

  //if (!values){
  //    return <div>Carregando...</div>
  //}
  const values = id ? loadInfo.data : initialValue;

  return (
    <div>
      <h1>Promo Show</h1>
      <h2>Nova Promoção</h2>
      {!values ? ( // se edit inicialmente eh null, entao aparece carregando
        <div>Carregando...</div>
      ) : (
        <Formik
          initialValues={values}
          onSubmit={onSubmit}
          validationSchema={schema}
          render={() => (
            // Formik passa errors para erros e touched para
            // cada campo acessado, Field substitui imput e pode ser personalizado
            <Form>
              {saveInfo.loading && <span>Salvando dados...</span>}
              <div className="promotion-form__group">
                <FormField name="title" type="text" label="Título" />
              </div>
              <div className="promotion-form__group">
                <FormField name="url" type="text" label="Link" />
              </div>
              <div className="promotion-form__group">
                <FormField name="imageUrl" type="text" label="Imagem (URL)" />
              </div>
              <div className="promotion-form__group">
                <FormField
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  label="Preço"
                />
              </div>
              <div>
                <UIButton component="button" type="submit">
                  Salvar
                </UIButton>
              </div>
            </Form>
          )}
        />
      )}
    </div>
  );
};

export default PromotionForm;
