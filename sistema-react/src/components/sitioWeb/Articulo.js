import React, { Component } from 'react';
import Carrusel from './Carrusel';

//Stripe
import Pago from './FormularioPago';
import StripeCheckout from 'react-stripe-checkout';

import {Elements, StripeProvider} from 'react-stripe-elements';
//
import Requests from '../../services/Requests';
import { Grid, GridList } from '@material-ui/core';


import { withStyles } from '@material-ui/core/styles';


import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

import ShareIcon from '@material-ui/icons/Share';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import TextField from '@material-ui/core/TextField';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { toast } from "react-toastify";
import AuthService from '../../services/AuthService';
import Comentario from '../commons/Comentarios';

import '../../css/estilos.css';

import Cards from './Cards';

toast.configure();

const useStyles = theme => ({
    card: {
        maxWidth: 480,
    },
    media: {
        height: 5,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
});

class Articulo extends Component {


    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.auth = new AuthService();


        this.ids = ['codigo', 'nombre', 'categoria', 'precio_venta', 'stock', 'descripcion', 'estado'];
        
    }

    state = {

        data: [],
        expansion: true,
        cantidad:1,
        open:false,
        paqueteria:'DHL',
        comentarios:null,
        liked:'disabled',
        likes:0

    };

     


    render() {
        const datos = this.state.data[0];
        const categoriaId=datos&&(datos.categoria._id);
        const comentarios=this.state.comentarios;
        const Cantidades=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
         
      
        const { classes } = this.props;
        const expanded = this.state.expansion;
        return (
            <React.Fragment>
                <Grid className='separador' container spacing={5}>

                    <Grid item sm={6} >
                        <Carrusel></Carrusel>
                         
                                <Comentario
                                comentarios={this.state.comentarios}
                                idarticle={this.props.idArticle}
                                ></Comentario>


                    </Grid>
                         
                    <Grid item sm={6}>
                        <Card className={classes.card}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        {datos && (datos.nombre.charAt(0) + datos.nombre.charAt(1))}
                                    </Avatar>
                                }
                               
                                title={datos && datos.nombre}
                                subheader="September 14, 2016"
                            />
                            <CardMedia
                                className={classes.media}
                                image={datos ? ('http://localhost:3000/api/articulo/getImage?image='+datos.imagenes):('sn')}
                                title={datos&&datos.imagenes}
                            />
                            <CardContent>
                                <Typography variant="h4" color="textPrimary" component="p">
                                    Descripcion
                                   

                                        
                                </Typography>
                                    <p>

                                    </p>
                                <Typography variant="h6" color="textPrimary" component="p">
                                   
                                      Precio Unitario ${datos&& datos.precio_venta}

                                        
                                </Typography>
                                <p>
                                        
                                    </p>

                                <Typography variant="body1" color="textPrimary" component="p">
                                   
                                    <LocalShippingIcon  color="primary" >

                                        
                                    </LocalShippingIcon>
                                           
                                         Envio por Paqueteria {this.state.paqueteria}
                                                                            
                                </Typography>
                                
                                <Typography variant="body1" color="textPrimary" component="p">
                                   
                                costo ${this.state.paqueteria==='DHL'?(199):(232)}

                                     
                             </Typography>

                             <Typography variant="h5" color="textPrimary" component="p">
                                   
                                      Precio Total ${datos&& ((datos.precio_venta*this.state.cantidad)+(this.state.paqueteria==='DHL'?199:232))}

                                        
                                </Typography>

                            </CardContent>

                            
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites" onClick={this.AddToFavorites}>
                                    <FavoriteIcon />
                                </IconButton>
                               
                                <IconButton aria-label="Me gusta" onClick={this.AddLikes}>
                                    <ThumbUpAltIcon 
                                    color={this.state.liked} />
                                </IconButton>
                                {this.state.likes} me gusta
                                

                            </CardActions>

                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>{datos&&(datos.nombre)}:</Typography>
                                    <Typography paragraph>
                                       {datos&&(datos.descripcion)}
                             </Typography>
                            

                             <Typography variant="subtitle2" component="p" >
                                   Stock Disponible: {datos&&datos.stock}
     </Typography>   

       <Typography  variant="h2">                                  
     <FormControl className={classes.formControl}>
    

        <InputLabel htmlFor="select-quantity">Cantidad:</InputLabel>
        <Select
          open={this.state.open}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          value={this.state.cantidad}
          onChange={this.handleChange}
          inputProps={{
            name: 'select-quantity',
            id: 'select-quantity',
          }}
        >
          <MenuItem value={1}>
            <em>1 Unidad</em>
          </MenuItem>
         {
             datos&&(
                datos.stock<15?(Cantidades.slice(2,datos.stock+1).map((valor,i)=>(

                 <MenuItem key={i} value={valor}>{valor}</MenuItem>
             )))
             
             :             
             ((Cantidades.slice(2,16).map((valor,i)=>(

                <MenuItem key={i} value={valor}>{valor} Unidades</MenuItem>
            ))))
                )
         }
         


         
        </Select>
      </FormControl> 
      <Typography variant="overline" color="textSecondary" component="p">
                                   
                    *Si necesita mas de 15 piezas enviar whtasApp

                                        
                                </Typography>
     
                         </Typography>
                                    
                         <CardContent>
                                <Typography  component="p">
                                    No esperes mas y adquiere este producto
                                </Typography>

                            </CardContent>

                            
            {/* Formulario de stripe para pagar, se le envian los datos del producto y el metodo handleTokek */}
            {this.auth.getProfile()&& <Pago
                 datos={datos&&datos}
                 cantidad={this.state.cantidad}
                 paqueteria={this.state.paqueteria}
                 handleToken={this.handleToken}
                    >

                 </Pago>}
                                </CardContent>
                            </Collapse>

                        </Card>
                    </Grid>

                </Grid>

                
                            
                            <h1>Articulos Relacionados</h1>

                            <Grid>
                                {
                                    categoriaId&&(  
                                    <Cards categoriaArticle={categoriaId}>

                                    </Cards>)
                                }
                                
                            </Grid>
                


            </React.Fragment>
        );
      
          
}
    AddLikes=()=>{

        if(this.auth.getProfile()){

       if(this.state.comentarios==null){
        const comentario={
            articulo:this.props.idArticle,
           likes:[this.auth.getProfile()._id]
        }
    this.Requests.add('/calificar/add',comentario).then(response=>{
        console.log(response);
        this.setState({comentarios:response});
        this.setState({liked:'primary'});
        this.setState((state, props) => ({
            likes: state.likes + 1
          }));
    });

       }

       else{
        switch(this.state.liked){
            case 'primary':
                     console.log('Ya dio like');
                     let _id={
                        _id:this.auth.getProfile()._id
                    };
                    this.Requests.update('/calificar/deletelike?_id='+this.state.comentarios._id,_id).then(response=>{
                        console.log(response);
                        //this.setState({comentarios:response});
                        this.setState({liked:'disabled'});
                        this.setState((state, props) => ({
                            likes: state.likes - 1
                          }));
                    });

             break;
             
             case 'disabled':
             let usuario={
                     _id:this.auth.getProfile()._id
                 };
                 this.Requests.update('/calificar/addlike?_id='+this.state.comentarios._id,usuario).then(response=>{
                     console.log(response);
                     this.setState({comentarios:response});
                     this.setState({liked:'primary'});
                     this.setState((state, props) => ({
                        likes: state.likes + 1
                      }));
                 });
 
             break;
        }

       }
    }
    }
 handleChange = (event) => {
    this.setState({cantidad:event.target.value});
    if(event.target.value<=10){
        this.setState({paqueteria:'DHL'});
    }
    if(event.target.value>10){
        this.setState({paqueteria:'Estafeta'});

    }
  };

   handleClose = () => {
    this.setState({open:false});
  };

   handleOpen =() => {
    this.setState({open:true});
  };
      

    componentDidMount() {
        console.log("Component loaded");
        this.loadData();
        this.loadCommentsData();
    }

    handleExpandClick = () =>{

        if(!this.state.expansion){
            this.setState({expansion:true});
        }
        else{
            this.setState({expansion:false});
        }
    }

    handleToken=(token, addresses) => {
        const userType = this.auth.getUser()._id;
        const compra={
            usuario:userType,
            cantidad:this.state.cantidad,
        }
        token.compra=compra;
        console.log({token,addresses});
        //peticion Ajax
         this.Requests.checkout('/venta_en_linea/checkoutProducto?producto='+this.props.idArticle,token).then(res=>{
       
            console.log(res);
            let Compra=res;
          this.Requests.update('/venta_en_linea/updatedatosenvio?_id='+Compra._id,addresses);
          });

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
            } else {
                let stateData = this.state.data.slice();
                stateData[0] = [];
                this.setState({ data: stateData })
            }
        });
    }

    loadCommentsData() {
       // const usuario=this.Requests.AuthSrv.getProfile()._id;
        console.log('Getting list');
        const path = '/calificar/query?articulo=';
        const ids = this.ids;
        console.log('from', path);
        return this.Requests.query(path + this.props.idArticle).then(response => {
            console.log(response);
            if (response && response.message!='El registro no existe') {// El request no ha devuelto un arreglo vacio
                let dt = response

                this.setState({ comentarios: dt });
                this.setState({likes: dt.likes.length});
                if(this.auth.getProfile()){
                    
                    let indx= dt.likes.findIndex(el=>el==this.auth.getProfile()._id);
                if(indx!=-1){
                    this.setState({liked:'primary'});
                }}
                
            } else {
               
                this.setState({ comentarios: null})
            }
        });
    }
}

export default withStyles(useStyles, { withTheme: true })(Articulo);