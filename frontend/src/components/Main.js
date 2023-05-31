import React from "react";
import Header from './Header';
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

class Main extends React.Component {

  static contextType = CurrentUserContext;

  constructor(props) {
    super(props);
  }

  render() {

    return (

      <>
        <Header redirectTo="/sign-in" text="Выйти" email={this.context.email} onSignOut={this.props.onSignOut}/>
        <main>

          <section className="profile">

            <div className="profile__avatar-container">
              <img className="profile__avatar" src={this.context.userAvatar} alt="Аватар профиля" />
              <div className="profile__avatar-edit" onClick={this.props.onEditAvatar}></div>
            </div>

            <div className="profile__info">
              <div className="profile__header">
                <h1 className="profile__title" id="profile-title">{this.context.userName}</h1>
                <button className="profile__edit-button" id="profile__edit-button" type="button" onClick={this.props.onEditProfile}></button>
              </div>
              <p className="profile__text" id="profile__text">{this.context.userDescription}</p>
            </div>

            <button className="profile__add-button" type="button" onClick={this.props.onAddPlace}></button>

          </section>

          <section className="elements">
            {this.props.cards.map((cardInfo) => (
              <Card key={cardInfo._id} card={cardInfo} onClick={this.props.onCardClick} onCardLike={this.props.onCardLike} onCardDelete={this.props.onCardDelete}/>
            ))}
          </section>

        </main>
      </>
    );
  }
}

export default Main;
