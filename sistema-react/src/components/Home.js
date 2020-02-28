import React, { Component } from 'react';
import { Card, Grid, CardHeader, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import ChartScaleBand from './commons/ChartScaleBand';
import Requests from '../services/Requests';

import TableConsult from './commons/TableConsult';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ChartDialog from './dialogs/ChartDialog';


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            chartData: [[{ x: 0, y: 0 }], [{ x: 0, y: 0 }], [{ x: 0, y: 0 }], [{ x: 0, y: 0 }]]
        };//Para cada arreglo de la grafica se tendran un conjunto de punto "x" y "y"
        this.requests = new Requests();
    }

    handleChange = (event, activeTab) => {
        this.setState({ activeTab }, this.getLists);//Al cambiar de pestaña se hace peticion del nuevo valor del data
    };

    render() {
        const activeTab = this.state.activeTab;
        const { chartData } = this.state;
        return (
            <div>
                <Tabs value={this.state.activeTab} onChange={this.handleChange}>
                    <Tab label='Gráficas de ventas anual' />
                    <Tab label='Gráficas de ventas mensual' />
                    <Tab label='Gráficas de ventas díarias' />
                </Tabs>
                {this.state.activeTab === 0 &&
                    (
                        <div style={{ textAlign: 'center' }}>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ticket promedio' />
                                        <ChartScaleBand chartData={chartData[0]} />
                                        <pre>
                                            x = Año     y = Ticket promedio
                                        </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ventas totales' />
                                        <ChartScaleBand chartData={chartData[1]} />
                                        <pre>
                                            x = Año     y = Ventas totales
                                        </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Artículos más vendidos' />
                                        <ChartScaleBand chartData={chartData[2]} />
                                        <pre>
                                            x = Artículos     y = Artículos vendidos
                                        </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ventas por vendedor' />
                                        <ChartScaleBand chartData={chartData[3]} />
                                        <pre>
                                            x = Vendedor     y = Ventas
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    )
                }
                {this.state.activeTab === 1 &&
                    (
                        <div style={{ textAlign: 'center' }}>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ticket promedio' />
                                        <ChartScaleBand chartData={chartData[0]} />
                                        <pre>
                                            x = Mese     y = Ticket promedio
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>

                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ventas totales' />
                                        <ChartScaleBand chartData={chartData[1]} />
                                        <pre>
                                            x = Mese     y = Ventas totales
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Artículos más vendidos' />
                                        <ChartScaleBand chartData={chartData[2]} />
                                        <pre>
                                            x = Artículo     y = Artículos vendidos 
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ventas por vendedor' />
                                        <ChartScaleBand chartData={chartData[3]} />
                                        <pre>
                                            x = Vendedor     y = Ventas  
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    )
                }
                {this.state.activeTab === 2 &&
                    (
                        <div style={{ textAlign: 'center' }}>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ticket promedio' />
                                        <ChartScaleBand chartData={chartData[0]} />
                                        <pre>
                                            x = Día     y = Ticket promedio 
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ventas totales' />
                                        <ChartScaleBand chartData={chartData[1]} />
                                        <pre>
                                            x = Día     y = Ventas totales 
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Artículo más vendidos' />
                                        <ChartScaleBand chartData={chartData[2]} />
                                        <pre>
                                            x = Artículo    y =  Artículos vendidos
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={24}>
                                <Grid item sm={12}>
                                    <Card>
                                        <CardHeader title='Ventas por vendedor' />
                                        <ChartScaleBand chartData={chartData[3]} />
                                        <pre>
                                            x = Vendedor    y = Ventas
                                         </pre>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    )
                }
            </div>
        )
    }

    //Metodos de la clase
    componentDidMount() {//metodo que sirve cuando el componente esta cargado
        this.getLists();
    }

    async getLists() {//Componente que hara un request para pedir la lista de todos los precios e ingresos 

        let datas = [[], [], [], []];
        const activeTab = this.state.activeTab;

        //Obtención de listas para ticket promedio
        const path = activeTab === 0 ? '/venta/graficoticket' : (activeTab === 1) ? '/venta/graficoticketmes' : '/venta/graficoticketdia';
        await this.requests.list(path).then(l => {
            console.log("elemento 1", l);
            let sorted = l.sort((elA, elB) => elA._id.mes - elB._id.mes);//Ordenación de los elementos
            console.log('s', sorted);
            if (activeTab === 0) {
                sorted.forEach(item => {
                    console.log("item año", item);
                    datas[0].push({ x: item._id.year, y: item.div });
                });
            } else if (activeTab === 1) {
                sorted.forEach(item => {
                    console.log("item mes", item);
                    datas[0].push({ x: item._id.mes, y: item.div });
                });
            } else {
                sorted.forEach(item => {
                    console.log("item dia", item);
                    datas[0].push({ x: item._id.dia, y: item.div });
                });
            }

        });

        //Obtención de listas para ventas totales
        const path2 = activeTab === 0 ? '/venta/grafico12meses' : (activeTab === 1) ? '/venta/graficomes' : '/venta/graficodia';
        await this.requests.list(path2).then(l => {
            console.log("elemento 2", l);
            let sorted = l.sort((elA, elB) => elA._id.mes - elB._id.mes);//Ordenación de los elementos
            console.log('s2', sorted);
            if (activeTab === 0) {
                sorted.forEach(item => {
                    datas[1].push({ x: item._id.year, y: item.total });
                });
            } else if (activeTab === 1) {
                sorted.forEach(item => {
                    datas[1].push({ x: item._id.mes, y: item.total });
                });
            } else {
                sorted.forEach(item => {
                    datas[1].push({ x: item._id.dia, y: item.total });
                });
            }

        });

        //Obtención de listas para producto mas vendido
        const path3 = activeTab === 0 ? '/venta/graficoproducto' : (activeTab === 1) ? '/venta/graficoproductomes' : '/venta/graficoproductodia';
        await this.requests.list(path3).then(l => {
            console.log("elemento 3", l);
            let sorted = l.sort((elA, elB) => elA._id.mes - elB._id.mes);//Ordenación de los elementos
            console.log('s3', sorted);
            if (activeTab === 0) {
                sorted.forEach(item => {

                    datas[2].push({ x: item._id.articulo, y: item.cantidad });
                });
            } else if (activeTab === 1) {
                sorted.forEach(item => {
                    console.log("item mes", item);
                    datas[2].push({ x: item._id.articulo, y: item.cantidad });
                });
            } else {
                sorted.forEach(item => {
                    console.log("item dia", item);
                    datas[2].push({ x: item._id.articulo, y: item.cantidad });
                });
            }

        });

        //Obtención de listas para ventas por vendedor
        const path4 = activeTab === 0 ? '/venta/graficovendedor' : (activeTab === 1) ? '/venta/graficovendedormes' : '/venta/graficovendedordia';
        await this.requests.list(path4).then(l => {
            console.log("elemento 4", l);

            let sorted = l.sort((elA, elB) => elA._id.mes - elB._id.mes);//Ordenación de los elementos
            const pathQuery = '/usuario/query?_id=';

            console.log('s4', sorted);
            if (activeTab === 0) {
                sorted.forEach(item => {

                    console.log("item año", item);

                    datas[3].push({ x: item._id.nombreUser, y: item.numero });

                });
            } else if (activeTab === 1) {
                sorted.forEach(item => {
                    console.log("item mes", item);
                    datas[3].push({ x: item._id.nombreUser, y: item.numero });
                });
            } else {
                sorted.forEach(item => {
                    console.log("item dia", item);
                    datas[3].push({ x: item._id.nombreUser, y: item.numero });
                });
            }

        });

        this.setState({ chartData: datas });
    }


}


export default withRouter(Home);