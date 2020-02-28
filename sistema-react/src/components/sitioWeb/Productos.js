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
import FilterDialog from '../dialogs/FilterDialog';
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


const archives = [
  'March 2020',
  'February 2020',
  'January 2020',
  'December 2019',
  'November 2019',
  'October 2019',
  'September 2019',
  'August 2019',
  'July 2019',
  'June 2019',
  'May 2019',
  'April 2019',
];

const social = ['GitHub', 'Twitter', 'Facebook'];

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

    data: [],
    open:false,
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
              <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                Productos
            </Typography>
              <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                Disfruta de nuestra gran variedad de cactus y suculentas que tenemos para ti en el invernadero "El secreto de la montaña"
            </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={this.handleOpen}>
                      Especies
                  </Button>

                  
                  {
                    this.state.data[1]&&<FilterDialog 
                  categorias={this.state.data[1]}
                  onClose={this.handleClose} open={this.state.open}></FilterDialog>}
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

  handleOpen=(ev)=>{

    this.setState({
      open:true
    })
  }
  handleClose = (ev) => {
    this.setState({
      open:false
    });
    
  };

  componentDidMount() {
    console.log("Component loaded");
    this.loadData();
    this.loadCaategoryData();
  }


  loadProducts() {
    const datos = this.state.data[0];
    return datos;
  }

  componentDidUpdate(prevProps) {
    if (this.props.valor !== prevProps.valor) {
        this.loadData();
    }
 }

  loadData() {
    console.log('Getting list');
    const path = '/articulo/list?valor=';
    const path2 = '/categoria/listporNombre?valor='+(this.props.valor?(this.props.valor):(''));

    //el path3 es para listar sin categoria ya que da un error de casteo por ser un objeto categoria del modelo articulo
    const path3 = '/articulo/listsinCategoria?valor='+(this.props.valor?(this.props.valor):(''));
    const ids = this.ids;
    console.log('from', path);
    this.Requests.list(path2).then(response=>{
        let dt2=response;
        console.log(dt2);
        if (response && response.length !== 0) {// El request no ha devuelto un arreglo vacio
          return this.Requests.list(path+dt2._id).then(response => {
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
        else{
          return this.Requests.list(path3).then(response => {
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

    })


   
  }

  loadCaategoryData() {


    console.log('Getting list');
      const ids = this.ids;
      const path = '/categoria/list';
      console.log('from',path);
      return this.Requests.list(path).then(response=>{
          if(response.message!='El registro no existe'){//  El request ha regresado un mensaje de que el registro no existe
              let dt = response;
              let stateData = this.state.data.slice();

              stateData[1] = dt;
              this.setState({data:stateData});




          }else{
              
          }
      });
}

}

export default withStyles(useStyles, { withTheme: true })(Album);