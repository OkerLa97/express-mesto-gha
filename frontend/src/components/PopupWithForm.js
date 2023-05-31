import React from "react";

class PopupWithForm extends React.Component {

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  render() {

    return (
      <div className={`popup ${this.props.isOpen ? "popup_open": ""}`} id={this.props.id}>
        <div className="popup__overlay" onClick={this.props.onClose}/>
        <div className="popup__container">
          <form ref={this.formRef} className="popup__form" onSubmit={this.props.onSubmit}>
            <button className="popup__close-button" type="button" onClick={this.props.onClose} />
            <h3 className="popup__title">{this.props.title}</h3>

            {this.props.children}

            <button className="popup__submit-btn" type="submit">{this.props.submitname}</button>
          </form>
        </div>
      </div>
    );
  }
}

export default PopupWithForm;
