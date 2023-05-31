import React from "react";
import logo from '../images/logo.svg';
import { Link } from "react-router-dom";

class Header extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <header className="header">
        <img className="header__logo" src={logo} alt="Место" />
        <div className="header__control">
          {this.props.email && <p className='header__email'>{this.props.email}</p>}
          <Link className="header__link" to={this.props.redirectTo} replace onClick={this.props.onSignOut}>{this.props.text}</Link>
        </div>
      </header>
    );
  }
}

export default Header;
