import React, { Component } from 'react';

import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import Grid from '@material-ui/core/Grid';



import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Requests from '../../services/Requests';


import { withStyles } from '@material-ui/core/styles';


import ShoppingcartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { NavLink, Link } from 'react-router-dom';

import sinimg from '../../img/no-image.jpg';

import { IconButton } from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = theme => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
});

class LisProducts extends Component {

    constructor(props) {
        super(props);
        console.log("ListProducts");
        this.Requests = new Requests();


        this.menuItems = [
            { icon: <VisibilityIcon fontSize="default" />, link: '/articulo/' },
            { icon: <ShoppingcartIcon fontSize="default" />, link: '/addtoCar/' },
            { icon: <FavoriteBorderIcon fontSize="default" color="secondary" />, link: '/' },
        ]

    }
    state = {
        page: 0,
        rowsPerPage: 9,
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value) });
    };

    render() {
        const { page, rowsPerPage } = this.state;
        const { classes } = this.props;




        return (

            <React.Fragment>

                {
                    this.props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dato, i) => (
                        dato.estado == 1 && (
                            <Grid item key={dato._id} xs={12} sm={4} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={dato.imagenes === 'SinImg' ? (sinimg) : (this.Requests.VerImagen('/articulo/getImage?image=' + dato.imagenes))} title="Image title"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="subtitle1" component="h2">
                                            {dato.nombre}
                                        </Typography>
                                        <Typography variant="h6">
                                            {'$' + dato.precio_venta}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        {this.menuItems.map((valor, i) => (

                                            <NavLink to={valor.link + dato._id}
                                                key={i}
                                            >
                                                <Button size="medium" color="default">
                                                    {valor.icon}
                                                </Button>
                                            </NavLink>

                                        ))}


                                    </CardActions>
                                </Card>
                            </Grid>

                        )
                    ))}



                <Grid container spacing={4} justify="center">
                <Grid item xs={12} sm={6}>                      
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[9, 15, 24]}
                                colSpan={3}
                                count={this.props.data.length}
                                rowsPerPage={rowsPerPage}
                                labelRowsPerPage='Productos por pagina'
                                page={page}
                                SelectProps={{
                                    native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </Grid>

                </Grid>



            </React.Fragment>
        )
    }


}

export default withStyles(useStyles, { withTheme: true })(LisProducts);

class TablePaginationActions extends Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const { count, page, rowsPerPage } = this.props;

        return (
            <div style={{ flexShrink: 0 }}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    <FirstPageIcon />
                </IconButton>
                
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    <KeyboardArrowLeft />
                </IconButton>
                
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    <KeyboardArrowRight />
                </IconButton>

                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >

                    <LastPageIcon />
                </IconButton>
            </div>
        );
    }
}