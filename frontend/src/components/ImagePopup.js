import React from "react";

class ImagePopup extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const isValide = this.props.card.name != '' && this.props.card.link != '';
    return (
      <div className={`popup ${isValide ? "popup_open": ""}`} id="popup-image">
        <div className="popup__overlay popup__overlay_dark" onClick={this.props.onClose}/>
        <div className="popup__container">
          <button className="popup__close-button" id="popup-image-close-button" type="button" onClick={this.props.onClose}/>
          <img className="popup__image" src={this.props.card.link} id="popup-image-image" alt={this.props.card.name} />
          <p className="popup__image-paragraph" id="popup-image-name">{this.props.card.name}</p>
        </div>
      </div>
    );
  }
}

export default ImagePopup;
