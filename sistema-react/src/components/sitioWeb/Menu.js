  
import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { AppBar, Drawer, IconButton, Typography, Divider, ListItem, ListItemIcon, ListItemText, List } from '@material-ui/core';


//Material UI
import Toolbar from '@material-ui/core/Toolbar';
//import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
    toolbarSecondary: {
        justifyContent: 'space-around',
        overflowX: 'auto',
        background:'#e0e0e0'
    },
    toolbarLink: {
        padding: theme.spacing(2),
        flexShrink: 0,
        hover:'#64b5f6'
    }
});

class Menu extends Component {
  
    render() {
        const { classes } = this.props;
        const sections = [
            'Inicio',
            'Productos',
            'Nosotros',
            'Contacto',
        ];
        return (
            <React.Fragment>
                <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                    {sections.map(section => (
                        <NavLink
                            to={'/'+section.toLowerCase()}
                            key={section}
                            style={{textDecoration: 'none',color:'black',fontSize:'16px',}}
                            activeStyle={{textDecoration:'underline'}}
                        >
                            <ListItem button key={section}>
                                <ListItemText primary={section}></ListItemText>
                            </ListItem>
                        </NavLink>
                    ))}
                </Toolbar>
            </React.Fragment>
        );
    }
}


export default withStyles(useStyles, { withTheme: true })(Menu);