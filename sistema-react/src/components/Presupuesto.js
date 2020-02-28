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
import { saveAs } from 'file-saver';
import FileSaver from 'file-saver';
import Aviso from './dialogs/snackbar';


class Presupuesto extends Component {

    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleCreatePdf = this.handleCreatePdf.bind(this);
        // this.handleCreate = this.handleCreate.bind(this);
        this.handleDowloadPdf = this.handleDowloadPdf.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);

        this.headers = [
            ['Usuario', 'Cliente', 'Impuesto', 'Total', 'Descripción']
        ];
        this.ids = [
            ['usuario', 'persona', 'impuesto', 'total', 'descripcion']
            , ['nombre', 'email', 'telefono', 'direccion', 'estado'],
            ['nombre']
        ];//Nombre de un articulo para lista de ingresos
    }

    state = {
        activeTab: 0,
        data: [],
        listQuery: '',
        aviso:false
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
               <Aviso mensaje='Correo Enviado Correctamente'
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
                    <Tab label='Presupuestos' />
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nuevo presupuesto'
                            fields={
                                {
                                    persona: { type: "Select", options: this.state.data[1] ? this.state.data[1].map(el => ({ id: el._id, value: el.nombre })) : [], label:'Persona' },
                                    descripcion: { type: 'TextField', label:'Descipción' },
                                    impuesto: { type: 'TextField', label:'Impuesto' },
                                    detalles: { type: 'ShopList', options: this.state.data[2] ? this.state.data[2].map(el => ({ id: el._id, value: el.nombre, precio: el.precio_venta,cantidadTotal: el.stock })) : [], discount: true, label:'Detalles' }
                                }
                            }
                            key="tab1" />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            isDetailView={true}
                            handleSend={this.handleSend}
                            handleCreatePdf={this.handleCreatePdf}
                            handleRemove={this.handleRemove}
                            confirmTitle="Eliminar presupuesto"
                            confirmMessage="¿Estas seguro de anular este presupuesto?"
                            emailTitle="Enviar presupuesto"
                            emailMessage="¿Desea enviar presupuesto por correo electronico?"
                            pdfTitle="Generar PDF"
                            pdfMessage="¿Desea generar el presupuesto en formato PDF?"
                            propertiesToEdit={{}}
                            propertiesToRead={
                                {
                                    persona: { type: "Read", as: 'Cliente' },
                                    impuesto: { type: "Read", as: 'Impuesto' },
                                    detalles: { type: "Read", as: 'Productos', isList: true }
                                }
                            }
                            editTitle={'Detalle de Presupuesto'} />
                    </div>)
                }
            </div>
        )
    }

    handleSwitchActivate(id) {
        const pathQuery = this.state.activeTab === 0 ? '/presupuesto/query?_id=' : '/persona/query?_id=';
        this.Requests.query(pathQuery + id).then(response => {
            //Actualizar tabla activa
            const pathActDeactivate = (this.state.activeTab === 0 ? '/presupuesto/' : '/persona/') + ((response.estado && response.estado == 1) ? "deactivate" : "activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate, id).then(response => {
                this.loadData();
            })
        });
    }
    handleClose=()=>{
        this.setState({aviso:false});
    }

    handleOnEdit(data) {
        const path = '/presupuesto/update';
        // if (this.state.activeTab === 1) {
        //     data['tipo_persona'] = "Cliente";
        // }
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

    //Metodo que envia el correo electronico
    handleSend(data) {
        console.log("Entro a handleSend");
        console.log('id', data._id);
        //console.log(data);
        const path = '/presupuesto/send';
        this.Requests.send(path, data).then(response => {
                console.log(response);
            if(response.message==='Correo enviado'){
               this.setState({aviso:true});
            }
            // console.log('Se envio el correo');
        });
    }

    //Metodo que crea el pdf en el servidor
    handleCreatePdf(data) {

        console.log('Entro a handleSendPdf');
        const path = '/presupuesto/pdf';

        this.Requests.createpdf(path, data).then(res => {
            console.log('Entro para solicitar el pdf');
            this.handleDowloadPdf();
        });

    }

    //Metodo que descarga el pdf en el lado del cliente
    handleDowloadPdf() {
        console.log('Entro a handleDowloadPdf');
        const path = '/presupuesto/sendpdf';

        this.Requests.pdf(path);
    }

    handleRemove(id) {
        const path = '/presupuesto/remove';

        this.Requests.delete(path, id).then(response => {
            console.log('Entro');
            this.loadData();
        })
    }

    handleRegister(data) {
        console.log('Entor a handleregister');
        console.log(data);

        const path = '/presupuesto/add';
        if (this.state.activeTab === 1) {
            data["tipo_persona"] = 'Cliente';
        } else {
            //Necesario agregar id del usuario que registra el ingreso
            data['usuario'] = this.Requests.AuthSrv.getProfile()._id;
        }
        return this.Requests.add(path, data).then(response => {

            if(response.message==='Ocurrio un error'){
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
        const path = '/presupuesto/list';
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
                            console.log("loadData", el[key]);
                            return el[key];
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

export default Presupuesto;