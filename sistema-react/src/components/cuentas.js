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


class Cuenta extends Component {


    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);

        this.headers = [['Código', 'Nombre', 'Entrada', 'Salida', 'Saldo', 'Observación', 'Estado'], ['Nombre', 'Cantidad', 'Observación', 'Estado'], ['Nombre', 'Cantidad', 'Observación', 'Estado']];
        this.ids = [['codigo', 'nombre', 'entrada', 'salida', 'saldo', 'observacion', 'estado'], ['cuenta', 'cantidad', 'observacion', 'estado'], ['cuenta', 'cantidad', 'observacion', 'estado']];

    }

    state = {
        activeTab: 0,
        data: [],
        listQuery: ''
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
                    <Tab label='Cuentas' />
                    <Tab label='Entradas' />
                    <Tab label='Salidas' />
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nueva cuenta'
                            fields={{ nombre: { type: 'TextFieldR' }, codigo: { type: 'TextField', label:'Codígo' }, observacion: { type: 'TextField', label:'Observación' } }}
                            key="tab1" />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar cuenta"
                            confirmMessage="Estas seguro de desactivar/activar esta cuenta?"
                            propertiesToEdit={{ codigo: { type: 'TextField', label:'Codígo' }, nombre: { type: 'TextFieldR' }, observacion: { type: 'TextField', label:'Observación' } }}
                            editTitle={'Editar cuenta'} />
                    </div>)
                }
                {
                    this.state.activeTab === 1 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nueva Entrada'
                            key="tab2"
                            fields={
                                {
                                    cuenta: {
                                        type: 'Select',
                                        options: this.state.data[0].slice().map(el => {
                                            console.log(el);
                                            return { id: el._id, value: el.nombre }
                                        }),
                                        label:'Cuenta'
                                    },
                                    cantidad: { type: 'Precio', label:'Cantidad' },
                                    observacion: { type: 'TextField', label:'Observación' }

                                }
                            } />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={null}
                            isDetailView={true}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar entrada"
                            confirmMessage="Estás seguro de desactivar/activar esta entrada?"
                                                        propertiesToEdit={{}}

                            propertiesToRead={
                                {
                                    cuenta: {
                                        type: 'Read',
                                        options: this.state.data[0].slice().map(el => {
                                            console.log(el);
                                            return { id: el._id, value: el.nombre }
                                        }), as: 'Cuenta'
                                    },
                                    cantidad: { type: 'Read', as: 'Cantidad' },
                                    observacion: { type: 'Read', as: 'Observaciones' }
                                }

                            }
                            editTitle={'Detalles de Entrada'} />
                    </div>)
                }
                {
                    this.state.activeTab === 2 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nueva Salida'
                            key="tab2"
                            fields={
                                {
                                    cuenta: {
                                        type: 'Select',
                                        options: this.state.data[0].slice().map(el => {
                                            console.log(el);
                                            return { id: el._id, value: el.nombre }
                                        }),
                                        label:'Cuenta'
                                    },
                                    cantidad: { type: 'Precio',label:'Cantidad' },
                                    observacion: { type: 'TextField',label:'Observación' }

                                }
                            } />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={null}
                            isDetailView={true}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar salida"
                            confirmMessage="Estás seguro de desactivar/activar esta salida?"
                            propertiesToEdit={{}}

                            propertiesToRead={
                                {
                                    cuenta: {
                                        type: 'Read',
                                        options: this.state.data[0].slice().map(el => {
                                            console.log(el);
                                            return { id: el._id, value: el.nombre }
                                        }), as: 'Cuenta'
                                    },
                                    cantidad: { type: 'Read', as: 'Cantidad' },
                                    observacion: { type: 'Read', as: 'Observaciones' }
                                }

                            }
                            editTitle={'Detalles de Salida'} />
                    </div>)
                }
            </div>
        )
    }

    handleSwitchActivate(id) {
        const pathQuery = this.state.activeTab === 0 ? '/cuenta/query?_id=' : this.state.activeTab === 1 ? '/entrada/query?_id=' : '/salida/query?_id=';
        this.Requests.query(pathQuery + id).then(response => {
            //Actualizar tabla activa
            const pathActDeactivate = (this.state.activeTab === 0 ? '/cuenta/' : this.state.activeTab === 1 ? '/entrada/' : '/salida/') + ((response.estado && response.estado == 1) ? "deactivate" : "activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate, id).then(response => {
                this.loadData();
            })
        });
    }

    handleOnEdit(data) {
        const path = this.state.activeTab === 0 ? '/cuenta/update' : '/entrada/update';
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
        const path = this.state.activeTab === 0 ? '/cuenta/add' : this.state.activeTab === 1 ? '/entrada/add' : '/salida/add'
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
    }

    loadData() {
        console.log('Getting list');
        const activeTab = this.state.activeTab;
        const ids = this.ids;
        const path = activeTab === 0 ? '/cuenta/list' : activeTab === 1 ? '/entrada/list' : '/salida/list';
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

export default Cuenta;