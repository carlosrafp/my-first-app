import React, { useState } from 'react';
import PromotionCard from 'components/Promotion/Card/Card';
import './List.css';
import PromotionModal from 'components/Promotion/Modal/Modal';

const PromotionList = ({ loading, error, promotions }) => {
  const [promotionId, setPromotionId] = useState(null);
  if (error) {
    return <div>Algo de errado ocorreu.</div>;
  }

  if (!promotions) {
    return <div>Carregando...</div>;
  }

  if (promotions.length === 0) {
    return <div>Nenhum resultado encontrado.</div>;
  }

  return (
    <div className="promotion-list">
      {promotions.map((promotion) => (
        <PromotionCard
          promotion={promotion}
          onClickComments={() => {
            setPromotionId(promotion.id);
          }}
        />
      ))}
      {loading && <div>Carregando mais promoções...</div>}
      {promotionId && (
        <PromotionModal
          promotionId={promotionId}
          onClickClose={() => {
            setPromotionId(null);
          }}
        />
      )}
    </div>
  );
};

export default PromotionList;
