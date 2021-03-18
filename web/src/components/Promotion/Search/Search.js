import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PromotionList from '../List/List';
import useAPI from 'components/utils/useAPI';
import UIInfiniteScroll from 'components/UI/InfiniteScroll/InfiniteScrol';
import UIButton from 'components/UI/Button/Button';
import './Search.css';

const baseParams = {
  _embed: 'comments',
  _order: 'desc',
  _sort: 'id',
  _limit: 2,
};

const PromotionSearch = () => {
  const [page, setPage] = useState(1);
  //const [promotions, setPromotions] = useState([]);
  const mountRef = useRef(false);
  const [search, setSearch] = useState('');
  const [load, loadInfo] = useAPI({
    debounceDelay: mountRef.current ? 300 : 0, //nao dar debounce na montagem
    url: '/promotions',
    method: 'get',
    //onCompleted: (response) => {  // nao precisa ja que vamos usar loading info diretamente
    //    setPromotions(response.data);
    //}
  }); // hook personalizado, no caso func 'load' e  objeto 'loadInfo'

  //console.log(loadInfo);

  useEffect(() => {
    load({
      params: {
        ...baseParams,
        _page: 1,
        title_like: search || undefined,
      },
    }); // usa a funcao load do hook personalizado (useAPI)
    if (!mountRef.current) {
      // ainda nao montou o componente
      mountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); // quando montar componente ou mudar search,
  // nao pode procurar mudanca em load, pq load muda a cada renderizacao e daria loop infinito de requests
  // comentario eslint acima eh para suprimir o warning do compiler quanto a nao passagem do load no segundo parametrdo do useEffect

  function fetchMore() {
    const newPage = page + 1;
    load({
      isFetchMore: true,
      params: {
        ...baseParams,
        _page: newPage,
        title_like: search || undefined,
      },
      updateRequestInfo: (newRequestInfo, prevRequestInfo) => ({
        ...newRequestInfo,
        data: [...prevRequestInfo.data, ...newRequestInfo.data],
      }),
    });
    setPage(newPage);
  }

  return (
    <div className="promotion-search">
      <header className="promotion-search__header">
        <h1>Promo Show</h1>
        <UIButton component={Link} to="/create" theme="contained-green">
          Nova Promoção
        </UIButton>
      </header>
      <input
        type="search"
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
      {loadInfo.data &&
        !loadInfo.loading &&
        loadInfo.data?.length < loadInfo.total && (
          <UIInfiniteScroll fetchMore={fetchMore} />
        )}
    </div>
  );
};

export default PromotionSearch;
