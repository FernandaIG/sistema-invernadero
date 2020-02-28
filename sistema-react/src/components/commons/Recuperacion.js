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

class Recuperacion extends Component {

    constructor(props) {
        super(props);
        console.log("SigUp");
        this.Requests = new Requests();
        //this.handleChange=this.handleChange.bind(this);
    }

    state = {
        email: ''

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
                        Recuperación de la contraseña
                    </Typography>
                    <br/>
                    <Typography component="p" variant="p">
                        Ingresa tu correo electrónico y en breve se enviara un correo a tu cuenta con la recuperación de la contraseña. 
                    </Typography>
                    <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
                        <Grid container spacing={2}>
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
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Enviar
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
        
        console.log(JSON.stringify(this.state));
        this.Requests.update('/usuario/recuperacion', this.state).then(resp => {
            //this.props.onAuthChange();
            this.props.history.replace('/');
        }).catch(err => {
            alert(err);
        })
    }
}

export default (withStyles(useStyles)(Recuperacion));