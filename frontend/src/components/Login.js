import React from "react";
import Header from './Header';

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  render(){

    return (
      <>
        <Header redirectTo="/sign-up" text="Регистрация"/>
        <main>
          <section className="auth">
            <form ref={this.formRef} className="auth__form" onSubmit={this.handleSubmit}>
              <h1 className="auth__title">Вход</h1>

              <input className="auth__field" type="email" minLength="2" maxLength="40" placeholder="Email" required value={this.state.email} name="email" onChange={this.handleEmailChange} />
              <input className="auth__field" type="password" minLength="2" maxLength="200" placeholder="Пароль"  required value={this.state.password} name="password" onChange={this.handlePasswordChange} />

              <button className="auth__submit-btn" type="submit">Войти</button>
            </form>
          </section>
        </main>
      </>
    );
  }

  handleEmailChange = event => {
    this.setState({email: event.target.value});
  }

  handlePasswordChange = event => {
    this.setState({password: event.target.value});
  }

  handleSubmit = event => {
    event.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.onLogin(data);
  }
}

export default Login;
