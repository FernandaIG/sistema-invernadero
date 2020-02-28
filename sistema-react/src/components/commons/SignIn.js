import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import AuthService from '../../services/AuthService';

//Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';




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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Auth = new AuthService();
        this.auth = new AuthService();
        this.onStorageChange = this.onStorageChange.bind(this);
        this.state = { auth: this.auth.loggedIn() };//this.state.auth
        window.addEventListener('storage', this.onStorageChange);
    }

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOpenIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Inicio de sesión
                     </Typography>
                    <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={this.handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.handleChange}
                        />
                       
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Ingresar
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <NavLink
                                    to={'/Recuperacion'}
                                    variant="body2"
                                    style={{ textDecoration: 'none', color: '#1565c0' }}
                                >
                                    ¿Has olvidado tu contraseña?
                                </NavLink >
                            </Grid>
                            <Grid item>
                                <NavLink
                                    to={'/SignUp'}
                                    variant="body2"
                                    style={{ textDecoration: 'none', color: '#1565c0' }}
                                >
                                    {"¿No tienes cuenta? Regístrate "}
                                </NavLink>
                            </Grid>
                        </Grid>
                    </form>
                </div>

            </Container>
        );
    }

    handleChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    handleSubmit(ev) {
        ev.preventDefault();
        console.log(this.state);
        this.Auth.login(this.state.email, this.state.password).then(resp => {
            this.props.onAuthChange();
            this.props.history.replace('/');
        }).catch(err => {
            alert(err);
        })
    }

    onAuthChange() {
        this.setState({ auth: this.auth.loggedIn() });
    }

    onStorageChange(ev) {
        this.setState({ auth: this.auth.loggedIn() });
    }

}

export default withStyles(useStyles)(SignIn);