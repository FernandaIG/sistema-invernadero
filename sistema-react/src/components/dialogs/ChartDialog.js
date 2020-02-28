import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Requests from '../../services/Requests';


export default class ChartDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: [[{ x: 0, y: 0 }], [{ x: 0, y: 0 }]]
        };//Para cada arreglo de la grafica se tendran un conjunto de punto "x" y "y"
        this.Requests = new Requests();
    }

    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <div>
                <Button onClick={this.handleClickOpen}>
                    Cambiar gráfica
                    <ArrowDropDownIcon />
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle id="form-dialog-title">Cambiar tipo de graficación</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth>
                            <InputLabel id="grafica">Gráfica</InputLabel>
                            <Select
                                labelId="grafica-dialog-select-label"
                                id="grafica-dialog-select"
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Seleccionar</em>
                                </MenuItem>
                                <MenuItem>Mensual</MenuItem>
                                <MenuItem>Por día</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}