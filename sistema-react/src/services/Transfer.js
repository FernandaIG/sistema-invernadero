//Clase con los metodos para crear una lista de deseos o agregar un item a la lista o al carro


export default class Transfer{
//   constructor(){
//     this.AuthSrv = new AuthService();
//   }

    CrearLista(data,idUsuario){


        const list={
            usuario:idUsuario,
            detalles:[
              {
                _id:data._id,
                articulo:data.nombre,
                descripcion:data.descripcion,
                cantidad:1,
                precio:data.precio_venta
              }
            ]
          }

          return list;
  }

  pushItem(data,cantidadd=1){

    const detalle=

            {
                _id:data._id,
                articulo:data.nombre,
                descripcion:data.descripcion,
                cantidad:cantidadd,
                precio:data.precio_venta
              }
        
    
    return detalle;
  }

 

}
