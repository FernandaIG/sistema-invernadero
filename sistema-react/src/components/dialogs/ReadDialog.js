import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

export default class ReadDialog extends Component {
    state = {
        open: false,
        form: {}
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    render() {
        if (!this.props.item) {
            // Return nothing
            return (
                <div></div>
            )
        }
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
                    <DialogContent>
                        {Object.keys(this.props.fields).map(key => {
                            if (this.props.fields[key].type === "Read") {
                                if (this.props.fields[key].isList) {
                                    return (
                                        <div>
                                            <hr />
                                            <FormControl fullWidth>
                                                <table>
                                                    {this.props.item[key].map((item, index) => {
                                                        if (index > 0) {
                                                            return;//Solo nos interesa obtener los encabezados 1 vez
                                                        } else {
                                                            return <tr align="center">
                                                                {Object.keys(item).map(property => {
                                                                    if (property != "_id" && property != "articulo") {
                                                                        return <th>{property.toUpperCase()}</th>
                                                                    }else if(property == "articulo"){
                                                                        return <th>ARTÍCULO</th>
                                                                    } else {
                                                                        return;
                                                                    }
                                                                }
                                                                )}
                                                                {this.props.fields[key].isMerma||
                                                                <th>SUBTOTAL</th>
                                                        }
                                                            </tr>
                                                        }

                                                    }
                                                    )}
                                                    {this.props.item[key].map(item => {
                                                        return <tr align="center">{
                                                            Object.keys(item).map(property => {
                                                                if (property != '_id') {
                                                                    return <td>{item[property]}</td>
                                                                } else {
                                                                    return;
                                                                }
                                                            })
                                                        }
                                                        {this.props.fields[key].isMerma||
                                                            <td>{item.precio * item.cantidad - (item.descuento ? (item.descuento) : 0)}</td>
                                                            }
                                                        </tr>
                                                    })}
                                                </table>
                                                {this.props.fields[key].isMerma||
                                                <div style={{ textAlign: "right" }}>
                                                    <div>Total Parcial: <strong>$ {calcularPacial(this.props.item[key], (this.props.item['impuesto'] || 0))}</strong></div>
                                                    <div>Total Impuesto: <strong></strong> {(this.props.item['impuesto'])}</div>
                                                    <div>Total Neto: <strong>$ {sumarPrecios(this.props.item[key])} </strong></div>
                                                </div>
                                                }
                                            </FormControl>
                                        </div>
                                    )
                                } else if (this.props.fields[key].isAbono) {
                                    return (
                                        <div>
                                            <hr />
                                            <FormControl fullWidth>
                                                <table>
                                                    {this.props.item[key].map((item, index) => {
                                                        if (index > 0) {
                                                            return;//Solo nos interesa obtener los encabezados 1 vez
                                                        } else {
                                                            return <tr align="center">
                                                                {Object.keys(item).map(property => {
                                                                    if (property != "_id") {
                                                                        return <th>{property.toUpperCase()}</th>
                                                                    } else {
                                                                        return;
                                                                    }
                                                                }
                                                                )}
                                                            </tr>
                                                        }

                                                    }
                                                    )}
                                                    {this.props.item[key].map(item => {
                                                        return <tr align="center">{
                                                            Object.keys(item).map(property => {
                                                                if (property != '_id') {
                                                                    return <td>{item[property]}</td>
                                                                } else {
                                                                    return;
                                                                }
                                                            })
                                                        }

                                                        </tr>
                                                    })}
                                                </table>
                                            </FormControl>
                                        </div>
                                    )
                                }
                                else if (this.props.fields[key].isImagen) {//Si es detalle de envio
                                    return (
                                      <div>
                                        <hr />
                                        <FormControl fullWidth>
                  
                                          <div style={{ textAlign: "center" }}>
                                    <div>
                                    <img alt="Imagen" src={('http://localhost:3000/api/articulo/getImage?image=' + this.props.item[key])} width='350px' height='260px' />

                                        
       
                                        
                                        </div>
                  
                                          </div>
                                          
                                        </FormControl>
                                      </div>
                                    )
                                  }
                                  else if (this.props.fields[key].isDetalle) {//Si es detalle de envio
                                  return (
                                    <div>
                                      <hr />
                                      <FormControl fullWidth>
                
                                        <div style={{ textAlign: "center" }}>
                                          <div><strong>Detalles de Envio</strong></div>
                
                                        </div>
                                        <div style={{ textAlign: "left" }}>
                                          <div>Destinatario: <strong>{(this.props.item['datosEnvio'].destinatario)}</strong></div>
                                          <div>Calle: <strong> {(this.props.item['datosEnvio'].calle)}</strong></div>
                                          <div>Ciudad: <strong> {this.props.item['datosEnvio'].ciudad} </strong></div>
                                          <div>Estado: <strong> {this.props.item['datosEnvio'].estado} </strong></div>
                                          <div>Codigo Postal: <strong> {this.props.item['datosEnvio'].codigo_postal} </strong></div>
                                        </div>
                                      </FormControl>
                                    </div>
                                  )
                                }
                                else {
                                    return (<FormControl fullWidth>
                                        <div>
                                            <strong style={{ margin: "3%" }}>{this.props.fields[key].as}</strong>
                                            <em>{this.props.item[key]}</em>
                                        </div>
                                    </FormControl>)
                                }
                            }
                        })}
                    </DialogContent>
                    {!this.props.edit && <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Aceptar
                    </Button>
                    </DialogActions>}
                </Dialog>
            </div>
        )
    }
}

function defaultOrChangedData(updated, defaultData, fields) {
    let itemToSend = updated;
    console.log(itemToSend);
    Object.keys(fields).forEach(key => {
        if (!itemToSend[key]) {
            itemToSend[key] = defaultData[key];
        }
    })
    itemToSend['_id'] = defaultData['_id'];
    return itemToSend;
}

function calcularPacial(arrItems, impuesto = 0) {
    return truncar(sumarPrecios(arrItems) * (1 - impuesto), 6);
}

function sumarPrecios(arrItems) {
    return arrItems.reduce((p, c) => { return p + (c.cantidad * c.precio - (c.descuento ? c.descuento : 0)) }, 0);
}

function truncar(valor, decimales) {
    return parseFloat((valor += '').substring(0, valor.lastIndexOf('.') + decimales + 1)) || 0;
}