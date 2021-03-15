import React from 'react';
import './CommentsTree.css';

const PromotionCommentsTree = ({ comments }) => {

  if (!comments) {
    return <p>Carregando comentários...</p>
  }

  if (comments.length === 0) {
    return <p>Ninguem comentou ainda, seja o primeiro a comentar!</p>
  }

  return (
    <ul className="promotion-modal-comments-tree">
      {comments.map((item) => (
        <li className="promotion-modal-comments-tree__item">
          <img
            src={item.user.avatarUrl}
            alt={`foto de ${item.user.name}`}
            className="promotion-modal-comments-tree__item__avatar"
          />
          <div className="promotion-modal-comments-tree__item__info">
            <span className="promotion-modal-comments-tree__item__name">{item.user.name}</span>
            <p>{item.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PromotionCommentsTree;