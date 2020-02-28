import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export default class Aviso extends Component {



    render() {

        return (
            <React.Fragment>

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    key={`${'bottom'},${'right'}`}
                    open={this.props.aviso}
                    onClose={this.handleClose}
                    message={this.props.mensaje}
                    autoHideDuration={6000}

                />
            </React.Fragment>

        );



    }
    handleClose = () => {
        this.props.handleClose();
    }
}