import React, { useState, useEffect } from 'react';
import './Form.css';
import axios from 'axios';
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

    useEffect(() => {  // para rodar antes de montar o componente
        if (id) {
            axios.get(`http://localhost:5000/promotions/${id}`)  // so faz sentido buscar dados se for editar
                .then((response) => {
                    setValues(response.data);
                });
        }
    }, []); // [] significa rodar apenas na montagem

    function onChange(ev) {  // atualizacao online de values toda vez que os inputs mudarem
        const { name, value } = ev.target;
        setValues({ ...values, [name]: value });  // forma correta de modificar um objeto sem dar pau no react com sobrescricao de endereco
    }

    function onSubmit(ev) {
        ev.preventDefault();
        const method = id ? 'put' : 'post';  //put modifica, post acrecenta - api ja espera isso
        const url = id
            ? `http://localhost:5000/promotions/${id}`
            : 'http://localhost:5000/promotions';
        //axios[method](`http://localhost:5000/promotions${id ? `/${id}` : ''}`, values)
        axios[method](url, values)
            .then((response) => {
                history.push('/'); // retorna para pag principal
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