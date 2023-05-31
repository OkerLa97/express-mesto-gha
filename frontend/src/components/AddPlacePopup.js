import React from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

class AddPlacePopup extends React.Component {

  static contextType = CurrentUserContext;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      url: '',
    };
  }

  render() {

    return (
      <PopupWithForm title="Новое место" id="new-place-popup" submitname="Создать" onClose={this.props.onClose} isOpen={this.props.isOpen} onSubmit={this.handleSubmit} children={
        <>
          <input className="popup__field" type="text" minLength="2" maxLength="30" value={this.state.name} required placeholder="Название" name="name" onChange={this.handleNameChange}/>
          <span className="popup__input-error" id="new-place-name-input-error" />
          <input className="popup__field" type="url" required value={this.state.url} placeholder="Ссылка на картинку" name="link" onChange={this.handleImageChange} />
          <span className="popup__input-error" id="new-place-link-input-error" />
        </>
      }/>
    );
  }

  handleNameChange = event => {
    this.setState({name: event.target.value});
  }

  handleImageChange = event => {
    this.setState({url: event.target.value});
  }

  handleSubmit = (e) => {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения во внешний обработчик используя реф
    const place = {
      name: this.state.name,
      link: this.state.url,
    };

    this.props.onAddPlace(place);
  }
}

export default AddPlacePopup;
