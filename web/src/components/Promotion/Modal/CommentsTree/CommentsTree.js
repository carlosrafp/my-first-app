import React, { useMemo, useState } from "react";
import "./CommentsTree.css";

function getTree(list) {
  const roots = [];
  const childrenByParentId = {};

  if (!list) return [];

  list.forEach((item) => {
    if (!item.parentId) {
      roots.push(item);
      return;
    }

    if (!childrenByParentId[item.parentId]) {
      childrenByParentId[item.parentId] = [];
    }

    childrenByParentId[item.parentId].push(item);
  });

  function buildNodes(nodes) {
    if (!nodes) {
      return null;
    }
    return nodes.map((node) => ({
      ...node,
      children: buildNodes(childrenByParentId[node.id]),
    }));
  }

  return buildNodes(roots);
}

const PromotionModalCommentsTree = ({ comments, sendComment }) => {
  const tree = useMemo(() => getTree(comments), [comments]);
  const [comment, setComment] = useState("");
  const [activeCommentBox, setActiveCommentBox] = useState(null);

  //useEffect(() => {
  //  console.log(getTree(comments));
  //}, [comments]);

  if (!comments) {
    return <p>Carregando comentários...</p>;
  }

  if (comments.length === 0) {
    return <p>Ninguem comentou ainda, seja o primeiro a comentar!</p>;
  }

  function renderItem(item) {
    return (
      <li className="promotion-modal-comments-tree__item">
        <img
          src={item.user.avatarUrl}
          alt={`foto de ${item.user.name}`}
          className="promotion-modal-comments-tree__item__avatar"
        />
        <div className="promotion-modal-comments-tree__item__info">
          <span className="promotion-modal-comments-tree__item__name">
            {item.user.name}
          </span>
          <p>{item.comment}</p>
          <button
            type="button"
            className="promotion-modal-comments-tree__answer-button"
            onClick={() => {
              setComment("");
              activeCommentBox === item.id
                ? setActiveCommentBox(null)
                : setActiveCommentBox(item.id);
            }}
          >
            Responder
          </button>
          {activeCommentBox === item.id && (
            <div className="promotion-modal-comments-tree__comment-box">
              <textarea
                value={comment}
                onChange={(ev) => setComment(ev.target.value)}
              />
              <button
                type="button"
                className="promotion-modal-comments-tree__send-button"
                onClick={() => {
                  sendComment(comment, item.id);
                  setComment("");
                  setActiveCommentBox(null);
                }}
              >
                Enviar
              </button>
            </div>
          )}
          {item.children && renderList(item.children)}
        </div>
      </li>
    );
  }

  function renderList(list) {
    return (
      <ul className="promotion-modal-comments-tree">{list.map(renderItem)}</ul>
    );
  }
  // {tree.map(renderItem)}  == {tree.map((item)=>renderItem(item))}

  return renderList(tree);
};

PromotionModalCommentsTree.defaultProps = {
  sendComment: (comment, parentId) => {
    console.log({ comment, parentId });
  },
};

export default PromotionModalCommentsTree;
