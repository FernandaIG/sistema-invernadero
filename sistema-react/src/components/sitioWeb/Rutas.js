import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

//Componentes
import Inicio from './Inicio';
import Blog from './Blog';
import Contacto from './Contacto';
import Productos from './Productos';
import Articulo from './Articulo';
import Nosotros from './Nosotros';
import Error from './Error';
import Menu from './Menu';
import Header from './Header';
import Footer from './Footer';
import SignIn from '../commons/SignIn';
import SignUp from '../commons/SignUp';
import Recuperacion from '../commons/Recuperacion';
import UserNav from '../UserNav';
import Carrito from '../sitioWeb/Carrito';
import AuthService from '../../services/AuthService';
import ArticleAdded from '../dialogs/ArticleAdded';
import MiCuenta from '../commons/MiCuenta';


class Rutas extends Component {

  constructor(props) {
    super(props);
    this.auth = new AuthService();
    this.onAuthChange = this.onAuthChange;
    this.onStorageChange = this.onStorageChange;
    this.state = { auth: this.auth.loggedIn() };//this.state.auth
    window.addEventListener('storage', this.onStorageChange);
  }

  render() {

    const userType = this.auth.getUserAccess();
    console.log('Usuario ' + userType);
    //Si el usuario administrador o vendedor estan logueados
    if (this.state.auth && (userType === 'Administrador' || userType === 'Vendedor')) {
      return (
        <div>
          <UserNav onAuthChange={this.onAuthChange}></UserNav>
        </div>

      );
    }
    //Si el cliente esta logueado solo se muestran estas rutas
    if (this.state.auth && userType === 'Cliente') {
      return (
        <Router>
          <Header></Header>
          <Menu></Menu>
          {/**Configuracioón de rutas y páginas */}
          <Switch>
            <Route exact path="/" component={Inicio} />
            <Route exact path="/inicio" component={Inicio} />
            <Route exact path="/blog" component={Blog} />
            <Route exact path="/contacto" component={Contacto} />
            <Route exact path="/productos" component={Productos} />
            <Route exact path="/nosotros" component={Nosotros} />
            <Route exact path="/carrito" component={Carrito} />
            <Route exact path="/addtoCar/:id" render={(routeProps) => (
              <ArticleAdded idArticle={routeProps.match.params.id} />
            )} />
            <Route exact path="/articulo/:id" render={(routeProps) => (
              <Articulo idArticle={routeProps.match.params.id} />
            )} />

<Route exact path="/productos/:valor" render={(routeProps)=>(
            <Productos valor={routeProps.match.params.valor}/>
          )} />
          
            <Route exact path="/SignUp" component={SignUp} />
            <Route exact path="/miCuenta" component={MiCuenta} />

            <Route component={Error} />
            {/* <Redirect exact path="/" component={Inicio} /> */}
          </Switch>

          <Footer></Footer>
        </Router>
      );
    }

    return (
      <Router>
        <Header></Header>
        <Menu></Menu>
        {/**Configuracioón de rutas y páginas */}
        <Switch>
          <Route exact path="/" component={Inicio} />
          <Route exact path="/inicio" component={Inicio} />
          <Route exact path="/blog" component={Blog} />
          <Route exact path="/contacto" component={Contacto} />
          <Route exact path="/productos" component={Productos} />
          <Route exact path="/nosotros" component={Nosotros} />
          <Route exact path="/carrito" component={Carrito} />

          <Route exact path="/SignIn" render={routeProps => <SignIn {...routeProps} onAuthChange={this.onAuthChange} />} />
          <Route exact path="/Recuperacion" render={routeProps => <Recuperacion {...routeProps} onAuthChange={this.onAuthChange} />} />
          <Route exact path="/articulo/:id" render={(routeProps) => (
            <Articulo idArticle={routeProps.match.params.id} />
          )} />

<Route exact path="/productos/:valor" render={(routeProps)=>(
            <Productos valor={routeProps.match.params.valor}/>
          )} />


          <Route exact path="/SignUp" component={SignUp} />
          <Route component={Error} />
          {/* <Redirect exact path="/" component={Inicio} /> */}
        </Switch>

        <Footer></Footer>
      </Router>
    );
  }

  onAuthChange = () => {
    this.setState({ auth: this.auth.loggedIn() });
  }

  onStorageChange = (ev) => {
    this.setState({ auth: this.auth.loggedIn() });
  }

}

export default Rutas;