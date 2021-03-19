import React, { useState } from 'react';
import useAPI from 'components/utils/useAPI';
import PromotionCard from 'components/Promotion/Card/Card';
import PromotionModal from 'components/Promotion/Modal/Modal';
import './List.css';

const PromotionList = ({ loading, error, promotions, refetch }) => {
  const [promotionId, setPromotionId] = useState(null);
  const [deletePromotion, deletePromotionInfo] = useAPI({
    method: 'DELETE',
  });
  if (error) {
    return <div>Algo de errado ocorreu.</div>;
  }

  if (promotions === null || deletePromotionInfo.loading) {
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
          onClickDelete={async () => {
            await deletePromotion({
              url: `/promotions/${promotion.id}`,
              onDelete: true, // deletara promocao entao deve esvaziar RequestInfo e nao deixar loading,
              //poderia passar promotion.id tb se fosse necessario manipular requestInfo
            });
            refetch();
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
