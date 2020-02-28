import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import SimpleReactValidator from 'simple-react-validator';
import NumberFormat from 'react-number-format';


import Requests from '../../services/Requests';

export default class EditDialog extends Component {

  constructor(props) {
    super(props);
    console.log("Begin");
    this.Requests = new Requests();
    // this.validator = new SimpleReactValidator({
    //   messages:{
    //     required: 'Campos con * son requeridos',
    //     alpha_space: 'Solo debe contener letras y espacios.'
    //   }
    // });
  }
  state = {
    open: false,
    form: {},
    selectedFile:null,
    disabled:false

  };

  NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        allowNegative={false}

        thousandSeparator
        isNumericString
        prefix="$"
      />
    );
  }

  NumberFormatCustom2(props) {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        decimalScale='0'
        allowNegative={false}

        thousandSeparator
        isNumericString
        prefix=""
      />
    );
  }
  NumberFormatCustom3(props) {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        format="+521 (###) ###-####" mask="_"
        decimalScale='0'
        allowNegative={false}
        thousandSeparator
        isNumericString
        prefix=""
      />
    );
  }

  NumberFormatCustom4(props) {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        allowNegative={false}

        thousandSeparator
        isNumericString
        prefix=""
      />
    );
  }

  valueChanges = (property, value) => {
    let form = this.state.form;
    form[property] = value;
    this.setState({ form });

    //Validacion

    // console.log(this.validator.allValid());
    // this.validator.showMessages();
    // this.forceUpdate();
  }

  valuesChanges = (property, value) => {
    var form = this.state.form;
    if(value<=this.props.item.total&&value>0){
      console.log('si es');
      form[property] = value;
    this.setState({ form });    
      this.setState({disabled:false});

    }
    else{
      form[property] = value;
      this.setState({ form });  
      this.setState({disabled:true});

    }
   

  }

  filechange = (event) => {
    this.setState({
      selectedFile: event.target.files[0]
    })
    console.log(this.state);
  }
  edit=(data)=>{
    this.props.edit(data).then(resp=>{
      console.log(resp);
      if(!resp){
        console.log('se borro');
        this.setState({ form: {},
          selectedFile: null
        });          
        console.log(this.state.form);

      }
    });

  }

  // e es todo el evento del campo
  subirarchivo = (e) => {

    if (this.state.selectedFile !== null) {

      //Sacar id del Articulo
      var articleCodigo = this.state.form.codigo

      //Crear form data
      const formData = new FormData();
      formData.append(
        'image',
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      console.log('image:' + formData.get('image'));

      //Peticion Ajax

      this.Requests.upload('/articulo/upload?codigo=' + articleCodigo, formData).then(res => {
        console.log(res);
      });
    }
  }

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
              if (!this.props.fields[key].type || this.props.fields[key].type === "TextField") {
                return (
                  <TextField multiline="true" autoFocus margin="dense" id={key} key={key} label={this.props.fields[key].label.toUpperCase()}
                  type="text"
                    defaultValue={this.props.item[key]}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "TextFieldR") {
                return (
                  <TextField autoFocus margin="dense" id={key} key={key} label={key.toLocaleUpperCase()} type="text"
                    defaultValue={this.props.item[key]}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    required
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "TextFieldTelR") {
                return (
                  <TextField autoFocus margin="dense" id={key} key={key} label={this.props.fields[key].label.toUpperCase()} type="text"
                    defaultValue={this.props.item[key]}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    InputProps={{
                      inputComponent: this.NumberFormatCustom3,
                    }}
                    required
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Email") {
                return (
                  <TextField autoFocus margin="dense" id={key} key={key} label={this.props.fields[key].label.toUpperCase()} type="email"
                    defaultValue={this.props.item[key]}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    required
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Number") {
                return (
                  <TextField autoFocus margin="dense" id={key} key={key} label={key.toLocaleUpperCase()}
                    defaultValue={this.props.item[key]}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    required
                    InputProps={{
                      inputComponent: this.NumberFormatCustom2,
                    }}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "image") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    label={key.toLocaleUpperCase()}
                    name="image"
                    type="file"
                    onChange={this.filechange}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Precio") {
                return (
                  <TextField autoFocus margin="dense" id={key} key={key} label={this.props.fields[key].label.toUpperCase()}
                    defaultValue={this.props.item[key]}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    required
                    InputProps={{
                      inputComponent: this.NumberFormatCustom,
                    }}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Password") {
                return (
                  <TextField autoFocus margin="dense" id={key} key={key} label={key.toLocaleUpperCase()} type="password"
                    defaultValue={""}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Guia") {
                return (
                  <TextField autoFocus margin="dense" id={key} key={key} label={this.props.fields[key].label.toUpperCase()} type="text"
                    defaultValue={this.props.item[key]}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    required
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Select") {
                var defaultIndex = this.props.fields[key].options.findIndex(el => el.value == this.props.item[key]);
                console.log(this.props.fields[key].options[defaultIndex].id);
                //Si no esta creado en el state.form se le asigna el valor del id

                if(!this.state.form[key]){
                  console.log('aaaa')
                  var form = this.state.form;
                  form[key] =  this.props.fields[key].options[defaultIndex].id;
                  this.setState({ form });
                }
                

                console.log(this.state.form[key]);
                return (
                  <FormControl fullWidth>
                    <InputLabel shrink htxmlFor={'select' + key}>
                    {this.props.fields[key].label.toUpperCase()}
                    </InputLabel>
                    <Select
                    key={key}
                      value={this.state.form[key]||this.props.fields[key].options[defaultIndex].id}
                      id={'select' + key}
                      onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                      >
                      {this.props.fields[key].options.map(item => {
                        return (
                          <MenuItem value={item.id}>{item.value}</MenuItem>
                        )
                      })
                      }
                    </Select>
                  </FormControl>
                )
              } else if (this.props.fields[key].type === "Abonos") {
              
                return (
                  <div>
                    <TextField autoFocus margin="dense"
                      id={key}
                      InputProps={{
                        inputComponent: this.NumberFormatCustom,
                      }}
                      value={this.state.form[key]}
                      key={key}
                      label={'Abono (Restan: $'+this.props.item.total+')'} type="text"
                      onChange={(ev) => { this.valuesChanges(key, ev.target.value) }}
                      fullWidth />
                  </div>
                )
              } else if (this.props.fields[key].type === "Read") {
                if (this.props.fields[key].isList) {
                  return (
                    <div>
                      <hr />
                      <FormControl fullWidth>
                        <table>
                          {this.props.item[key].map(
                            (item, index) => {
                              if (index > 0) {
                                return;//Solo nos interesa obtener los encabezados 1 vez
                              } else {
                                return <tr align="center">
                                  {Object.keys(item).map(
                                    property => {
                                      if (property != "_id") {
                                        return <th>{property.toUpperCase()}</th>
                                      } else {
                                        return;
                                      }
                                    }
                                  )}<th>Subtotal</th>
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
                              <td>{item.precio * item.cantidad - (item.descuento ? (item.descuento) : 0)}</td>
                            </tr>
                          })}
                        </table>
                        <div style={{ textAlign: "right" }}>
                          <div>Total Parcial: <strong>$ {calcularPacial(this.props.item[key], (this.props.item['impuesto'] || 0))}</strong></div>
                          <div>Total Impuesto: <strong></strong> {(this.props.item['impuesto'])}</div>
                          <div>Total Neto: <strong>$ {sumarPrecios(this.props.item[key])} </strong></div>
                        </div>
                      </FormControl>
                    </div>
                  )
                } else {
                  return (<FormControl fullWidth>
                    <div>
                      <strong style={{ margin: "3%" }}>{this.props.fields[key].as}</strong>
                      <em>{this.props.item[key]}</em>
                    </div>
                  </FormControl>)
                }
              }
              //Detalles de la venta en Linea
              else if (this.props.fields[key].type === "ReadOn") {
                if (this.props.fields[key].isList) {
                  return (
                    <div>
                      <hr />
                      <FormControl fullWidth>
                        <table>
                          {this.props.item[key].map(
                            (item, index) => {
                              if (index > 0) {
                                return;//Solo nos interesa obtener los encabezados 1 vez
                              } else {
                                return <tr align="center">
                                  {Object.keys(item).map(
                                    property => {
                                      if (property != "_id") {
                                        return <th>{property.toUpperCase()}</th>
                                      } else {
                                        return;
                                      }
                                    }
                                  )}<th>Subtotal</th>
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
                              <td>{item.precio * item.cantidad - (item.descuento ? (item.descuento) : 0)}</td>
                            </tr>
                          })}
                        </table>
                        <div style={{ textAlign: "right" }}>
                          <div>Importe: <strong>$ {(this.props.item['importe'])}</strong></div>
                          <div>Comisión: <strong></strong> {(this.props.item['comision'])}</div>
                          <div>Total Neto: <strong>$ {this.props.item['neto']} </strong></div>
                        </div>
                      </FormControl>
                    </div>
                  )
                }
                //Si es detalle de envio
                if (this.props.fields[key].isDetalle) {
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
                } else {
                  return (<FormControl fullWidth>
                    <div>
                      <strong style={{ margin: "3%" }}>{this.props.fields[key].as}</strong>
                      <em>{this.props.item[key]}</em>
                    </div>
                  </FormControl>)
                }
              }

              else {
                return (<div>{this.props.item[key]}</div>)
              }
            })}

            {


              // this.validator.message('nombre', this.state.form.nombre, 'required|alpha_space')


            }
          </DialogContent>
          {this.props.edit && <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancelar
          </Button>
            <Button disabled={this.state.disabled} onClick={() => {
              this.props.handleClose();
              this.edit(defaultOrChangedData(this.state.form, this.props.item, this.props.fields));
              this.subirarchivo();
            }} color="primary">
              Modificar
          </Button>
          </DialogActions>}
          {!this.props.edit &&
            <DialogActions>
              <Button  onClick={this.props.handleClose} color="primary">
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
  console.log(fields);
  Object.keys(fields).forEach(key => {
    if (!itemToSend[key]) {
      itemToSend[key] = defaultData[key];
      // if(key==='categoria'){
      //    itemToSend[key] = defaultData[key];
      // }
    }
  })
  itemToSend['_id'] = defaultData['_id'];
  console.log(itemToSend);
  return itemToSend;
}

function calcularPacial(arrItems, impuesto = 0) {
  return truncar(sumarPrecios(arrItems) * (1 - impuesto), 2);
}

function sumarPrecios(arrItems) {
  return arrItems.reduce((p, c) => { return p + (c.cantidad * c.precio - (c.descuento ? c.descuento : 0)) }, 0);
}

function truncar(valor, decimales) {
  return parseFloat((valor += '').substring(0, valor.lastIndexOf('.') + decimales + 1)) || 0;
}