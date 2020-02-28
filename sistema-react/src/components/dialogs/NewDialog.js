import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, IconButton, Typography, Select, MenuItem, InputLabel, FormControl, Menu } from '@material-ui/core';
import NewIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SimpleReactValidator from 'simple-react-validator';
import NumberFormat from 'react-number-format';
import Requests from '../../services/Requests';

export default class NewDialog extends Component {

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
    selectedFile: null,
    disabled: false
  };

  valueChanges = (property, value) => {
    console.log('idPersona', value);
    let form = this.state.form;
    form[property] = value;

    this.setState({ form });

    //validacion
    // console.log(this.validator.allValid());
    // this.validator.showMessages();
    // this.forceUpdate();
  }

  agregarValue = (property, value) => {
    console.log(property);
    // console.log('idPersona', value);
    let form = this.state.form;
    form[property] = value;
    this.setState({ form });

  }

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

  filechange = (event) => {
    this.setState({
      selectedFile: event.target.files[0]
    })
    console.log(this.state);
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
  }

  handleClose = (limpiar=false) => {
    this.setState({ open: false });
  
    if(limpiar){
       this.setState({ form: {},
      selectedFile: null

    });
    }
  }

  register=(data)=>{
   
      this.props.register(data).then(resp=>{
        console.log(resp);
        if(!resp){
          this.setState({ form: {},
            selectedFile: null
      
          });
        }
      });
   
  }
  

  pushItem = (property, id) => {
    console.log(id);
    if (id == "default")//Opcion por defecto de un select
      return
    let indx = this.props.fields[property].options.findIndex(el => el.id == id);
    let form = this.state.form;
    if (!Array.isArray(form[property]))
      form[property] = [];
    if (form[property].findIndex(el => el._id == id) == -1) {
      //Solo agregamos un articulo que no este en la lista
      form[property].push({ _id: id, articulo: this.props.fields[property].options[indx].value, precio: this.props.fields[property].options[indx].precio, cantidad: 1 });
    }
    this.setState({ form });
  }
  pushItemAbono = (property, value) => {
    if (value == "default")//Opcion por defecto de un select
      return
    let form = this.state.form;
    
    if (!Array.isArray(form[property])) {
      form[property] = [];
    }
    form[property].push({ abono: value });

    this.setState({ form });
  }
  sacarCantidadTotal=(property,index)=>{
     //Buscamos el articulo en props.detalles.options y sacamos la cantidad en stock
     let articulo = this.state.form;
     console.log(articulo[property][index]['_id']);
     var indx = this.props.fields[property].options.findIndex(el => el.id == articulo[property][index]['_id']);
     return this.props.fields[property].options[indx].cantidadTotal;
  }

  changeItemContent(property, index, subproperty, value) {
    //Buscamos el articulo en props.detalles.options y sacamos la cantidad en stock
    let articulo = this.state.form;
    console.log(articulo[property]);
    var indx = this.props.fields[property].options.findIndex(el => el.id == articulo[property][index]['_id']);
    console.log(this.props.fields[property].options[indx]);

    
    if(subproperty==='cantidad'){
      if(value<=this.props.fields[property].options[indx].cantidadTotal){
      let form = this.state.form;

      form[property][index][subproperty] = value;
      this.setState({ form });

      //Buscamos si todos los articulos tienen cantidad mayor a 0
    var indx0 = articulo[property].findIndex(el => el.cantidad == 0);
    console.log(indx0);
    if(indx0==-1){
              this.setState({disabled:false})
        console.log('aaaa');
    }
    else{
      this.setState({disabled:true})
      console.log('bbbb');


    }
      }
      
      else{
        let form = this.state.form;

      form[property][index][subproperty] = 1;
      this.setState({ form });
      }
    }
    else{
      let form = this.state.form;
    form[property][index][subproperty] = value;
    this.setState({ form });
    }
  }

  render() {
    return (
      <div>
        <IconButton onClick={this.handleClickOpen}>
          <NewIcon />
          <Typography>
            Nuevo
          </Typography>
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            {Object.keys(this.props.fields).map(key => {
              if (!this.props.fields[key].type || this.props.fields[key].type === "TextField") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    label={this.props.fields[key].label.toUpperCase()}
                    type="text"
                    value={this.state.form[key]?(this.state.form[key]):('')}

                    name={key}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />
                )
              }
              if (this.props.fields[key].type === "TextFieldR") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    value={this.state.form[key]?(this.state.form[key]):('')}

                    label={key.toLocaleUpperCase()}
                    type="text"
                    required
                    name={key}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />

                )
              }
              if (this.props.fields[key].type === "TextFieldTelR") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    value={this.state.form[key]?(this.state.form[key]):('')}

                    label={key.toLocaleUpperCase()}
                    type="text"
                    required
                    InputProps={{
                      inputComponent: this.NumberFormatCustom3,
                    }}
                    name={key}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />

                )
              }
              if (this.props.fields[key].type === "TextFieldNumericImpuesto") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    value={this.state.form[key]?(this.state.form[key]):(this.state.form[key]=0.16)}

                    label={key.toLocaleUpperCase()}
                    type="text"
                    
                    InputProps={{
                      inputComponent: this.NumberFormatCustom4,
                    }}
                    name={key}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />

                )
              }
              else if (this.props.fields[key].type === "Number") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    value={this.state.form[key]?(this.state.form[key]):('')}

                    label={this.props.fields[key].label.toUpperCase()}
                    //type="number"
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    required
                    InputProps={{
                      inputComponent: this.NumberFormatCustom2,
                    }}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Email") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    value={this.state.form[key]?(this.state.form[key]):('')}

                    label={this.props.fields[key].label.toUpperCase()}
                    type="email"
                    required
                    name={key}
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />

                )
              }
              else if (this.props.fields[key].type === "Precio") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    value={this.state.form[key]?(this.state.form[key]):('')}

                    label={this.props.fields[key].label.toUpperCase()}
                    //type="number"
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    required
                    InputProps={{
                      inputComponent: this.NumberFormatCustom,
                    }}
                    fullWidth />
                )
              } else if (this.props.fields[key].type === "Password") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    value={this.state.form[key]?(this.state.form[key]):('')}

                    label={key.toLocaleUpperCase()}
                    type="password"
                    onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "Select") {
                return (
                  <FormControl fullWidth>
                    <InputLabel shrink htmlFor={'select' + key}>
                    {this.props.fields[key].label.toUpperCase()}
                    </InputLabel>
                    <Select
                      value={this.state.form[key] || "default"}
                      id={'select' + key}
                      onChange={(ev) => { this.valueChanges(key, ev.target.value) }}
                      fullWidth>
                      <MenuItem value="default">
                        <em>Seleccionar</em>
                      </MenuItem>
                      {this.props.fields[key].options.map(item => {
                        return (
                          (item.listaNegra == null || item.listaNegra !== 1) && 
                          <MenuItem value={item.id}>{item.value}</MenuItem>
                        )
                      })
                      }
                    </Select>
                  </FormControl>
                )
              }
              else if (this.props.fields[key].type === "image") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    label={this.props.fields[key].label.toUpperCase()}
                    name="image"
                    type="file"
                    onChange={this.filechange}
                    fullWidth />
                )
              }
              else if (this.props.fields[key].type === "ShopList") {
                return (
                  <div>
                    <hr />
                    {this.props.fields[key].discount ? "Agregar Productos a Venta" : "Agregar Productos a Ingreso"}
                    <FormControl fullWidth>
                      <Select
                        value={"default"}
                        id={'select' + key}
                        onChange={(ev) => this.pushItem(key, ev.target.value)}
                        fullWidth
                      >
                        <MenuItem value="default"><em>Seleccionar artículo</em></MenuItem>
                        {this.props.fields[key].options.map(item => {
                          return (
                            <MenuItem value={item.id}>{item.value}</MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                    <br />
                    <div style={{ maxHeight: "250px", overflow: "auto" }}>
                      {Array.isArray(this.state.form[key]) && this.state.form[key].map((el, i) => (
                        <div>
                          <IconButton onClick={() => { this.state.form[key].splice(i, 1); this.setState(this.state.form[key]) }}>
                            <DeleteIcon color="error"></DeleteIcon>
                          </IconButton>
                          <TextField readOnly margin="dense"
                            id={el.id}
                            key={el.id}
                            label={"Articulo"}
                            value={el.articulo}
                            type="text"
                            style={{ width: "25%" }}
                            onChange={(ev) => {/**Nothing*/ }}
                          />
                          <TextField autoFocus margin="dense"
                            id={el.id + "precio"}
                            key={el.id + "precio"}
                            label={"Precio"}
                            value={'$'+el.precio}
                            type="text"
                            style={{ width: "15%" }}
                            onChange={(ev) => {/**Nothing*/ }}
                          />
                          <TextField autoFocus margin="dense"
                            id={el.id + "cantidad"}
                            key={el.id + "cantidad"}
                            label={this.props.fields[key].discount ?("Cantidad(de:"+ this.sacarCantidadTotal(key,i)+")"):("Cantidad")}
                            value={this.state.form[key][i]['cantidad']?(this.state.form[key][i]['cantidad']):(0)}
                            //type="number"
                            InputProps={{
                              inputComponent: this.NumberFormatCustom2,
                            }}
                            style={{ width: "20%"}}
                            onChange={(ev) => { this.changeItemContent(key, i, 'cantidad', ev.target.value) }}
                          />
                          {this.props.fields[key].discount
                            &&
                            <TextField autoFocus margin="dense"
                              id={el.id + "descuento"}
                              key={el.id + "descuento"}
                              label={"descuento"}
                              defaultValue={0}
                              InputProps={{
                                inputComponent: this.NumberFormatCustom,
                              }}
                              style={{ width: "10%" }}
                              onChange={(ev) => { this.changeItemContent(key, i, 'descuento', ev.target.value) }}
                            />
                          }
                          <TextField readOnly margin="dense"
                            id={el.id + "subtotal"}
                            key={el.id + "subtotal"}
                            label={"Subtotal"}
                            value={el.precio * el.cantidad - (el.descuento ? el.descuento : 0)}
                            type="number"
                            style={{ width: "15%", marginLeft: "5%" }}
                            onChange={(ev) => {/**Nothing*/ }}
                          />

                        </div>
                      ))}
                      {Array.isArray(this.state.form[key]) && this.state.form[key].length > 0
                        && (
                          <div style={{ textAlign: "right" }}>
                            <div>Total Parcial: <strong>$ {calcularPacial(this.state.form[key], (this.state.form['impuesto'] || 0))}</strong></div>
                            <div>Total Impuesto: <strong></strong> {(this.state.form['impuesto'] || "0")}</div>
                            <div>Total Neto: <strong>$ {this.state.form['total'] = sumarPrecios(this.state.form[key])} </strong></div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )
              }  else if (this.props.fields[key].type === "MermaList") {
                return (
                  <div>
                    <hr />
                    {"Agregar Productos para Salida"}
                    <FormControl fullWidth>
                      <Select
                        value={"default"}
                        id={'select' + key}
                        onChange={(ev) => this.pushItem(key, ev.target.value)}
                        fullWidth
                      >
                        <MenuItem value="default"><em>Seleccionar artículo</em></MenuItem>
                        {this.props.fields[key].options.map(item => {
                          return (
                            <MenuItem value={item.id}>{item.value}</MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                    <br />
                    <div style={{ maxHeight: "250px", overflow: "auto" }}>
                      {Array.isArray(this.state.form[key]) && this.state.form[key].map((el, i) => (
                        <div>
                          <IconButton onClick={() => { this.state.form[key].splice(i, 1); this.setState(this.state.form[key]) }}>
                            <DeleteIcon color="error"></DeleteIcon>
                          </IconButton>
                          <TextField readOnly margin="dense"
                            id={el.id}
                            key={el.id}
                            label={"Articulo"}
                            value={el.articulo}
                            type="text"
                            style={{ width: "25%" }}
                            onChange={(ev) => {/**Nothing*/ }}
                          />
                         
                          <TextField autoFocus margin="dense"
                            id={el.id + "cantidad"}
                            key={el.id + "cantidad"}
                            label={("Cantidad(de:"+ this.sacarCantidadTotal(key,i)+")")}
                            value={this.state.form[key][i]['cantidad']?(this.state.form[key][i]['cantidad']):(0)}
                            //type="number"
                            InputProps={{
                              inputComponent: this.NumberFormatCustom2,
                            }}
                            style={{ width: "20%"}}
                            onChange={(ev) => { this.changeItemContent(key, i, 'cantidad', ev.target.value) }}
                          />
                          {this.props.fields[key].discount
                            &&
                            <TextField autoFocus margin="dense"
                              id={el.id + "descuento"}
                              key={el.id + "descuento"}
                              label={"descuento"}
                              defaultValue={0}
                              InputProps={{
                                inputComponent: this.NumberFormatCustom,
                              }}
                              style={{ width: "10%" }}
                              onChange={(ev) => { this.changeItemContent(key, i, 'descuento', ev.target.value) }}
                            />
                          }
                         

                        </div>
                      ))}
                      {Array.isArray(this.state.form[key]) && this.state.form[key].length > 0
                       
                      }
                    </div>
                  </div>
                )
              } 
              else if (this.props.fields[key].type === "Abonos") {
                return (
                  <TextField autoFocus margin="dense"
                    id={key}
                    key={key}
                    label={key.toLocaleUpperCase()}
                    type="text"
                    onChange={(ev) => this.pushItemAbono(key, ev.target.value)}
                    fullWidth />
                )
              }})}
            {
              //propiedades&& (propiedades.map((dato,i)=>(

              // this.validator.message('nombre', this.state.form.nombre, 'required|alpha_space')


              //this.state.form.descripcion&&this.validator.message('descripcion', this.state.form.descripcion, 'required|alpha')

              // )))

            }
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.handleClose(true)} color="primary">
              Cancelar
          </Button>
            <Button disabled={this.state.disabled} onClick={() => { this.handleClose(); this.register(this.state.form); this.subirarchivo();}} color="primary">
              Registrar
          </Button>
          </DialogActions>
        </Dialog>
      </div>

    )
  }
}

function calcularPacial(arrItems, impuesto) {
  return truncar(sumarPrecios(arrItems) * (1 - impuesto), 6);
}

function sumarPrecios(arrItems) {
  return arrItems.reduce((p, c) => { return p + (c.cantidad * c.precio - (c.descuento ? c.descuento : 0)) }, 0);
}

function truncar(valor, decimales) {
  return parseFloat((valor += '').substring(0, valor.lastIndexOf('.') + decimales + 1)) || 0;
}