import React, { Component } from 'react';

import Requests from '../../services/Requests';


//Material UI
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';


const useStyles = theme => ({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  }
});



class Cards extends Component {

  constructor(props) {
    super(props);
    console.log("Begin");
    this.Requests = new Requests();

}

  state={
      data:[],
      numRan:0
  }
  render() {
    const { classes } = this.props;

    const datos = this.state.data[0];
    
    
    return (
      <Grid container spacing={4}>
       
        {
        datos&&(datos.slice(this.state.numRan,(this.state.numRan+4)).map((dato,i) => (
          <Grid item key={i} xs={12} md={6}>
            <CardActionArea component="a" href={'/articulo/'+dato._id}>
              <Card className={classes.card}>
                <div className={classes.cardDetails}>
                  <CardContent>
                    <Typography component="h2" variant="h6">
                      {dato.nombre}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {'$'+dato.precio_venta}
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      Ver más...
                        </Typography>
                  </CardContent>
                </div>
                <Hidden xsDown>
                  <CardMedia
                    className={classes.cardMedia}
                    image={'http://localhost:3000/api/articulo/getImage?image='+dato.imagenes}                    title="Image title"
                  />
                </Hidden>
              </Card>
            </CardActionArea>
          </Grid>
        )))
  }

  {
        this.props.articulos&&(this.props.articulos.slice(0,4).map((dato,i) => (
          <Grid item key={i} xs={12} md={6}>
            <CardActionArea component="a" href={'/articulo/'+dato._id}>
              <Card className={classes.card}>
                <div className={classes.cardDetails}>
                  <CardContent>
                    <Typography component="h2" variant="h6">
                      {dato.nombre}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {'$'+dato.precio_venta}
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      Ver más...
                        </Typography>
                  </CardContent>
                </div>
                <Hidden xsDown>
                  <CardMedia
                    className={classes.cardMedia}
                    image={this.Requests.VerImagen('/articulo/getImage?image='+dato.imagenes)}                    title="Image title"
                  />
                </Hidden>
              </Card>
            </CardActionArea>
          </Grid>
        )))
        
        }
      </Grid>
    );
  }


  componentDidMount() {
    console.log("Component cards loaded");
    if(this.props.categoriaArticle){
      this.loadData();
    }
    
     
  }

//   componentDidUpdate(prevProps) {
//     if (this.props.categoriaArticle !== prevProps.categoriaArticle) {

//     }
// }

  getRandomInt() {
    const dato=this.state.data[0];
    
    if(dato){
      const numMax=Object.keys(dato).length;    
      const random= Math.floor(Math.random() * (numMax - 0)) + 0;
     
      return random;
    }
    else{
      
      return 0;
    }
 }

loadData() {
    console.log('Getting list');
    const path = '/articulo/listCategoria?categoria=';
    console.log('from', path);
    console.log(this.props.categoriaArticle);
    return this.Requests.listCategoria(path+this.props.categoriaArticle).then(response => {
        console.log(response);
        if (response && response.message != 'Ocurrio un error') {// El request no ha devuelto un arreglo vacio
            let dt = response
            console.log(dt);
            let stateData = this.state.data.slice();
            stateData[0] = dt;
            this.setState({ data: stateData });
            console.log(this.state.data);
            this.setState({numRan:this.getRandomInt()})
            console.log(this.state.numRan);
        } else {
            let stateData = this.state.data.slice();
            stateData[0] = [];
            this.setState({ data: stateData })
        }
    });
}
}

export default withStyles(useStyles, { withTheme: true })(Cards);