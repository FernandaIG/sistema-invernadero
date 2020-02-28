import React, { Component } from "react"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';

import AuthService from '../../services/AuthService';
import LoginDialog from '../../components/dialogs/LoginDialog';
import Requests from '../../services/Requests';

import { makeStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';

import ListaCarro from '../commons/ListaCarro';
import Transfer from '../../services/Transfer';
import Pago from '../sitioWeb/FormularioPago';
import MensajeVacio from '../dialogs/Vacio';


import '../../css/estilos.css';


class Carrito extends Component{

    constructor(props) {

        super(props);
        console.log("Begin CarShop");
        this.auth = new AuthService();
       this.Transfer= new Transfer();

        this.Requests = new Requests();
      }

state={
  cantidadTotal:[],
  pago:true,
  mensajeCanti:[],
    activeTab:0,
    data: [],
        car:{},
        paqueteria:'DHL',

};



    
    render(){
        if(!this.auth.loggedIn()){
            return(
                <LoginDialog>

                </LoginDialog>
            );
        }

        else{
            return(
                <React.Fragment >
                <CssBaseline />
                <Container maxWidth="lg">
                  
                  {/* <Typography component="div" style={{ backgroundColor: '#dcedc8', height: '100%' }} /> */}
                   
                    <Tabs className='separadorTab' value={this.state.activeTab} onChange={this.handleChange}>
                    <Tab label={this.state.cantidadTotal[0]?('Carrito('+this.state.cantidadTotal[0]+')'):('Carrito(0)')}/>
                    <Tab label={this.state.cantidadTotal[1]?('Lista Deseos('+this.state.cantidadTotal[1]+')'):('Lista Deseos(0)')}/>
                </Tabs>

                
                <Divider variant="fullWidth" />
              
                {
                    this.state.activeTab === 0 &&
                    (<div>
                      
                      {
                        this.state.data[0]&&
                        (<div>
                        
                        <ListaCarro data={this.state.data[0]}
                                    paqueteria={this.state.paqueteria}
                                    transferir={this.Transferir}
                                    cantidadTotal={this.state.cantidadTotal[0]}
                                    handleRemove={this.handleRemove}
                                    confirmTitle="Eliminar Articulo" 
                                    //cantidades={this.state.cantidades}
                                    mensajeCantidad={this.state.mensajeCanti}
                                    handleChangeCantidad={this.handleChangeCantidad}
                            confirmMessage="Estás seguro de eliminar este artículo?"
                            buttonText="Guardar para despues"

                        >
                      
                        </ListaCarro>
                        
                      { this.state.pago&& <Pago
                        total={this.state.data[0]['total']}
                        handleToken={this.handleToken}
   >
   
                       </Pago>}

                       {
                        this.state.data[0].detalles.length==0&&
                        <div>
                            <MensajeVacio
                            titulo='Carrito vacío'
                            />

                          </div>
                      }
                       
                       
                       </div>)

                       
                      }

                      {
                        this.state.data[0]==null&&
                        <div>
                            <MensajeVacio
                            titulo='Carrito vacío'
                            />

                          </div>
                      }

                      
                    </div>)

   
                }



                {
                    this.state.activeTab === 1 &&
                    (<div>

                      {                        this.state.data[1]&&(


                        <ListaCarro data={this.state.data[1]}
                                    paqueteria={this.state.paqueteria}
                                    transferir={this.Transferir}
                                    cantidadTotal={this.state.cantidadTotal[1]}

                                    handleRemove={this.handleRemove}
                                    confirmTitle="Eliminar Articulo" 
                                  //  cantidades={this.state.cantidades}
                                    mensajeCantidad={this.state.mensajeCanti}
                                    handleChangeCantidad={this.handleChangeCantidad}

                            confirmMessage="Estás seguro de eliminar este artículo?"
                            buttonText="Agregar al carrito"
                        >

                        </ListaCarro>)                          

                      }

{
                        this.state.data[1].detalles.length==0&&
                        <div>
                            <MensajeVacio
                            titulo='Lista vacía'
                            />

                          </div>
                      }

{
                        this.state.data[1]==null&&
                        <div>
                            <MensajeVacio
                            titulo='Lista vacía'
                            />

                          </div>
                      }
                      
                    </div>)
                }
                </Container>
              </React.Fragment>
            );
        }
    }
    handleToken=(token, addresses) => {
      console.log({token,addresses});
      //peticion Ajax
       this.Requests.checkout('/venta_en_linea/checkout?_id='+this.state.data[0]._id,token).then(res=>{
          console.log(res);
          let Compra=res;
          this.Requests.update('/venta_en_linea/updatedatosenvio?_id='+Compra._id,addresses);
          this.Requests.update('/venta_en_linea/updatedatosenvio?_id='+Compra._id,addresses);
          this.Requests.delete('/carrito/remove',this.state.data[0]._id);
          window.location.reload();
        });
        
  
  }
    handleChange=(event, activeTab)=>{
        this.setState({
            activeTab
        },this.loadCarListData)
    }

    handleChangeCantidad=(indice, value,cantidad,idarticle)=>{
    
this.setState({pago:false});
if(value>=0&&value<=cantidad){
  let mensaje=this.state.mensajeCanti.slice();
  mensaje[indice]='stock disponible'
  this.setState({mensajeCanti:mensaje});
  this.setState({pago:true});

        //Sacar index del articulo
        if(this.state.data[this.state.activeTab]){

        let indx= this.state.data[this.state.activeTab]['detalles'].findIndex(el=>el._id==idarticle);

        if(indx!=-1){
            //cambiamos la cantidad del articulo
                    //this.state.data[this.state.activeTab]['detalles'][indx].cantidad=value;
                    let cantidadesnuevas=this.state.data.slice();
                        cantidadesnuevas[this.state.activeTab]['detalles'][indx].cantidad=(value);

                        this.setState({data:cantidadesnuevas});
                    this.CargarCantidades(this.state.activeTab)
        }
        //hacemos el request al servidor de actualizar la cantidad

        //si esta en lista actualiza de la lista
        if(this.state.activeTab===1){
            this.Requests.update('/lista/updacantidad/?_id='+ this.state.data[1]._id,this.state.data[1]);
           

        }
        //si esta en el apartado de carro actualiza del carro
        else{
                    this.Requests.update('/carrito/updacantidad/?_id='+ this.state.data[0]._id,this.state.data[0]).then(this.CalTotal());

        }

      }
        }

        if(value==0){
          this.setState({pago:false});
          let mensaje= this.state.mensajeCanti.slice();
          mensaje[indice]='No hay stock disponible'
          this.setState({mensajeCanti:mensaje});
      
        }
    }
     addZero(i) {
      if (i < 10) {
          i = '0' + i;
      }
      return i;
  }

    fechaActual(){
      var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth()+1;
        var yyyy = hoy.getFullYear();
        
        dd = this.addZero(dd);
        mm = this.addZero(mm);
 
        return dd+'/'+mm+'/'+yyyy;
    }

//Funcion para eliminar articulo del state
    eliminardelState(indice,idarticle){
      console.log(this.state.data[indice]);
      let indx= this.state.data[indice]['detalles'].findIndex(el=>el._id==idarticle);
      console.log(indx);
      if(indx!=-1){
        this.state.data[indice]['detalles'].splice(indx,1)
        var nuevosDatos=this.state.data.slice();
        this.setState({data:nuevosDatos});
        console.log(this.state.data[indice]);

      }
      


    }

    handleRemove=(articulo)=>{
        const activeTab= this.state.activeTab;

        if(activeTab===0){
          //Esta en el apartado de carrito podra eliminar articulos del carro
          if(this.state.data[0]){
            
            this.Requests.update('/carrito/updatedetalles/?_id='+this.state.data[0]._id,articulo);
            window.location.reload();
            
            
          }

        }
        if(activeTab===1){
          //Esta en el apartado de carrito podra eliminar articulos de la lista de deseos
          if(this.state.data[1]){

             this.Requests.update('/lista/updatedetalles/?_id='+this.state.data[1]._id,articulo).then(this.loadListData());
            
            
          }

        }
    }
//Calcular el total del state y mandarlo a la base de datos
    CalTotal=()=>{
        //le damos al total el valor de 0 para poder sumar todas los precios de los productos en el arreglo de detalles
            this.state.data[0]['total']=0;
        this.state.data[0]['detalles'].map(element=>{

          this.state.data[0].total+=(element.precio*element.cantidad);
      });
      if(this.state.paqueteria==='DHL'){
        this.state.data[0].total+=199;
      }

      if(this.state.paqueteria==='Estafeta'){
        this.state.data[0].total+=232;
      }
     this.Requests.update('/carrito/updatetotal/?_id='+ this.state.data[0]._id,this.state.data[0]);
    }



    componentDidMount(){

      if(this.auth.loggedIn()){
        this.loadCarData(true);
        this.loadListData();
        
    }
    }

    Transferir=(articulo, indice, userType = this.auth.getUser()._id)=>{
       const activeTab = this.state.activeTab;
       if (activeTab==0){
         //Si esta en el apartado de carrito añadira a la lista de deseos
      if(!this.state.data[1]){
          const lista=this.Transfer.CrearLista(articulo,userType);
          this.Requests.add('/lista/add', lista);
         }
         else{
           console.log('La lista ya esta inicializada');
           let indx= this.state.data[1]['detalles'].findIndex(el=>el._id==articulo._id);
            console.log(articulo._id);
            console.log(indx);
                  
              if(!Array.isArray(this.state.data[1].detalles)){
                  this.state.data[1].detalles=[];
              }
              else{
                    if(indx==-1){
                      console.log('No esta este articulo en la lista');
                      
                        const detalle=this.Transfer.pushItem(articulo,this.state.data[0].detalles[indice].cantidad);
                        this.Requests.update('/lista/update/?_id='+this.state.data[1]._id,detalle).then(this.loadListData());
                        
                    }
              }
         }

       }

       //Si esta en el apartado de Lista añadira al carrito

       if (activeTab==1){
        if(!this.state.data[0]){
          const lista=this.Transfer.CrearLista(articulo,userType);
          this.Requests.add('/carrito/add', lista);
         }
         else{
           console.log('El Carro ya esta inicializada');
           let indx= this.state.data[0]['detalles'].findIndex(el=>el._id==articulo._id);
            
                  
              if(!Array.isArray(this.state.data[1].detalles)){
                  this.state.data[0].detalles=[];
              }
              else{
                    if(indx==-1){
                      console.log('No esta este articulo en el carro');
                        const detalle=this.Transfer.pushItem(articulo,this.state.data[1].detalles[indice].cantidad);
                        this.Requests.update('/carrito/update/?_id='+this.state.data[0]._id,detalle).then(this.loadCarData(true));

                    }
              }
         }
     }

      
       
    }

    CargarCantidades(indice){
                        //Cargar cantidades

                       // let can=this.state.cantidades.slice();
                        console.log(this.state.data[indice]);
                       if(this.state.data[indice]){
                        let cantidadTotal=this.state.cantidadTotal.slice();
                        cantidadTotal[indice]=0;
                         this.state.data[indice]['detalles'].map((valor,i)=>{
                     
                                 
                                // can[i]=valor.cantidad;
                                                        //Cargar cantidadesTotales
                                    
                                 cantidadTotal[indice]+=parseInt(valor.cantidad);
                                 });
                                 //this.setState({cantidades:can});
                                this.setState({cantidadTotal});
                                if(cantidadTotal[0]>10){
                                      this.setState({paqueteria:'Estafeta'});

                                }
                                if(cantidadTotal[0]<=10){
                                  this.setState({paqueteria:'DHL'});

                                }
                              }
    }

    loadCarListData() {
      const userType = this.auth.getUser()._id;


      console.log('Getting list');
        const activeTab = this.state.activeTab;
        const ids = this.ids;
        const path = activeTab===0?'/carrito/query?usuario=':'/lista/query?usuario=';
        console.log('from',path);
        return this.Requests.list(path+userType).then(response=>{
            if(response.message!='El registro no existe'){//  El request ha regresado un mensaje de que el registro no existe
                let dt = response;
                let stateData = this.state.data.slice();

                stateData[activeTab] = dt;
                this.setState({data:stateData});




            }else{
                
            }
        });
  }

  loadCarData(actTotal=false) {
    const userType = this.auth.getUser()._id;


    console.log('Getting list');
      const activeTab = this.state.activeTab;
      const ids = this.ids;
      const path = '/carrito/query?usuario=';
      console.log('from',path);
      return this.Requests.list(path+userType).then(response=>{
          if(response.message!='El registro no existe'){// El request ha regresado un mensaje de que el registro no existe
              let dt = response;
              let stateData = this.state.data.slice();
              stateData[0] = dt;
              this.setState({data:stateData});
           
              this.CargarCantidades(0);
              
              if(actTotal==true){
                this.CalTotal();   
             this.setState({pago:true});


              }
          }else{
            
          }
      });
    }
      loadListData() {
        const userType = this.auth.getUser()._id;
  
  
        console.log('Getting list');
          const activeTab = this.state.activeTab;
          const ids = this.ids;
          const path = '/lista/query?usuario=';
          console.log('from',path);
          return this.Requests.list(path+userType).then(response=>{
              if(response.message!='El registro no existe'){// El request no ha devuelto un arreglo vacio
                  let dt = response;
                  let stateData = this.state.data.slice();
  
                  stateData[1] = dt;
                  this.setState({data:stateData});
                  this.CargarCantidades(1);

              }else{
                 
              }
          });
    }

 

}
export default (Carrito);
