import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Search.css';
import PromotionList from '../List/List';
import useAPI from 'components/utils/useAPI';

const PromotionSearch = () => {
    //const [promotions, setPromotions] = useState([]);
    const mountRef = useRef(false);
    const [search, setSearch] = useState('');
    const [load, loadInfo] = useAPI({
        debounceDelay: mountRef.current ? 300 : 1, //nao dar debounce na montagem
        url: '/promotions',
        method: 'get',
        params: {
            _embed: 'comments',
            _order: 'desc',
            _sort: 'id',
            title_like: search || undefined
        },
        //onCompleted: (response) => {  // nao precisa ja que vamos usar loading info diretamente
        //    setPromotions(response.data);
        //}
    });  // hook personalizado, no caso func 'load' e  objeto 'loadInfo'

    //console.log(loadInfo);

    useEffect(() => {
        load();  // usa a funcao load do hook personalizado (useAPI)
        if (!mountRef.current) {  // ainda nao montou o componente
            mountRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [search]); // quando montar componente ou mudar search, 
    // nao pode procurar mudanca em load, pq load muda a cada renderizacao e daria loop infinito de requests
    // comentario eslint acima eh para suprimir o warning do compiler quanto a nao passagem do load no segundo parametrdo do useEffect

    return (
        <div className="promotion-search">
            <header className="promotion-search__header">
                <h1>Promo Show</h1>
                <Link to="/create">Nova Promoção</Link>
            </header>
            <input type="search"
                className="promotion-search__input"
                placeholder="Buscar"
                value={search}
                onChange={(ev) => setSearch(ev.target.value)}
            />
            <PromotionList
                promotions={loadInfo.data}
                loading={loadInfo.loading}
                error={loadInfo.error}
            />
        </div>
    );

};

export default PromotionSearch;