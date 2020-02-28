import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, IconButton, Typography, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import NewIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';
import EmailIcon from '@material-ui/icons/Email';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

export default class ConfirmDialog extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  valuesChanges = (value) => {
    let form = this.state.form;
    form = value;
    this.setState({ form });

  };

  render() {
    return (
      <span>
        {this.props.remove &&
          <IconButton onClick={this.handleClickOpen}>
            <DeleteIcon />
          </IconButton>
        }
        {this.props.email &&
          <IconButton onClick={this.handleClickOpen}>
            <EmailIcon />
          </IconButton>
        }
        {this.props.pdf &&
          <IconButton onClick={this.handleClickOpen}>
            <PdfIcon />
          </IconButton>
        }
        {this.props.disable &&
          <IconButton onClick={this.handleClickOpen}>
            <RemoveCircleIcon />
          </IconButton>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          {this.props.remove &&
            <DialogTitle id="form-dialog-title">{this.props.confirmTitle}</DialogTitle>
          }
          {this.props.email &&
            <DialogTitle id="form-dialog-title">{this.props.emailTitle}</DialogTitle>
          }
          {this.props.pdf &&
            <DialogTitle id="form-dialog-title">{this.props.pdfTitle}</DialogTitle>
          }
          {this.props.disable &&
            <DialogTitle id="form-dialog-title">{this.props.disableTitle}</DialogTitle>
          }
          {this.props.remove &&
            <DialogContent>
              {this.props.confirmMessage}
            </DialogContent>
          }
          {this.props.email &&
            <DialogContent>
              {this.props.emailMessage}
            </DialogContent>
          }
          {this.props.pdf &&
            <DialogContent>
              {this.props.pdfMessage}
            </DialogContent>
          }
          {this.props.disable &&
            <DialogContent>
              {this.props.disableMessage}
            </DialogContent>
          }
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
          </Button>
            <Button onClick={() => { this.handleClose(); this.props.onConfirm(this.state.form)}} color="primary">
              Confirmar
          </Button>
          </DialogActions>
        </Dialog>
      </span>
    )
  }
}