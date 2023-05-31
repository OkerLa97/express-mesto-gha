import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from './InfoTooltip';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRouteElement from "./ProtectedRoute";

class App extends React.Component {

  static contextType = CurrentUserContext;

  // ИНИЦИАЛИЗАЦИЯ
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isImagePopupOpen: false,
      isInfoTooltipOpen: false,
      isInfoTooltipSuccess: false,
      InfoTooltipText: '',
      selectedCard: {name: '', link: ''},
      currentUser: {
        email: "",
        userName: "",
        userDescription: "",
        userAvatar: "",
        _id: "",
      },
      cards: [],
    };
  }

  // ПОСЛЕ МОНТИРОВАНИЯ
  componentDidMount() {

    // ИМЕЕТСЯ ТОКЕН И НЕ АВТОРИЗОВАН
    const jwt = localStorage.getItem("jwt");
    if(jwt && !this.state.isLoggedIn){

      // ПРОХОДИМ АВТОРИЗАЦИЮ ЧЕРЕЗ ТОКЕН И ЗАПРАШИВАЕМ ДАННЫЕ ПОСЛЕ АВТОРИЗАЦИИ
      api.checkAuth({jwt})
      .then( loginData => {
        this.setState({
          isLoggedIn: true,
          email: loginData.data.email,
        });
        this.startApp();
      })
      .catch((err) => {
        console.log(err);
      });

    }

    // ЗАПРАШИВАЕМ ДАННЫЕ ЕСЛИ УЖЕ АВТОРИЗОВАН
    if(this.state.isLoggedIn){
      this.startApp();
    }
  }

  startApp(){
    Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cardsData]) => {
      this.setState({
        currentUser: {
          userName: userData.name,
          userDescription: userData.about,
          userAvatar: userData.avatar,
          _id: userData._id,
          email: this.state.email,
        },
        cards: cardsData,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // РЕНДЕР
  render() {
    return (

      <CurrentUserContext.Provider value={this.state.currentUser}>
        <div className="App">
          <div className="page">

            <BrowserRouter>
              <Routes>

              <Route path="/" element={
                <ProtectedRouteElement
                  element={Main}
                  onEditProfile={this.handleEditProfileClick}
                  onAddPlace={this.handleAddPlaceClick}
                  onEditAvatar={this.handleEditAvatarClick}
                  onCardClick={this.handleCardClick}
                  onCardLike={this.handleCardLike.bind(this)}
                  onCardDelete={this.handleCardDelete.bind(this)}
                  onSignOut={this.handleSignOut.bind(this)}
                  cards={this.state.cards}
                  loggedIn={this.state.isLoggedIn}
                />
                }
              />

                <Route path="/sign-in" element={ this.state.isLoggedIn ? <Navigate to="/"/> : <Login onLogin={this.handleLoginUser}/>} />
                <Route path="/sign-up" element={<Register onRegister={this.handleRegisterUser}/>}/>
              </Routes>
            </BrowserRouter>

            <Footer />

            <EditProfilePopup isOpen={this.state.isEditProfilePopupOpen} onClose={this.closeAllPopups} onUpdateUser={this.handleUpdateUser} />
            <AddPlacePopup isOpen={this.state.isAddPlacePopupOpen} onClose={this.closeAllPopups} onAddPlace={this.handleAddPlace} />
            <EditAvatarPopup isOpen={this.state.isEditAvatarPopupOpen} onClose={this.closeAllPopups} onUpdateAvatar={this.handleUpdateAvatar} />
            <PopupWithForm title="Вы уверены?" id="delete-card-popup" submitname="Да" onClose={this.closeAllPopups} children={<></>} />
            <ImagePopup card={this.state.selectedCard} onClose={this.closeAllPopups}/>
            <InfoTooltip isOpen={this.state.isInfoTooltipOpen} text={this.state.InfoTooltipText} isSuccess={this.state.isInfoTooltipSuccess} onClose={this.closeAllPopups}/>

          </div>
        </div>
      </CurrentUserContext.Provider>
    );
  }

  // МЕТОДЫ
  closeAllPopups = () => {
    this.setState({
      isEditAvatarPopupOpen: false,
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isImagePopupOpen: false,
      isInfoTooltipOpen: false,
      selectedCard: {name: '', link: ''},
    });
  }

  // СОБЫТИЯ
  handleEditAvatarClick = () => {
    this.setState({ isEditAvatarPopupOpen: true });
  }

  handleEditProfileClick = () => {
    this.setState({ isEditProfilePopupOpen: true });
  }

  handleAddPlaceClick = () => {
    this.setState({ isAddPlacePopupOpen: true });
  }

  handleCardClick = (card) => {
    this.setState({ isImagePopupOpen: true, selectedCard: card });
  }

  handleCardLike(card) {

    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === this.state.currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      // Обновляем стейт
      this.setState(state => ({
        cards: state.cards.map((c) => c._id === card._id ? newCard : c),
      }));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleCardDelete(card){
    api.deleteCard(card._id).then((newCard) => {
      this.setState(state => ({
        cards: state.cards.filter((c) => c._id !== card._id),
      }));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleUpdateUser = (data) => {
    api.editProfile(data).then((userData) => {
      this.setState({
        currentUser: {
          userName: userData.name,
          userDescription: userData.about,
          userAvatar: userData.avatar,
          _id: userData._id,
        }
      });
      this.closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleUpdateAvatar = (data) => {
    api.editAvatar(data).then((userData) => {
      this.setState({
        currentUser: {
          userName: userData.name,
          userDescription: userData.about,
          userAvatar: userData.avatar,
          _id: userData._id,
        }
      });
      this.closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleAddPlace = (data) => {
    api.addCard(data).then((cardData) => {
      this.setState({
        cards: [cardData, ...this.state.cards]
      });
      this.closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleRegisterUser = (data) => {
    api.registerUser(data)
    .then(userInfo => {
      this.setState({
        isInfoTooltipOpen: true,
        isInfoTooltipSuccess: true,
        InfoTooltipText: "Вы успешно зарегистрировались!",
      })
    })
    .catch(err => {
      console.log(err);
      this.setState({
        isInfoTooltipOpen: true,
        isInfoTooltipSuccess: false,
        InfoTooltipText: "Что-то пошло не так! Попробуйте ещё раз.",
      })
    })
  }

  // АВТОРИЗАЦИЯ ИСПОЛЬЗУЯ ДАННЫЕ
  handleLoginUser = (data) => {
    api.loginUser(data)
    .then(loginInfo => {
      // СОХРАНЯЕМ ТОКЕН И ЗАПРАШИВАЕМ ДАННЫЕ С СЕРВЕРА ЧЕРЕЗ startApp()
      if(loginInfo.token){
        const jwt = loginInfo.token;
        localStorage.setItem("jwt", jwt);
        this.setState({email: data.email, isLoggedIn:true});
        this.startApp();
      } else this.handleLoginError();
    })
    .catch(err => {
      console.log(err);
      this.handleLoginError();
    })
  }

  handleLoginError(){
    this.setState({
      isInfoTooltipOpen: true,
      isInfoTooltipSuccess: false,
      InfoTooltipText: "Что-то пошло не так! Попробуйте ещё раз.",
    })
  }

  handleSignOut(){
    localStorage.removeItem("jwt");
    this.setState({isLoggedIn: false});
  }
}

export default App;
