import React, { Component } from 'react';
import TableConsult from './commons/TableConsult';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import { Button, IconButton, Typography, Select, MenuItem, InputLabel, FormControl, Menu } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AuthService from './../services/AuthService';
import Requests from '../services/Requests';
import NewDialog from './dialogs/NewDialog';
import { stat } from 'fs';
import Aviso from './dialogs/snackbar';



class VentaEnLinea extends Component {


    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);

        this.headers = [
            ['Usuario', 'Descripción', 'Importe', 'Comisión', 'Neto', 'Paquetería', 'Número de Guía', 'Estado'],
            ['Nombre', 'Email', 'Teléfono', 'Dirección', 'Estado']];
        this.ids = [
            ['usuario', 'descripcion', 'importe', 'comision', 'neto', 'paqueteria', 'numero_guia', 'estado']
            , ['nombre', 'email', 'telefono', 'direccion', 'estado'],
            ['nombre']
        ];//Nombre de un articulo para lista de ingresos
    }

    state = {
        activeTab: 0,
        data: [],
        listQuery: '',
        aviso:false,
        mensaje:''

    };

    handleChange = (event, activeTab) => {
        this.setState({ activeTab, listQuery: '' }, this.loadData);//Al cambiar de pestaña se hace peticion del nuevo valor del data
    };

    render() {
        const activeTab = this.state.activeTab;
        const headers = this.headers[activeTab];
        const ids = this.ids[activeTab];
        return (
            <div>
                <div>
                <Aviso mensaje={this.state.mensaje}
                handleClose={this.handleClose}
                aviso={this.state.aviso}
               ></Aviso>
                    <form onSubmit={(ev) => ev.preventDefault()}>
                        <TextField
                            placeholder="Buscar..."
                            style={{ backgroundColor: 'rgba(247, 249, 249)' }}
                            value={this.state.listQuery}
                            onChange={(ev) => this.setState({ listQuery: ev.target.value })}
                        >
                        </TextField>
                        <Button
                            onClick={() => this.loadData()}
                            type="submit"
                        >
                            <SearchIcon />
                        </Button>
                    </form>
                </div>
                <Tabs value={this.state.activeTab} onChange={this.handleChange}>
                    <Tab label='Ventas En línea' />
                    <Tab label='Clientes' />
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        {/* { <NewDialog 
                            register={this.handleRegister} 
                            title='Ventas' 
                            fields={
                                {
                                    persona:{type:"Select",options:this.state.data[1]?this.state.data[1].map(el=>({id:el._id,value:el.nombre})):[]},
                                    tipo_comprobante:{type:"Select",options:[{id:"Factura",value:"Factura"},{id:"Ticket",value:"Ticket"}]},
                                    serie_comprobante:{type:'TextField'},
                                    num_comprobante:{type:'TextField'},
                                    impuesto:{type:'TextField'},
                                    detalles:{type:'ShopList',options:this.state.data[2]?this.state.data[2].map(el=>({id:el._id,value:el.nombre})):[],discount:true}
                                }
                            }
                            key="tab1"/> } */}
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={this.handleOnEdit}
                            isDetailView={true}
                            handleSend={this.handleSend}
                            emailTitle="Enviar número de guía"
                            emailMessage="¿Desea enviar el número de guía por correo electrónico?"
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Anular Venta"
                            confirmMessage="Estas seguro de anular esta venta?"
                            propertiesToEdit={{
                                numero_guia:{type:"Guia", label: 'Número de Guía'}
                            }}
                            propertiesToRead={
                                {
                                    usuario: { type: "Read", as: 'Cliente' },
                                    numero_guia: { type: "Read", as: 'Número de guía' },
                                    comision: { type: "Read", as: 'Comisión' },
                                    importe: { type: "Read", as: 'Importe' },
                                    detalles: { type: "Read", as: 'Productos', isList: true },
                                    datosEnvio: { type: "Read", as: 'Productos', isDetalle: true }
                                }
                            }
                            editTitle={'Ingresar / Modificar número de guia '} />
                    </div>)
                }
                {
                    this.state.activeTab === 1 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nuevo cliente'
                            key="tab2"
                            fields={
                                {
                                    nombre: { type: 'TextFieldR' },
                                    tipo_documento: { type: "Select", options: [{ id: 'DNI', value: 'DNI' }, { id: 'RUC', value: 'RUC' }, { id: 'CEDULA', value: 'CEDULA' }] },
                                    num_documento: { type: "TextField" },
                                    direccion: { type: "TextField" },
                                    telefono: { type: "Number" },
                                    email: { type: "Email" }
                                }
                            } />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar artículo"
                            confirmMessage="Estás seguro de desactivar/activar este artículo?"
                            propertiesToEdit={
                                {
                                    nombre: { type: 'TextFieldR' },
                                    email: { type: 'Email' },
                                    telefono: { type: "TextField" },
                                    direccion: { type: "TextField" },
                                }
                            }
                            editTitle={'Editar Cliente'} />
                    </div>)
                }
            </div>
        )
    }
    
    handleClose=()=>{
        this.setState({aviso:false});
    }

    handleSwitchActivate(id) {
        const pathQuery = this.state.activeTab === 0 ? '/venta_en_linea/query?_id=' : '/persona/query?_id=';
        this.Requests.query(pathQuery + id).then(response => {
            //Actualizar tabla activa
            const pathActDeactivate = (this.state.activeTab === 0 ? '/venta_en_linea/' : '/persona/') + ((response.estado && response.estado == 1) ? "deactivate" : "activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate, id).then(response => {
                this.loadData();
            })
        });
    }

     //Metodo que envia la guia por correo electronico 
     handleSend(data) {
        console.log("Entro a handleSend");
        console.log('id', data._id);
        console.log(data);
        const path = '/venta_en_linea/send';
        this.Requests.send(path, data).then(response => {
            console.log(response);
            if(response.message==='Correo enviado'){
               this.setState({mensaje:'Correo enviado con número de guía',aviso:true});
            }
            else{
                this.setState({mensaje:'Error al enviar correo electrónico',aviso:true});
             }
        });
    }

    handleOnEdit(data) {
        const path = this.state.activeTab === 0 ? '/venta_en_linea/update' : '/persona/update';
        if (this.state.activeTab === 1) {
            data['tipo_persona'] = "Cliente";
        }
        return this.Requests.update(path, data).then(response => {
             if (response.message === 'Ocurrio un error') {
                alert('Ocurrio un error verifique sus datos');
                return response.message;

            }
            else{
                this.loadData();
            }
        });
    }

    handleRegister(data) {
        const path = this.state.activeTab === 0 ? '/venta_en_linea/add' : '/persona/add'
        if (this.state.activeTab === 1) {
            data["tipo_persona"] = 'Cliente';
        } else {
            //Necesario agregar id del usuario que registra el ingreso
            data['usuario'] = this.Requests.AuthSrv.getProfile()._id;
        }

        console.log("Ventaaaaa" + JSON.stringify(data));
        return this.Requests.add(path, data).then(response => {
            console.log(response);
            if(response.message==='Ocurrio un error'){
                alert('Hubo un problema al intentar registrar verifica tus datos');
                return response.message;
            }  
              else{
                      this.loadData();
  
              }
        }).catch(error => {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });;
    }

    componentDidMount() {
        console.log("Component loaded");
        this.loadData();
        this.loadInitialData('/persona/listClientes', 1);
        this.loadInitialData('/articulo/list', 2);
    }

    loadInitialData(path, index) {
        let ids = this.ids[index];
        return this.Requests.list(path).then(response => {
            if (response && response.length !== 0) {
                let dt = response;
                dt.map((el, i) => {
                    let filterProperties = [];
                    filterProperties[i] = {};
                    ids.forEach(key => {
                        if (el[key]._id) {
                            el[key] = "";
                        }
                        filterProperties[i][key] = el[key];
                    })
                    return filterProperties;
                })
                let stateData = this.state.data.slice();
                stateData[index] = dt.slice();
                this.setState({ data: stateData });
            } else {
                let stateData = this.state.data.slice();
                stateData[index] = [];
                this.setState({ data: stateData });
            }
        })
    }

    loadData() {
        console.log('Getting list');
        const activeTab = this.state.activeTab;
        const ids = this.ids;
        const path = activeTab === 0 ? '/venta_en_linea/list' : '/persona/listClientes';
        console.log('from', path);
        return this.Requests.list(path, this.state.listQuery).then(response => {
            console.log(response);
            if (response && response.length !== 0) {// El request no ha devuelto un arreglo vacio
                let dt = response;
                dt.map((el, i) => {
                    let filterProperties = [];//Propiedades de interes
                    filterProperties[i] = {};//Inicializar el objeto para cada elemento del arreglo
                    ids[activeTab].forEach(key => {
                        if (el[key]._id) {
                            el[key] = el[key].nombre;
                        }
                        filterProperties[i][key] = el[key];
                    })
                    return filterProperties;
                });
                console.log(dt);
                let stateData = this.state.data.slice();
                stateData[activeTab] = dt.slice();
                this.setState({ data: stateData });
            } else {
                let stateData = this.state.data.slice();
                stateData[activeTab] = [];
                this.setState({ data: stateData })
            }
        });
    }
}

export default VentaEnLinea;