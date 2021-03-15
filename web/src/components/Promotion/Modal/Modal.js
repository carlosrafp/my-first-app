import React, { useEffect, useState } from 'react';
import UIModal from 'components/UI/Modal/Modal';
import useAPI from 'components/utils/useAPI';
import PromotionCommentsTree from 'components/Promotion/Modal/CommentsTree';
import './Modal.css';

const PromotionModal = ({ promotionId, onClickClose }) => {
  const [comment, setComment] = useState('');
  const [load, loadInfo] = useAPI({
    url: `/comments`,
    method: 'GET',
    params: {
      _expand: 'user', // acrescentar o usuario do comentario de acordo com userId
      promotionId, // promotionId : promotionId  >> mesma coisa
    }
  });

  const [sendComment, sendCommentInfo] = useAPI({
    url: `/comments`,
    method: 'POST',
  });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(ev) {
    ev.preventDefault();
    try {
      await sendComment({
        data: {
          userId: 1,
          promotionId,
          comment,
        }
      });
      setComment(''); // ja enviou comentario, entao esvaziar a caixa
      load(); // chama a lista de novo
    } catch (e) {

    }

  }

  return (
    <UIModal isOpen onClickClose={onClickClose}>
      <form
        className="promotion-modal__comment-form"
        onSubmit={onSubmit}
      >
        <textarea
          placeholder="Comentar..."
          onChange={(ev) => setComment(ev.target.value)}
          value={comment}
        />
        <button type="submit" disabled={sendCommentInfo.loading}>
          {sendCommentInfo.loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      <PromotionCommentsTree comments={loadInfo.data} />
    </UIModal>
  );
};

export default PromotionModal;