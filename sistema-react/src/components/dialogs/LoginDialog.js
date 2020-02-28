import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withRouter } from "react-router-dom";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class LoginDialog extends Component {
 
  state={
        open:true
  };



render(){

    return (
        <div>
         
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"¡Hola!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
               {this.props.texto?this.props.texto:('Para agregar al carrito, ingresa a tu cuenta')}
               
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleSignIn} color="primary">
                Iniciar Sesion
              </Button>
              <Button onClick={this.handleSignUp} color="primary">
                Crear cuenta
              </Button>

              <Button onClick={this.handleReturn} color="primary">
                Inicio
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
}

handleSignIn=(ev)=>{

    this.props.history.replace('../SignIn');
    
}

handleSignUp=(ev)=>{

    this.props.history.replace('../SignUp');
}
handleClose=(ev)=>{

  this.setState({
    open:false
  })
}

handleReturn=(ev)=>{

  this.props.history.replace('../')
}
  
}
export default withRouter(LoginDialog);