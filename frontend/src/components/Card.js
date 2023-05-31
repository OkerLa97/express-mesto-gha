import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

class Card extends React.Component {

  static contextType = CurrentUserContext;

  constructor(props) {
    super(props);
  }

  render() {

    const isOwn = this.props.card.owner._id === this.context._id;
    const isLiked = this.props.card.likes.some(i => i._id === this.context._id);

    const cardLikeButtonClassName = (
      `element__like-button ${isLiked ? 'element__like-button_active' : ''}`
    );

    return (
      <div className="element">
        { isOwn && <button className="element__delete-btn" onClick={this.handleCardDelete}/> }
        <div className="element__image-container" onClick={this.handleCardClick}>
          <img className="element__image" src={this.props.card.link} alt={this.props.card.name}/>
        </div>
        <div className="element__footer">
          <h3 className="element__title">{this.props.card.name}</h3>
          <div className="element__likes">
            <button className={cardLikeButtonClassName} type="button" onClick={this.handleLikeClick} />
            <p className="element__like-counter">{this.props.card.likes.length}</p>
          </div>
        </div>
      </div>
    )
  }

  handleCardClick = () => {
    this.props.onClick(this.props.card);
  }

  handleLikeClick = () => {
    this.props.onCardLike(this.props.card);
  }

  handleCardDelete = () => {
    this.props.onCardDelete(this.props.card);
  }
}

export default Card;
