import React from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

class EditProfilePopup extends React.Component {

  static contextType = CurrentUserContext;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
    };

    this.dataReceived = false;
  }

  // ПОСЛЕ ПОЛУЧЕНИЯ ДАННЫХ ОТ СЕРВЕРА ЗАПИСЫВАЕМ ИХ В СТЕЙТ
  componentDidUpdate(){
    if((this.context.userName !== this.state.name || this.context.userDescription !== this.state.description) && !this.dataReceived){
      this.dataReceived = true;
      this.setState({
        name: this.context.userName,
        description: this.context.userDescription,
      });
    }
  }

  render() {

    return (
      <PopupWithForm title="Редактировать профиль" id="edit-profile-popup" submitname="Сохранить" onClose={this.props.onClose} isOpen={this.props.isOpen} onSubmit={this.handleSubmit} children={
        <>
          <input className="popup__field" type="text" minLength="2" maxLength="40" placeholder="Имя" required value={this.state.name} name="name" onChange={this.handleNameChange} />
          <span className="popup__input-error" id="edit-profile-name-input-error" />
          <input className="popup__field" type="text" minLength="2" maxLength="200" placeholder="О себе"  required value={this.state.description} name="about" onChange={this.handleAboutChange} />
          <span className="popup__input-error" id="edit-profile-job-input-error" />
        </>
      }/>
    );
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  handleAboutChange = (e) => {
    this.setState({ description: e.target.value });
  }

  handleSubmit = (e) => {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    this.props.onUpdateUser({
      name: this.state.name,
      about: this.state.description,
    });
  }
}

export default EditProfilePopup;
