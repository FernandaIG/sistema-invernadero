import multer from 'multer';
import path from 'path';


const storagee= multer.diskStorage({
    destination:path.join(__dirname, '../public/img/uploads'),
    filename:(req, file, cb)=>{
        cb(null,file.originalname);
    }
});
const upload=multer({
    storage:storagee,
    //dest: path.join(__dirname, '../public/img/uploads')
    fileFilter: function ( req , file , cb )     { 
 
        //  La función debería llamar a `cb` con un valor booleano
        //  para indicar si el archivo debe ser aceptado
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.PNG' && ext !== '.JPG' && ext !== '.GIF' && ext !== '.JPEG') {
            return cb(new Error('Solo se permiten Imagenes'))
        }
      
        //  Para aceptar el archivo pase `true`, así:
        cb ( null , true ) 
       
        
       
      }

    }).single('image');

export default upload;