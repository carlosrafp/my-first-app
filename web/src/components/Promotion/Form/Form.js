import React, { useState, useEffect } from 'react';
import './Form.css';
import useAPI from 'components/utils/useAPI';
import { useHistory } from 'react-router-dom';

const initialValue = {
    title: '',
    url: '',
    imageUrl: '',
    price: 0
};

const PromotionForm = ({ id }) => {
    const [values, setValues] = useState(id ? null : initialValue);  // estado dos campos, null se edit, valor inicial se create
    const history = useHistory();  // para redirecionar para outra pagina
    const [load] = useAPI({  //nao precisa do segunda varivel, neste caso, apemas load
        url: `/promotions/${id}`,
        method: 'get', // nao tem params
        onCompleted: (response) => {
            setValues(response.data);
        }
    });
    const [save, saveInfo] = useAPI({
        url: id
            ? `/promotions/${id}`
            : '/promotions',
        method: id ? 'put' : 'post',
        // data: values,    /// suprimi por que onSubmit passara os valores agora
        onCompleted: (response) => {
            if (!response.error) {
                history.push('/');
            }
        }
    });

    useEffect(() => {  // para rodar antes de montar o componente
        if (id) {
            load(); // usar api para buscar dados
        }  // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // [] significa rodar apenas na montagem
    // ambos produzem mesmo resultado pq id nao vai mudar a nao ser a pagina toda mude

    function onChange(ev) {  // atualizacao online de values toda vez que os inputs mudarem
        const { name, value } = ev.target;
        setValues({ ...values, [name]: value });  // forma correta de modificar um objeto sem dar pau no react com sobrescricao de endereco
    }

    function onSubmit(ev) {
        ev.preventDefault();
        save({
            data: values  // poderiam ser formatados antes de serem passados, por exemplo
        });
    }

    //if (!values){
    //    return <div>Carregando...</div>
    //}

    return (
        <div>
            <h1>Promo Show</h1>
            <h2>Nova Promoção</h2>
            {!values  // se edit inicialmente eh null, entao aparece carregando
                ? (<div>Carregando...</div>)
                : (
                    <form onSubmit={onSubmit}>
                        {saveInfo.loading && <span>Salvando dados...</span>}
                        <div className="promotion-form__group">
                            <label htmlFor="title">Título</label>
                            <input id="title" name="title" type="text" onChange={onChange} value={values.title} />
                        </div>
                        <div className="promotion-form__group">
                            <label htmlFor="url">Link</label>
                            <input id="url" name="url" type="text" onChange={onChange} value={values.url} />
                        </div>
                        <div className="promotion-form__group">
                            <label htmlFor="imageUrl">Imagem (URL)</label>
                            <input id="imageUrl" name="imageUrl" type="text" onChange={onChange} value={values.imageUrl} />
                        </div>
                        <div className="promotion-form__group">
                            <label htmlFor="price">Preço</label>
                            <input id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                onChange={onChange} value={values.price} />
                        </div>
                        <div>
                            <button type="submit">Salvar</button>
                        </div>
                    </form>
                )
            }
        </div>
    );
};

export default PromotionForm;