import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Markdown from './Markdown';
import { withStyles } from '@material-ui/core/styles';
import Requests from '../../services/Requests';



//Componentes
import Footer from './Footer';
import Menu from './Menu';
import Header from './Header';
import Carrusel from './Carrusel';
import Cards from './Cards';

/**
 * import post1 from './blog-post.1.md';
import post2 from './blog-post.2.md';
import post3 from './blog-post.3.md';

 */

const useStyles = theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.white,
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(8),
    padding: theme.spacing(6, 0),
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

class Main extends Component {

  constructor(props) {

    super(props);
    console.log("Inicio");

    this.Requests = new Requests();
  }

state={

data: [],


};


  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <main>
            {/* Main featured post */}
            <Carrusel />
            {/* End main featured post */}
            {/* Sub featured posts */}
            <Typography variant="h5" gutterBottom>
                  Articulos Destacados
                </Typography>
            <Cards articulos={this.state.data[0]}/>
            {/* End sub featured posts */}
            <Grid container spacing={5} className={classes.mainGrid}>
              {/* Main content */}
            
              {/* End main content */}
              {/* Sidebar */}


              
              {/* <Grid item xs={12} md={4}>
                <Paper elevation={0} className={classes.sidebarAboutBox}>
                  <Typography variant="h6" gutterBottom>
                    About
                  </Typography>
                  <Typography>
                    Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit
                    amet fermentum. Aenean lacinia bibendum nulla sed consectetur.
                  </Typography>
                </Paper>
                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                  Archives
                </Typography>
                {archives.map(archive => (
                  <Link display="block" variant="body1" href="#" key={archive}>
                    {archive}
                  </Link>
                ))}
                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                  Social
                </Typography>
                {social.map(network => (
                  <Link display="block" variant="body1" href="#" key={network}>
                    {network}
                  </Link>
                ))}
              </Grid> */}
              {/* End sidebar */}
            </Grid>
          </main>
        </Container>
      </React.Fragment>
    );
  }

  componentDidMount(){
    this.loadData();
  }

  
  loadData() {

    console.log('Getting list');
    const path = '/articulo/listCalificacion';
    console.log('from', path);
    return this.Requests.list(path).then(response => {
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
}

export default withStyles(useStyles, { withTheme: true })(Main);