import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Search.css';
import PromotionList from '../List/List';
import useAPI from 'components/utils/useAPI';

const PromotionSearch = () => {
    //const [promotions, setPromotions] = useState([]);
    const [search, setSearch] = useState('');
    const [load, loadInfo] = useAPI({
        url: 'http://localhost:5000/promotions',
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
    }, [search]); // quando montar componente ou mudar search

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