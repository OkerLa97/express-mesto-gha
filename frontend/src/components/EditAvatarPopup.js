import React from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

class EditAvatarPopup extends React.Component {

  static contextType = CurrentUserContext;

  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };

    this.dataReceived = false;
  }

  // ПОСЛЕ ПОЛУЧЕНИЯ ДАННЫХ ОТ СЕРВЕРА ЗАПИСЫВАЕМ ИХ В СТЕЙТ
  componentDidUpdate(){
    if(this.context.userAvatar !== this.state.url && !this.dataReceived){
      this.dataReceived = true;
      this.setState({
        url: this.context.userAvatar,
      });
    }
  }

  render() {

    return (
      <PopupWithForm title="Обновить аватар" id="edit-avatar-popup" submitname="Сохранить" onClose={this.props.onClose} isOpen={this.props.isOpen} onSubmit={this.handleSubmit} children={
        <>
          <input className="popup__field" type="url" required value={this.state.url} placeholder="Ссылка на картинку" name="link" onChange={this.handleUrlChange} />
          <span className="popup__input-error" id="edit-avatar-link-input-error"></span>
        </>
      }/>
    );
  }

  handleUrlChange = event => {
    this.setState({url: event.target.value});
  }

  handleSubmit = (e) => {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения во внешний обработчик
    this.props.onUpdateAvatar(this.state.url);
  }
}

export default EditAvatarPopup;
