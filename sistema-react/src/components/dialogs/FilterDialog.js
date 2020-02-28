import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Class';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { withRouter } from "react-router-dom";

const emails = ['username@gmail.com', 'user02@gmail.com'];


class filterDialog extends Component{
    constructor(props) {
        super(props);
        
   
    }

    render(){
         
      
        const handleListItemClick = value => {
          if(value==='Todas'){
            this.props.history.replace('../productos');
          this.props.onClose();
          }
          else{
          this.props.history.replace('../productos/'+value);
          this.props.onClose();
          }
          };

          
        
        return(

            <Dialog onClose={()=>this.props.onClose()}  aria-labelledby="Categorias" open={this.props.open}>
            <DialogTitle id="simple-dialog-title">Especies</DialogTitle>
      <List>
      {this.props.categorias.map((valor,i) => (
          <ListItem button onClick={() => handleListItemClick(valor.nombre)} key={i}>
            <ListItemAvatar>
              <Avatar>
                <ClassIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={valor.nombre} />
          </ListItem>
        ))}

        <ListItem autoFocus button onClick={() => handleListItemClick('Todas')}>
          <ListItemAvatar>
            <Avatar>
            <ClassIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={'Todas'} />
        </ListItem>
      </List>
    </Dialog>


        );
    }


}
export default withRouter(filterDialog);