import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import ShoppingcartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Requests from '../../services/Requests';

import { NavLink, Link } from 'react-router-dom';

import sinimg from '../../img/no-image.jpg';


import ListProducts from '../commons/ListProducts';




const useStyles = theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
});



class Album extends Component {

  constructor(props) {
    super(props);
    console.log("Begin");
    this.Requests = new Requests();

    this.ids = ['codigo', 'nombre', 'categoria', 'precio_venta', 'stock', 'descripcion', 'estado'];
    this.menuItems = [
      { icon: <VisibilityIcon fontSize="default" />, link: '/articulo/' },
      { icon: <ShoppingcartIcon fontSize="default" />, link: '/' },
      { icon: <FavoriteBorderIcon fontSize="default" color="secondary" />, link: '/' },
    ]

  }

  state = {

    data: []
  };




  render() {
    const datos = this.loadProducts();
    console.log(datos);

    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Productos
            </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Something short and leading about the collection below—its contents, the creator, etc.
                Make it short and sweet, but not too short so folks don&apos;t simply skip over it
                entirely.
            </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary">
                      Main call to action
                  </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary">
                      Secondary action
                  </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>

                {

                this.state.data[0]&&(
                  <ListProducts
                  data={this.state.data[0]}
                
                />)
                }
                
                  
            </Grid>
          </Container>
        </main>
      </React.Fragment>
    );
  }


  componentDidMount() {
    console.log("Component loaded");
    this.loadData();
  }

    componentDidUpdate(prevProps) {
    if (this.props.valor !== prevProps.valor) {
        this.loadData();
    }
 }

  loadProducts() {
    const datos = this.state.data[0];
    return datos;
  }

  loadData() {
    console.log('Getting list');
    const path = '/articulo/list?valor=';
    const ids = this.ids;
    console.log('from', path);
    return this.Requests.list(path+this.props.valor).then(response => {
      console.log(response);
      if (response && response.length !== 0) {// El request no ha devuelto un arreglo vacio
        let dt = response;
        dt.map((el, i) => {
          let filterProperties = [];//Propiedades de interes
          filterProperties[i] = {};//Inicializar el objeto para cada elemento del arreglo
          ids.forEach(key => {
            if (el[key]._id) {
              el[key] = el[key].nombre;
            }
            filterProperties[i][key] = el[key];
          })
          return filterProperties;
        });
        console.log(dt);
        let stateData = this.state.data.slice();
        stateData[0] = dt.slice();
        this.setState({ data: stateData });
        console.log(this.state.data);
      } else {
        let stateData = this.state.data.slice();
        stateData[0] = [];
        this.setState({ data: stateData })
      }
    });
  }

}

export default withStyles(useStyles, { withTheme: true })(Album);