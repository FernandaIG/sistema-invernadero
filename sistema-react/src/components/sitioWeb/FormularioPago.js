import React, {Component} from 'react';
//import {CardElement, injectStripe} from 'react-stripe-elements';
import StripeCheckout from 'react-stripe-checkout';
import Requests from '../../services/Requests';
import carroLogo from '../../img/carroicono.jpg';
import auth from '../../services/AuthService';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';



class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.Requests = new Requests();
    this.auth = new auth();

  }

  

  render() {
    return (
      <div>
         <StripeCheckout
      stripeKey="pk_test_JoSVGo8vz0AppJyIvneJVQbf00GlUaL6Io"
      token={this.handleToken}
      amount={this.props.datos?(((this.props.datos.precio_venta*this.props.cantidad)+(this.props.paqueteria==='DHL'?199:232))*100):((this.props.total)*100)}
      name={this.props.datos?(this.props.datos.nombre):('Varias compras')}
      billingAddress
      currency="MXN"
      image={this.props.datos ? (this.Requests.VerImagen('/articulo/getImage?image='+this.props.datos.imagenes)):(carroLogo)}
      shippingAddress
      >
         <Button
        variant="contained"
        color="primary"
        size="large"
        className = "btn btn-primary"
        //startIcon={<SaveIcon />}
      >
        Realizar compra
      </Button>

      </StripeCheckout>


      </div>
     
    );
  }

  handleToken=(token, addresses) => {
    // console.log({token,addresses});
    // //peticion Ajax
    //  this.Requests.checkout('/articulo/checkout?producto='+this.props.datos._id,token).then(res=>{
    //     console.log(res);
    //   });
    this.props.handleToken(token,addresses);

}
}

export default (CheckoutForm);