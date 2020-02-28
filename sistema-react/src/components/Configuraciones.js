import React, { Component } from 'react';
import TableConsult from './commons/TableConsult';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AuthService from './../services/AuthService';
import Requests from '../services/Requests';
import NewDialog from './dialogs/NewDialog';
import { saveAs } from 'file-saver';
import FileSaver from 'file-saver';


class Presupuesto extends Component {

    constructor(props) {
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);

        this.headers = [
            ['Usuario', 'Misión', 'Visión','Empresa', 'Compromiso']
        ];
        this.ids = [
            ['usuario', 'mision', 'vision', 'empresa', 'compromiso']
        ];
    }

    state = {
        activeTab: 0,
        data: []
    };

    handleChange = (event, activeTab) => {
        this.setState({ activeTab }, this.loadData);//Al cambiar de pestaña se hace peticion del nuevo valor del data
    };

    render() {
        const activeTab = this.state.activeTab;
        const headers = this.headers[activeTab];
        const ids = this.ids[activeTab];
        return (
            <div>
                <Tabs value={this.state.activeTab} onChange={this.handleChange}>
                    <Tab label='Configuraciones' />
                    
                </Tabs>
                {
                    
                    this.state.activeTab === 0 &&
                    (<div>
                        <br/>
                        <TableConsult
                            headers={headers}
                            ids={ids}
                            data={this.state.data[activeTab]}
                            isDetailView={true}
                            handleOnEdit={this.handleOnEdit}
                            confirmTitle="Eliminar presupuesto"
                            confirmMessage="¿Estas seguro de anular este presupuesto?"
                            propertiesToEdit={{
                                mision:{type: 'TextField', label:'Misión'},
                                vision:{type: 'TextField', label:'Visión'},
                                empresa:{type: 'TextField', label:'Empresa'},
                                compromiso:{type: 'TextField', label:'Compromiso'}
                            }}
                            propertiesToRead={
                                {
                                    mision: { type: "Read", as: 'Misión:' },
                                    vision: { type: "Read", as: 'Visión:' },
                                    empresa: { type: "Read", as: 'Empresa:' },
                                    compromiso: {type: "Read", as: 'Compromiso:'}
                                }
                            }
                            editTitle={'Misión y visión'} />
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

    handleOnEdit(data) {
        const path = '/configuracion/update';
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
        const path = '/configuracion/list';
        console.log('from', path);
        return this.Requests.list(path).then(response => {
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