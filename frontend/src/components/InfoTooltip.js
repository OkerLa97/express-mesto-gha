import React from "react";
import ImageSuccess from "../images/auth_success.png";
import ImageError from "../images/auth_error.png";

class InfoTooltip extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  render(){

    const imageSource = this.props.isSuccess ? ImageSuccess : ImageError;

    return (
      <div className={`popup ${this.props.isOpen ? "popup_open": ""}`} id={this.props.id}>
        <div className="popup__overlay" onClick={this.props.onClose}/>
        <div className="popup__container">
          <form ref={this.formRef} className="popup__form" onSubmit={this.props.onSubmit}>
            <button className="popup__close-button" type="button" onClick={this.props.onClose} />
            <img className="auth__popup-image" src={imageSource} />
            <p className="auth__popup-message">{this.props.text}</p>
          </form>
        </div>
      </div>
    );
  }
}

export default InfoTooltip;
