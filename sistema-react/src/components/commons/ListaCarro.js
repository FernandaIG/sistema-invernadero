import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';



import { NavLink } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import DeleteIcon from '@material-ui/icons/Delete';

import Button from '@material-ui/core/Button';


import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import AuthService from '../../services/AuthService';

import Requests from '../../services/Requests';


import Grid from '@material-ui/core/Grid';

import '../../css/estilos.css';
import ConfirmDialog from '../dialogs/ConfirmDialog';


class ListaCarro extends Component {

    constructor(props) {
        super(props);
        console.log("Car Begin");
        this.auth = new AuthService();

        this.Requests = new Requests();
    }

    state = {
        data: [],
        valorCanti: []
    };

    render() {

        return (
            <div>

                {

                    this.props.data['detalles'].map((valor, i) => (

                            <div key={i}>

                            <Grid key={i} container spacing={5}>

                                <Grid key={i} item xs={12} sm={6}>
                                    <List key={i}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src={this.state.data[i] ? this.Requests.VerImagen('/articulo/getImage?image=' + this.state.data[i].imagenes) : 'sn'} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={valor.articulo}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="textPrimary"
                                                        >

                                                        </Typography>
                                                        {valor.descripcion.substring(0, 40)}...
                                        </React.Fragment>
                                                }
                                            />
                                        </ListItem>

                                    </List>


                                </Grid>

                                <Grid item xs={12} sm={2}>

                                    <p>

                                    </p>
                                    <p>

                                    </p>
                                    <TextField autoFocus margin="dense"
                                        id={i + 'cantidad'}
                                        key={i}
                                        label='Cantidad'
                                        defaultValue={this.props.data['detalles'][i].cantidad}
                                        value={this.props.data['detalles'][i].cantidad}
                                        //type="number"
                                        onChange={(ev) => { this.valueChanges(i, ev.target.value, this.state.data[i] && this.state.data[i].stock, this.state.data[i] && this.state.data[i]._id) }}
                                        required
                                        InputProps={{
                                            inputComponent: this.NumberFormatCustom,
                                        }}
                                        fullWidth />

                                    {this.props.mensajeCantidad[i] !== 'No hay stock disponible' && <Typography
                                        component="span"
                                        variant="inherit"
                                        color="textSecondary"
                                    >  Disponibles: {this.state.data[i] && this.state.data[i].stock}</Typography>}



                                    {
                                        this.props.mensajeCantidad[i] === 'No hay stock disponible' &&
                                        <Typography
                                            component="span"
                                            variant="inherit"
                                            color="error"
                                        >  Cantidad no válida</Typography>
                                    }
                                </Grid>

                                <Grid item xs={12} sm={2}>
                                    <Typography
                                        component="span"
                                        variant="h5"
                                        color="textPrimary"

                                    >              <p>

                                        </p>
                                        <p>

                                        </p>$ {valor.precio * this.props.data['detalles'][i].cantidad}</Typography>

                                </Grid>
                                <Grid item xs={12} sm={2}>

                                    <p>

                                    </p>
                                    <p>

                                    </p>

                                    {this.props.handleRemove != null &&
                                        (<ConfirmDialog  remove={true}confirmTitle={this.props.confirmTitle} confirmMessage={this.props.confirmMessage} onConfirm={() => this.props.handleRemove(this.state.data[i] ? (this.state.data[i]) : ([]))} />)
                                    }
                                </Grid>


                            </Grid>




                            <Toolbar component="nav" variant="dense" >


                                <NavLink
                                    to={this.state.data[i] ? ('/articulo/' + this.state.data[i]._id) : ('/articulo/')}
                                    key={i + 'articulo'}
                                    style={{ textDecoration: 'none', color: 'blue', fontSize: '16px', }}
                                    activeStyle={{ textDecoration: 'underline' }}
                                >
                                    <ListItem button key={i}>
                                        <Typography
                                            component="span"
                                            variant="caption"
                                            color="initial"
                                        >               Ver Articulo
                            
                                </Typography>

                                    </ListItem>
                                </NavLink>




                                <Grid item xs={12} sm={3}>

                                    {this.state.data[i] &&
                                        (<ListItem button key={i} onClick={() => (this.props.transferir(this.state.data[i], i),
                                            this.props.handleRemove(this.state.data[i] ? (this.state.data[i]) : ([])))}>



                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="primary"
                                            >              {this.props.buttonText}


                                            </Typography>
                                        </ListItem>)

                                    }

                                </Grid>

                            </Toolbar>

                            <Divider variant="fullWidth" component="div" />

                        </div>


                    ))}

                {this.props.data['total'] &&
                    <Grid item xs={12} sm={3}>
                        <Typography
                            component="span"
                            variant="h5"
                            color="textPrimary"
                        >  Productos ({this.props.cantidadTotal}): $ {this.props.data['total']-(this.props.paqueteria==='DHL'?(199):(232))}</Typography>

<Typography
                            component="span"
                            variant="h6"
                            color="textPrimary"
                        >  Paqueteria ({this.props.paqueteria}): $ {(this.props.paqueteria==='DHL'?(199):(232))}</Typography>

<Typography
                            component="span"
                            variant="h4"
                            color="textPrimary"
                        >  Total: $ {this.props.data['total']}</Typography>
            

                    </Grid>}
                    <Divider variant="fullWidth" component="div" />
                <p>

                </p>


            </div>
        );
    }



    NumberFormatCustom(props) {
        const { inputRef, onChange, ...other } = props;

        return (
            <NumberFormat
                {...other}
                getInputRef={inputRef}
                onValueChange={values => {
                    onChange({
                        target: {
                            value: values.value,
                        },
                    });
                }}
                decimalScale='0'
                thousandSeparator
                isNumericString
                prefix=""
            />
        );
    }

    componentDidMount() {
        //this.cargarCantidades();
        console.log('listaCargada');
        this.LoadArticleData();
    }

    valueChanges = (indice, value, cantidad, idarticle) => {


        this.props.handleChangeCantidad(indice, value, cantidad, idarticle);
 




    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.LoadArticleData();
            console.log(this.props.data);
        }
    }



    LoadArticleData = () => {

        console.log('Getting Article');
        const path = '/articulo/query?_id=';
        console.log('from', path);

        this.props.data['detalles'].map((valor, i) => (

            this.Requests.query(path + valor._id).then(response => {
                if (response && response.length !== 0) {// El request no ha devuelto un arreglo vacio
                    let dt = response
                    let stateData = this.state.data.slice();
                    stateData[i] = dt;
                    this.setState({ data: stateData });
                } else {
                    let stateData = this.state.data.slice();
                    stateData[i] = [];
                    this.setState({ data: stateData })
                }
            })

        ));

    }
}





export default (ListaCarro);
