import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';

//Material UI
import Toolbar from '@material-ui/core/Toolbar';
import { fade, makeStyles } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';
import ShoppingcartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PermidentityIcon from '@material-ui/icons/PermIdentity';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';



import AuthService from '../../services/AuthService';
import Requests from '../../services/Requests';

import { withRouter } from "react-router-dom";




//Componentes
import logo from '../../img/Logo.png';
import Rutas from './Rutas';



const useStyles = theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbarTitle: {
    flex: 2
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(100),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

class Header extends Component {

  constructor(props) {

    super(props);
    this.auth = new AuthService();
    this.Requests = new Requests();
  }

  state = {
    anchorEl: null,
    setAnchorEl: null,
    data: [],
    busqueda: '',
  };

  render() {
    this.state.data[0] && (console.log((this.state.data[0]['detalles'].length)));
    const menuItems = [
      // { icon: <SearchIcon fontSize="default" />, link: '/' },
      { icon: <Badge badgeContent={this.state.data[0] ? (this.state.data[0]['detalles'].length) : (0)} color="default"><ShoppingcartIcon fontSize="default" /></Badge>, link: '/Carrito' },
      { icon: <FavoriteBorderIcon fontSize="default" color="secondary" />, link: '/Carrito' },
      { icon: <PermidentityIcon fontSize="default" />, link: '/SignIn' },
    ]
    const { classes } = this.props;
    const userType = this.auth.getUserAccess();
    return (
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          <NavLink to={'/'} key='home'>
            <img alt="Logo" src={logo} width='250px' height='160px' />
          </NavLink>

          <div className={classes.search}>

            <form onSubmit={this.handleSubmit} className={classes.form} Validate>

              <IconButton aria-label="delete" type="submit"
                size="small">
                <SearchIcon />

              </IconButton>

              <InputBase
                placeholder="Buscar..."
                value={this.state.busqueda}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={this.hanldreSearch}
              />
            </form>
          </div>
        </Typography>


        {
          userType !== 'Cliente' ? (menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={menuItems[index].link}
              style={{ textDecoration: 'none' }}
            >
              <Button color='default' >
                {menuItems[index].icon}
              </Button>
            </NavLink>
          ))

          ) :

            (
              /* Si el usuario se encuentra logueado No mostrara el icono de login */
              menuItems.slice(0, 2).map((item, index) => (
                <NavLink
                  key={index}
                  to={menuItems[index].link}
                  style={{ textDecoration: 'none' }}
                >
                  <Button color='default' >

                    {menuItems[index].icon}
                  </Button>
                </NavLink>
              )))

        }

        {/* Si el usuario se encuentra logueado mostrara su nombre y con un menu de opciones */}
        {
          userType == 'Cliente' &&
          (
            <div>
              <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                {this.auth.getUser().usuario}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                 <NavLink
                                    to={'/miCuenta'}
                                    key='home'
                                    style={{ textDecoration: 'none', color: '#000000' }}
                                >
                                    <MenuItem onClick={this.handleClose}>Editar Perfil</MenuItem>
                                </NavLink>
                <MenuItem onClick={this.logout}>Salir</MenuItem>
              </Menu>
            </div>
          )
        }


      </Toolbar>
    );
  }

  handleClick = event => {

    this.setState({
      anchorEl: (event.currentTarget)
    })
  }

  hanldreSearch = (ev) => {
    this.setState({ busqueda: ev.target.value })
  }

  logout = () => {
    this.auth.getUserAccess();
    this.auth.logout();
    this.setState({
      anchorEl: null
    })
    window.location.reload();
  }

  handleClose = () => {
    this.setState({
      anchorEl: null
    })
  }

  componentDidMount() {
    if (this.auth.loggedIn()) {
      this.loadCarData();
    }
  }


  handleSubmit = (ev) => {
    ev.preventDefault();
    this.props.history.replace('../productos/' + this.state.busqueda);
    (this.setState({busqueda:''}));



  }

  loadCarData() {
    const userType = this.Requests.AuthSrv.getProfile()._id


    console.log('Getting list');
    const path = '/carrito/query?usuario=';
    console.log('from', path);
    return this.Requests.list(path + userType).then(response => {
      console.log(response);
      if (response.message != 'El registro no existe') {// El request no ha devuelto un arreglo vacio
        let dt = response;
        console.log(dt);
        let stateData = this.state.data.slice();

        stateData[0] = dt;
        this.setState({ data: stateData });
      }
    });
  }

}

export default withRouter(withStyles(useStyles, { withTheme: true })(Header));