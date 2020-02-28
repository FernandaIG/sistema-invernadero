import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

//Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Requests from '../../services/Requests';



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

class SignUp extends Component {

    constructor(props) {
        super(props);
        console.log("SigUp");
        this.Requests = new Requests();
        //this.handleChange=this.handleChange.bind(this);
    }

    state = {
        nombre: '',
        rol: 'Cliente',
        email: '',
        telefono: '',
        direccion: '',
        password: '',
        usuario: ''

    };

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Regístrate
            </Typography>
                    <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="nombre"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="nombre"
                                    label="Nombre"
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="apellido"
                                    label="Apellidos"
                                    name="apellido"
                                    autoComplete="lname"
                                    onChange={this.handleChangeNombre}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="usuario"
                                    label="Usuario"
                                    name="usuario"
                                    autoComplete="usuario"
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Correo"
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.handleChange}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="direccion"
                                    label="Dirección"
                                    type="direccion"
                                    id="direccion"
                                    autoComplete="direccion"
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="telefono"
                                    label="Teléfono"
                                    type="telefono"
                                    id="telefono"
                                    autoComplete="telefono"
                                    onChange={this.handleChange}
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
                            Regístrate
              </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <NavLink
                                    to={'/SignIn'}
                                    variant="body2"
                                    style={{ textDecoration: 'none', color: '#1565c0' }}
                                >
                                    ¿Ya tienes una cuenta? Ingresa
                  </NavLink>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );

    }


    handleChange = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }


    handleSubmit = (ev) => {
        ev.preventDefault();
        this.setState({
            nombre: this.state.nombre + ' ' + document.getElementById('apellido').value
        })
        console.log(JSON.stringify(this.state));
        this.Requests.add('/usuario/addCliente', this.state).then(resp => {
            //this.props.onAuthChange();
            this.props.history.replace('/');
        }).catch(err => {
            alert(err);
        })
    }
}

export default (withStyles(useStyles)(SignUp));