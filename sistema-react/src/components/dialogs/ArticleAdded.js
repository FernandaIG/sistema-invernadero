import React, { Component } from 'react';import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { NavLink, Redirect } from 'react-router-dom';
import AuthService from '../../services/AuthService';




import Requests from '../../services/Requests';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    //padding: theme.spacing(8, 0, 6),
},
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
 
}));


class ArticleAdded extends Component {
    constructor(props) {
        super(props);
        console.log("Begin");
        this.auth = new AuthService();

        this.Requests = new Requests();

        this.ids = ['codigo', 'nombre', 'categoria', 'precio_venta', 'stock', 'descripcion', 'estado'];
        
    }
    state = {

        data: [],
        car:{},
        cantidad:0
       
    };

    render() {


        const datos = this.state.data[0];

        const { classes } = this.props;
        console.log(this.props.idArticle);
        return (
            <div className={classes.root}>
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item>
                   <ButtonBase className={classes.image}>
                    <img className={classes.img} alt="complex"  width= '150px' height= '150px' src={datos ? ('http://localhost:3000/api/articulo/getImage?image='+datos.imagenes):('sn')} />
                  </ButtonBase>  
     
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="h5">
                        Agregaste a tu carrito
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {datos&&datos.nombre}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ID: {datos&&datos.codigo}
                      </Typography>
                    </Grid>
                   
                  </Grid>
                  <Grid item>
                <Typography variant="subtitle1">${datos&&datos.precio_venta}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <NavLink
                        
                            to='/Carrito'
                            style={{ textDecoration: 'none' }}
                        > 
                           <Button variant="contained" color="primary">
  Ver carrito
</Button>
                        </NavLink>
            </Paper>
            
          </div>
        );
    }
    componentDidMount(){
        console.log("Component loaded");
        this.loadData();
        this.loadCarData();
    }

    pushItem=(from)=>{

      console.log(this.state.car);
      console.log('Articulo Agregado');

      console.log(this.state.car);   
      //Buscamos si se encuentra ya el articulo en el carrito
     let indx = this.state.car['detalles'].findIndex(el => el._id == this.state.data[0]._id);
     if(!Array.isArray(this.state.car['detalles'])){
       this.state.car['detalles']=[];
     }else{
       if(indx==-1){
         console.log('No esta este articulo en el carro');
          this.state.car['detalles'].push({_id:this.state.data[0]._id, articulo:this.state.data[0].nombre, descripcion:this.state.data[0].descripcion, cantidad:1,precio:this.state.data[0].precio_venta});
        var ultimo=this.state.car['detalles'].length-1;
        console.log(this.state.car);
        console.log('ultimo' +ultimo);
        this.Requests.update(from + this.state.car['_id'],this.state.car['detalles'][ultimo]);

        //le damos al total el valor de 0 para poder sumar todas los precios de los productos en el arreglo de detalles
        this.state.car['total']=0;
        this.state.car['detalles'].map(element=>{

            this.state.car['total']+=element.precio;
        });
        console.log(this.state.car['total']);
        this.Requests.update('/carrito/updatetotal/?_id='+ this.state.car['_id'],this.state.car);

        window.location.reload();
        
        
     
        } 
      
     }
     

    }

    CrearCarrito=(Usuario)=>{
      this.setState({
        car:{
          usuario:Usuario,
          total:this.state.data[0].precio_venta,
          detalles:[
            {
              _id:this.state.data[0]._id,
              articulo:this.state.data[0].nombre,
              descripcion:this.state.data[0].descripcion,
              cantidad:1,
              precio:this.state.data[0].precio_venta
            }
          ]
        }
      })

      console.log(this.state.car);
        //this.state.car['usuario']=Usuario;
       this.Requests.add('/carrito/add',this.state.car);
       window.location.reload();

    }

    loadData() {

        console.log('Getting list');
        const path = '/articulo/query?_id=';
        const ids = this.ids;
        console.log('from', path);
        return this.Requests.query(path + this.props.idArticle).then(response => {
            console.log(response);
            if (response && response.length !== 0) {// El request no ha devuelto un arreglo vacio
                let dt = response
                let stateData = this.state.data.slice();
                stateData[0] = dt;
                this.setState({ data: stateData });
                console.log('aaaaaaaa'+JSON.stringify(this.state.data));
            } else {
                let stateData = this.state.data.slice();
                stateData[0] = [];
                this.setState({ data: stateData })
            }
        });
    }

    loadCarData() {
      const userType = this.auth.getUser()._id;


      console.log('Getting Car list');
      const path = '/carrito/query?usuario=';
      const ids = this.ids;
      console.log('from', path);
      return this.Requests.query(path+userType).then(response => {

          console.log('Status del response ' +response.status);
          console.log(response);
          if (response.message!='El registro no existe' && response.length !== 0) {// El request no ha devuelto un arreglo vacio
              let dt = response
              let stateData = this.state.data.slice();
              stateData[0] = dt;
              this.setState({ car: dt });
              console.log('entro aca')
              this.pushItem('/carrito/update/?_id=');
          }
          if(response.message=='El registro no existe'){
            //Carrito Nuevo
            console.log('Carrito Crerado');
              this.CrearCarrito(userType);

          }
          else {
              let stateData = this.state.data.slice();
              stateData[0] = [];
              this.setState({ car: stateData })
          }
      });
  }

}

export default withStyles(useStyles, { withTheme: true })(ArticleAdded);