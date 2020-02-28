import React, { Component } from 'react';
//Gráficas
import { Card, Grid, CardHeader } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import ChartScaleBand from '../commons/ChartScaleBand';


export default class Graficas extends Component {
    constructor(props) {
        super(props);
        this.state = { chartData: [[{ x: 0, y: 0 }], [{ x: 0, y: 0 }]] };//Para cada arreglo de la grafica se tendran un conjunto de punto "x" y "y"
        this.Requests = new Requests();
    }

    render() {
        const { chartData } = this.state;
        return (
            <div style={{ textAlign: 'center' }}>
                <Grid container spacing={24}>
                    <Grid item sm={6}>
                        <Card>
                            <CardHeader title='Ingresos' />
                            <ChartScaleBand chartData={chartData[0]} />
                        </Card>
                    </Grid>
                    <Grid item sm={6}>
                        <Card>
                            <CardHeader title='Ventas' />
                            <ChartScaleBand chartData={chartData[1]} />
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
} 