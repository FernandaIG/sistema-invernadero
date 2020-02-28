import React, { Component } from 'react';
import TableConsult from './commons/TableConsult';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import { Button, IconButton, Typography, Select, MenuItem, InputLabel, FormControl, Menu } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Requests from '../services/Requests';
import NewDialog from './dialogs/NewDialog';


class Apartado extends Component {


    constructor(props) {

        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);

        this.headers = [
            ['Usuario', 'Cliente', 'Impuesto', 'Total restante', 'Total', 'Estado', 'Descripción'],
            ['Nombre', 'Email', 'Teléfono', 'Dirección', 'Estado', 'Lista Negra']];
        this.ids = [
            ['usuario', 'persona', 'impuesto', 'total', 'subTotal', 'estado', 'descripcion']
            , ['nombre', 'email', 'telefono', 'direccion', 'estado', 'listaNegra'],
            ['nombre'],
        ];//Nombre de un articulo para lista de ingresos
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
                    <Tab label='Apartados' />
                    <Tab label='Clientes' />
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nuevo apartado'
                            fields={
                                {
                                    persona: { type: "Select", options: this.state.data[1] ? this.state.data[1].map(el => ({ id: el._id, value: el.nombre, listaNegra: el.listaNegra })) : [], label:'Persona' },
                                    impuesto: { type: 'TextField', label:'Impuesto' },
                                    descripcion: { type: 'TextField', label:'Descripción' },
                                    detalles: { type: 'ShopList', options: this.state.data[2] ? this.state.data[2].map(el => ({ id: el._id, value: el.nombre, precio: el.precio_venta, cantidadTotal:el.stock })) : [], discount: true, label:'Detalles' },

                                }
                            }
                            key="tab1"
                        />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleRemove}
                            isDetailView={true}
                            confirmTitle="Eliminar Apartado"
                            confirmMessage="¿Estás seguro de eliminar este apartado?"
                            propertiesToEdit={{
                                abonos: { type: 'Abonos' },
                            }}
                            propertiesToRead={{
                                detalles: { type: "Read", as: 'Productos', isList: true },
                                abonos: { type: "Read", as: 'Abonos', isAbono: true }
                            }}
                            editTitle={'Agregar abono'}
                            readTitle={'Detalle apartado'}
                        />
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
                                    num_documento: { type: "TextField" , label:'Número Documento'},
                                    direccion: { type: "TextField", label:'Dirección' },
                                    telefono: { type: "TextField", label:'Teléfono' },
                                    email: { type: "TextField", label:'Correo Electrónico' }
                                }
                            } />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleRemove}
                            handleSwitchActivate={this.handleSwitchActivate}
                            disableTitle="Desactivar/activar cliente"
                            disableMessage="¿Estás seguro de desactivar/activar cliente?"
                            confirmTitle="Eliminar cliente"
                            confirmMessage="¿Estás seguro de eliminar este cliente?"
                            propertiesToEdit={
                                {
                                    nombre: { type: 'TextFieldR' },
                                    email: { type: 'TextField', label:'Correo Electrónico' },
                                    telefono: { type: "TextField" , label:'Teléfono'},
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
        console.log("Entro a handleSwitchActivate", id)
        const pathQuery = this.state.activeTab === 0 ? '/apartado/query?_id=' : '/persona/query?_id=';
        this.Requests.query(pathQuery + id).then(response => {
            //Actualizar tabla activa
            const pathActDeactivate = (this.state.activeTab === 0 ? '/apartado/' : '/persona/') + ((response.estado && response.estado == 1) ? "deactivate" : "activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate, id).then(response => {
                this.loadData();
            })
        });
    }

    handleRemove(id) {
        const path = this.state.activeTab === 0 ? '/apartado/remove' : '/persona/remove';
        //console.log(id)
        this.Requests.delete(path, id).then(response => {
            this.loadData();
        })
    }

    handleOnEdit(data) {
        const path = this.state.activeTab === 0 ? '/apartado/update' : '/persona/update';
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
        console.log('fer');

        const path = this.state.activeTab === 0 ? '/apartado/add' : '/persona/add';
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
        const path = activeTab === 0 ? '/apartado/list' : '/persona/listClientes';
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

export default Apartado;