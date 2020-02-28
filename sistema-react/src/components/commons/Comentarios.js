import React, {Component} from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';



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
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Requests from '../../services/Requests';
import AuthService from '../../services/AuthService';
import 'moment/locale/es';
import Moment from 'react-moment';
import LoginDialog from '../dialogs/LoginDialog';

class Comentario extends Component{
    
    constructor(props) {
        super(props);
        this.Requests = new Requests();
        this.auth = new AuthService();
      
    }
    state={
        comentario:'',
        disabled:true,
        anchorEl:null,
        LoginDialog:false

    };


    render(){
      


        console.log(this.props.comentarios);
        console.log(this.props.idarticle);
        return(
            
          
            <React.Fragment>

            {
                this.state.LoginDialog&&
                <LoginDialog 
                texto="Para Comentar o dar 'Me gusta' Inicia Sesión">
                   
                </LoginDialog>
            }
            
                <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            value={this.state.comentario}
                            id="comentario"
                            label="Comentario"
                            name="comentario"
                            autoComplete="comantario"
                            autoFocus
                            onChange={this.handleChange}
                        />

            <Button

                            onClick={this.handleComment}
                            disabled={this.state.disabled}
                            fullWidth
                            variant="contained"
                            color="primary"
                           // className={classes.submit}
                        >
                           Comentar
                        </Button>
            
{  
            this.props.comentarios&&
            
            this.props.comentarios['comentarios']&&this.props.comentarios['comentarios'].sort((a,b)=>{
                if (a.fecha < b.fecha) {
                    return 1;
                  }
                  if (a.fecha > b.fecha) {
                    return -1;
                  }
                  // Son iguales
                  return 0;


            }).map((valor,i)=>(
              <div key={i}> 


                
                <Card >
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe">
                      {valor.nombre_usuario.charAt(0)+valor.nombre_usuario.charAt(1)}
                    </Avatar>
                  }
                  action={
                      <React.Fragment>
                           <IconButton aria-label="settings"
                           onClick={this.handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                      >
                        <MenuItem onClick={this.handleClose}>Eliminar</MenuItem>
                        <MenuItem onClick={this.handleClose}>Editar</MenuItem>
                      </Menu>
                      </React.Fragment>
                   
                
                      
                  }
                  title={valor.nombre_usuario}
                  subheader={<Moment locale='es' fromNow>
                      {valor.fecha}
                  </Moment>}
                />
                <CardMedia
                  
                  image="/static/images/cards/paella.jpg"
                  title="Paella dish"
                />
                <CardContent>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {valor.texto}
                  </Typography>
                </CardContent>
                
                </Card>
                
               </div> 
            ))



        }

</React.Fragment>        
        );
    }
    handleClick = event => {
        this.setState({
            anchorEl:(event.currentTarget)
        })
      }

      handleClose = () => {
        this.setState({
            anchorEl:null
        })
    }
    handleChange=(ev)=>{
        
        try {
            const usuario=this.auth.getProfile()._id;
        this.setState({[ev.target.name]:ev.target.value});
        this.setState({disabled:false});
        if(ev.target.value.length<1 && usuario){
            this.setState({disabled:true});

        }
        } catch (error) {
            console.log('Sesion no iniciada');
            this.setState({LoginDialog:true});
        }
        
    }
    handleComment=()=>{
            const comentario={
                articulo:this.props.idarticle,
                comentarios:[{
                    _id:this.auth.getProfile()._id,
                    nombre_usuario:this.auth.getUser().nombre,
                    texto:this.state.comentario,
                }]
            }
            const newcomentario={
                _id:this.auth.getProfile()._id,
                    usuario:this.auth.getUser().nombre,
                    comentario:this.state.comentario,
            }
        if(this.props.comentarios==null){
            this.Requests.add('/calificar/add',comentario).then(response=>{
            console.log(response);
            window.location.reload();
        });
 }
        if(this.props.comentarios){
            this.Requests.update('/calificar/addcomment?_id='+this.props.comentarios._id,newcomentario).then(response=>{
                console.log(response);
                window.location.reload();
            });
        }
            
       
        
    }
}
export default Comentario;