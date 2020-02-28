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

import Snackbar from '@material-ui/core/Snackbar';

class Sales extends Component {


    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);


        this.headers = [
            ['Usuario', 'Cliente', 'Tipo Comprobante', 'Número Comprobante', 'Total', 'Estado', 'Impuesto'],
            ['Nombre', 'Email', 'Teléfono', 'Dirección', 'Estado']];
        this.ids = [
            ['usuario', 'persona', 'tipo_comprobante', 'num_comprobante', 'total', 'estado', 'impuesto']
            , ['nombre', 'email', 'telefono', 'direccion', 'estado'],
            ['nombre']
        ];//Nombre de un articulo para lista de ingresos
    }

    state = {
        activeTab: 0,
        data: [],
        listQuery: '',
        open: false
    };

    handleChange = (event, activeTab) => {
        this.setState({ activeTab, listQuery: '' }, this.loadData);//Al cambiar de pestaña se hace peticion del nuevo valor del data
    };

    handleClose=()=>{
        this.setState({open:false});
    }

    render() {
        const activeTab = this.state.activeTab;
        const headers = this.headers[activeTab];
        const ids = this.ids[activeTab];

        return (
            <div>
                <Snackbar
       // anchorOrigin={{ 'zbottom','right' }}
        key={`${'bottom'},${'right'}`}
        open={this.state.open}
        onClose={this.handleClose}
        message="I love snacks"
      />
                <div>
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
                    <Tab label='Ventas' />
                    <Tab label='Clientes' />
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nueva venta'
                            fields={
                                {
                                    persona: { type: "Select", options: this.state.data[1] ? this.state.data[1].map(el => ({ id: el._id, value: el.nombre,listaNegra: el.listaNegra })) : [], label:'Persona' },
                                    tipo_comprobante: { type: "Select", options: [{ id: "Factura", value: "Factura" }, { id: "Ticket", value: "Ticket" }], label:'Tipo Comprobante' },
                                    num_comprobante: { type: 'TextField', label:'Número Comprobante' },
                                    impuesto: { type: 'TextFieldNumericImpuesto', label:'Impuesto' },
                                    detalles: { type: 'ShopList', options: this.state.data[2] ? this.state.data[2].map(el => ({ id: el._id, value: el.nombre, precio: el.precio_venta, cantidadTotal: el.stock })) : [], discount: true , label:'Detalles'}
                                }
                            }
                            key="tab1" />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            isDetailView={true}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Anular Venta"
                            confirmMessage="Estas seguro de anular esta venta?"
                            propertiesToEdit={{}}
                            propertiesToRead={
                                {
                                    persona: { type: "Read", as: 'Cliente' },
                                    tipo_comprobante: { type: "Read", as: 'Tipo de documento' },
                                    serie_comprobante: { type: "Read", as: 'Serie comprobante' },
                                    num_comprobante: { type: "Read", as: 'Número comprobante' },
                                    impuesto: { type: "Read", as: 'Impuesto' },
                                    detalles: { type: "Read", as: 'Productos', isList: true }
                                }
                            }
                            editTitle={'Detalle de venta'} />
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
                                    tipo_documento: { type: "Select", options: [{ id: 'DNI', value: 'DNI' }, { id: 'RUC', value: 'RUC' }, { id: 'CEDULA', value: 'CEDULA' }], label:'Tipo Documento' },
                                    num_documento: { type: "TextField", label:'Número Documento' },
                                    direccion: { type: "TextField" , label:'Dirección'},
                                    telefono: { type: "Number" , label:'Teléfono'},
                                    email: { type: "Email", label:'Correo Electrónico' }
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
                                    email: { type: 'Email', label:'Correo Electrónico' },
                                    telefono: { type: "TextField", label:'Teléfono' },
                                    direccion: { type: "TextField" , label:'Dirección'},
                                }
                            }
                            editTitle={'Editar Cliente'} />
                    </div>)
                }
            </div>
        )
    }

    handleSwitchActivate(id) {
        const pathQuery = this.state.activeTab === 0 ? '/venta/query?_id=' : '/persona/query?_id=';
        this.Requests.query(pathQuery + id).then(response => {
            //Actualizar tabla activa
            const pathActDeactivate = (this.state.activeTab === 0 ? '/venta/' : '/persona/') + ((response.estado && response.estado == 1) ? "deactivate" : "activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate, id).then(response => {
                this.loadData();
            })
        });
    }

    handleOnEdit(data) {
        const path = this.state.activeTab === 0 ? '/venta/update' : '/persona/update';
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
        const path = this.state.activeTab === 0 ? '/venta/add' : '/persona/add'
        if (this.state.activeTab === 1) {
            data["tipo_persona"] = 'Cliente';
        } else {
            //Necesario agregar id del usuario que registra el ingreso
            data['usuario'] = this.Requests.AuthSrv.getProfile()._id;
        }
        return this.Requests.add(path, data).then(response => {

            if(response.message==='Ocurrio un error'){
                this.setState({open:true});
                alert('Hubo un problema al intentar registrar verifica tus datos');
                return response.message;
            }  
              else{
                      this.loadData();
  
              }
        }).catch(error => {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
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
        const path = activeTab === 0 ? '/venta/list' : '/persona/listClientes';
        console.log('from', path);
        return this.Requests.list(path, this.state.listQuery).then(response => {
            console.log(response);
            if (response && response.length !== 0) {// El request no ha devuelto un arreglo vacio
                let dt = response;
                dt.map((el, i) => {
                    console.log("dt ", dt);
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

export default Sales;