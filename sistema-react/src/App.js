import React, { Component } from 'react';
import './css/App.css';
import AuthService from './services/AuthService';
import UserNav from './components/UserNav';


//Componentes Pruebas
import Rutas from './components/sitioWeb/Rutas';

class App extends Component {

  constructor(props) {
    super(props);
    this.auth = new AuthService();
    this.onAuthChange = this.onAuthChange;
    this.onStorageChange = this.onStorageChange;
    this.state = {auth: this.auth.loggedIn()};//this.state.auth
    window.addEventListener('storage', this.onStorageChange);
  }

  render() {

    // if (this.state.auth) {
    //   return (
    //     <div>
    //       <UserNav onAuthChange={this.onAuthChange}></UserNav>
    //     </div>

    //   );
    // }

    return (
      <React.Fragment>
        <Rutas></Rutas>
      </React.Fragment>

    )
  }

  onAuthChange = () => {
    this.setState({ auth: this.auth.loggedIn() });
  }

  onStorageChange = (ev) => {
    this.setState({ auth: this.auth.loggedIn() });
  }

}

export default App;