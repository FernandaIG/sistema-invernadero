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

class Nosotros extends Component {

    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();

        this.ids = ['usuario', 'mision', 'vision', 'empresa', 'compromiso'];
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

                    <div>
                        {this.state.data.map((dato, i) => (
                            <div>
                                <br />
                                <div className={classes.heroContent}>
                                    <br />
                                    <Container maxWidth="sm">
                                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                                            ¿Quiénes somos?
                                        </Typography>
                                        <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                                            {dato[0].empresa}
                                        </Typography>
                                    </Container>
                                </div>
                                <br />
                                <br />
                                <div className={classes.heroContent}>
                                    <br />
                                    <Container maxWidth="sm">
                                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                                            Misión
                                     </Typography>
                                        <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                                            {dato[0].mision}
                                        </Typography>
                                    </Container>
                                </div>
                                <br />
                                <br />
                                <div className={classes.heroContent}>
                                    <br />
                                    <Container maxWidth="sm">
                                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                                            Visión
                                     </Typography>
                                        <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                                            {dato[0].vision}
                                        </Typography>
                                    </Container>
                                </div>
                                <br />
                                <br />
                                <div className={classes.heroContent}>
                                    <br />
                                    <Container maxWidth="sm">
                                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                                            Responsabilidad
                                     </Typography>
                                        <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                                            {dato[0].compromiso}
                                        </Typography>
                                    </Container>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>
            </React.Fragment>
        );
    }


    componentDidMount() {
        console.log("Component loaded");
        this.loadData();
    }


    loadProducts() {
        const datos = this.state.data[0];
        return datos;
    }

    loadData() {
        console.log('Getting list');
        const path = '/configuracion/list';
        const ids = this.ids;
        console.log('from', path);
        return this.Requests.list(path).then(response => {
            console.log("datos conf", response);
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
                console.log("state", this.state.data);
            } else {
                let stateData = this.state.data.slice();
                stateData[0] = [];
                this.setState({ data: stateData })
            }
        });
    }

}

export default withStyles(useStyles, { withTheme: true })(Nosotros);