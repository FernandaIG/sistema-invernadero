import React, { Component } from 'react';

//Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Requests from '../../services/Requests';
import AuthService from '../../services/AuthService';


const useStyles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class MiCuenta extends Component {

    constructor(props) {
        super(props);
        console.log("MiCuenta Begin");
        this.Requests = new Requests();
        this.auth = new AuthService();
    }

    state = {
        data: {}
    };

    render() {
        const { classes } = this.props;
        const fields = this.state.data;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Editar Perfil
                    </Typography>
                    <br />
                    {
                        this.state.data &&
                        <form onSubmit={this.handleSubmit} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography>
                                        Nombre
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        multiline="true"
                                        id="nombre"
                                        key="nombre"
                                        name="nombre"
                                        type="text"
                                        defaultValue={fields.nombre}
                                        onChange={(ev) => { this.valueChanges('nombre', ev.target.value) }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        Usuario
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        multiline="true"
                                        id="usuario"
                                        key="usuario"
                                        name="usuario"
                                        type="text"
                                        defaultValue={fields.usuario}
                                        onChange={(ev) => { this.valueChanges('usuario', ev.target.value) }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        Correo electrónico
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        multiline="true"
                                        id="email"
                                        key="email"
                                        name="email"
                                        type="text"
                                        defaultValue={fields.email}
                                        onChange={(ev) => { this.valueChanges('email', ev.target.value) }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        Contraseña
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="password"
                                        type="password"
                                        id="password"
                                        onChange={(ev) => { this.valueChanges('password', ev.target.value) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        Dirección
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        multiline="true"
                                        id="direccion"
                                        key="direccion"
                                        name="direccion"
                                        type="text"
                                        defaultValue={fields.direccion}
                                        onChange={(ev) => { this.valueChanges('direccion', ev.target.value) }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        Teléfono
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        multiline="true"
                                        id="telefono"
                                        key="telefono"
                                        name="telefono"
                                        type="text"
                                        defaultValue={fields.telefono}
                                        onChange={(ev) => { this.valueChanges('telefono', ev.target.value) }}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Editar
                                </Button>
                        </form>
                    }
                </div>
            </Container>
        );

    }

    componentDidMount() {
        console.log("Component loaded");
        this.loadData();

    }

    valueChanges = (property, value) => {
        let data = this.state.data;
        data[property] = value;
        this.setState({ data });
      }

    handleSubmit = (ev) => {
        ev.preventDefault();
        // console.log('s', this.state);
        // const userType = this.auth.getUser()._id;
        // console.log('userType', userType);
        const data = this.state.data;
        console.log('state edit', this.state.data);
        console.log('Entro a HandleEdit para editar el perfil de usuario');

        let path = '/usuario/updateCliente';
        this.Requests.update(path, data).then(res => {
            this.loadData();

        }).catch(err => {
            alert(err);
        })

        // this.props.history.replace('/');
    }

    loadData() {

        console.log('Getting Query');
        const path = '/usuario/queryCliente?_id=';
        const id = this.auth.getUser()._id;
        // console.log('id', id);

        return this.Requests.query(path + id).then(response => {
            // console.log('resp', response);
            this.setState({ data: response });
            console.log('state', this.state.data);
        });
    }
}

export default (withStyles(useStyles)(MiCuenta));