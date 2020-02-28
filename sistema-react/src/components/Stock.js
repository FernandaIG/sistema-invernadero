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
import Aviso from './dialogs/snackbar';


class Stock extends Component {


    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);

        this.headers = [['Nombre', 'Descripción', 'Estado'], ['Código', 'Nombre', 'Categoría', 'Precio Venta', 'Stock', 'Descripción', 'Estado'],['Usuario', 'Observación', 'estado','fecha'],];
        this.ids = [['nombre', 'descripcion', 'estado'], ['codigo', 'nombre', 'categoria', 'precio_venta', 'stock', 'descripcion', 'estado'],['usuario', 'observaciones', 'estado','createdAt'],];

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
                    <Tab label='Categorías' />
                    <Tab label='Artículos' />
                    <Tab label='Mermas' />
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nueva categoria'
                            fields={{ 
                                nombre: { type: 'TextFieldR' }, 
                                descripcion: { type: 'TextField', label:'Descripción' } 
                            }}
                            key="tab1" />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar categoria"
                            confirmMessage="Estas seguro de desactivar/activar esta categoría?"
                            propertiesToEdit={{ 
                                nombre: { type: 'TextFieldR' }, 
                                descripcion: { type: 'TextField', label:'Descripción' } 
                            }}
                            editTitle={'Editar Categoría'} />
                    </div>)
                }
                {
                    this.state.activeTab === 1 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nuevo artículo'
                            key="tab2"
                            fields={
                                {
                                    nombre: { type: 'TextFieldR' },
                                    categoria: {
                                        type: 'Select',
                                        options: this.state.data[0].slice().map(el => {
                                            console.log(el);
                                            return { id: el._id, value: el.nombre }
                                        }), 
                                        label: 'Categoría'
                                    },
                                    codigo: { type: 'TextField', label: 'Código' },
                                    precio_venta: { type: 'Precio', label: 'Precio Venta' },
                                    stock: { type: 'Number', label: 'Cantidad' },
                                    descripcion: { type: 'TextField', label:'Descripción' },
                                    imagenes: { type: 'image', label:'Imagen' }
                                }
                            } />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleRemove}
                            isDetailView={true}
                            handleSwitchActivate={this.handleSwitchActivate}
                            confirmTitle="Eliminar artículo"
                            confirmMessage="Estás seguro de eliminar este artículo?"
                            disableTitle="Desactivar/activar artículo"
                            disableMessage="Estás seguro de desactivar/activar este artículo?"
                            propertiesToEdit={
                                {
                                    nombre: { type: 'TextFieldR' },
                                    categoria: {
                                        type: 'Select',
                                        options: this.state.data[0].slice().map(el => {
                                            return { id: el._id, value: el.nombre }
                                        }), 
                                        label: 'Categoría'
                                    },
                                    codigo: { type: 'TextField', label: 'Código' },
                                    precio_venta: { type: 'Precio',  label: 'Precio Venta' },
                                    descripcion: { type: 'TextField',label:'Descripción' },
                                    imagenes: { type: 'image' }
                                }

                            }
                            propertiesToRead={
                                {
                                    imagenes:{type: 'Read', as:'Imagen', isImagen:true},

                                    nombre: {type: 'Read', as:'Nombre'},
                                    descripcion:{type: 'Read', as:'Descripción'},

                                }
                            }
                            readTitle={'Detalles del Artículo'}
                            editTitle={'Editar Artículo'} />
                    </div>)
                }
                  {
                    this.state.activeTab === 2 &&
                    (<div>
                        <NewDialog
                            register={this.handleRegister}
                            title='Nueva salida por merma'
                            fields={{ 
                                observaciones: { type: 'TextField', label:'Observación' },
                                detalles: { type: 'MermaList', options: this.state.data[1] ? this.state.data[1].map(el => ({ id: el._id, value: el.nombre, precio: el.precio_venta, cantidadTotal: el.stock })) : [], label:'Detalles'}

                            }}
                            key="tab1" />
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            isDetailView={true}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Anular salida por erma"
                            confirmMessage="Estas seguro de anular esta Salida por merma?"
                            propertiesToEdit={{}}
                            propertiesToRead={
                                {
                                    usuario: { type: "Read", as: 'Usuario' },
                                    observaciones: { type: "Read", as: 'Observación'},
                                    detalles: { type: "Read", as: 'Productos', isList: true, isMerma:true }
                                }
                            }
                            editTitle={'Detalle de venta'} />
                    </div>)
                }
            </div>
        )
    }

    handleSwitchActivate(id) {
        const pathQuery = this.state.activeTab === 0 ? '/categoria/query?_id=' : (this.state.activeTab===1)? '/articulo/query?_id=':'/merma/query?_id=';
        console.log('id',id);
        this.Requests.query(pathQuery + id).then(response => {
            //Actualizar tabla activa
            const pathActDeactivate = (this.state.activeTab === 0 ? '/categoria/' : (this.state.activeTab===1)?'/articulo/':'/merma/') + ((response.estado && response.estado == 1) ? "deactivate" : "activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate, id).then(response => {
                this.loadData();
            })
        });
    }

    handleRemove(id) {
        const path = this.state.activeTab === 0 ? '/categoria/remove' : '/articulo/remove';
        //console.log(id)
        this.Requests.delete(path, id).then(response => {
            this.loadData();
        })
    }
    handleReview=()=>{
        console.log('Visto');
    }

    handleOnEdit(data) {
        const path = this.state.activeTab === 0 ? '/categoria/update' : '/articulo/update';
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
    handleClose=()=>{
        this.setState({aviso:false});
    }
    handleRegister(data) {
        const path = this.state.activeTab === 0 ? '/categoria/add' : (this.state.activeTab===1)?'/articulo/add':'/merma/add';

        if(this.state.activeTab===2){
            //Necesario agregar id del usuario que registra el ingreso
            data['usuario'] = this.Requests.AuthSrv.getProfile()._id;
        }
        return this.Requests.add(path, data).then(response => {

            if(response.message==='Ocurrio un error'){
                this.setState({mensaje:'Hubo un problema al intentar registrar verifica tus datos',aviso:true});
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
        const path = activeTab === 0 ? '/categoria/list' :(activeTab===1)? '/articulo/listsinCategoria':'/merma/list';
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

export default Stock;