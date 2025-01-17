import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import carroLogo from '../../img/carroicono.jpg';


class MensajeVacio extends Component{


    render(){

        return (
            <Card>
            <CardActionArea component="a" href={'/productos/'}>
              
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {this.props.titulo}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Vea la sección de Productos para empezar a agregar Articulos
                  </Typography>
                </CardContent>
              </CardActionArea>
              
            </Card>
          );
    }
}
export default MensajeVacio;

