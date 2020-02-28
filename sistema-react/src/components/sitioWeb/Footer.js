import React, { Component } from 'react';

//Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
//import '../../css/estilos.css';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

const useStyles = theme => ({
    footer: {
        backgroundColor: '#D5D8DC',
        marginTop: theme.spacing(8),
        padding: theme.spacing(6, 0),

    }
});

class Footer extends Component {
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <footer className={classes.footer}>
                    <Container maxWidth="lg">
                        <Typography variant="h6" align="center" gutterBottom>
                            Las Mejores plantas al alcance de todos
                     </Typography>
                        <Typography variant="subtitle1" align="center" color="textSecondary" component="p" >


                            Secreto de la Montaña &copy; 2019
                             Dr. Guillermo Gandara, Amatitlán, 62410 Cuernavaca, Mor.
                           </Typography>
                        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">

                            <a target="_blank" href="https://www.facebook.com/elsecretodelamontana/"><FacebookIcon fontSize="large" /></a>
                            <a target="_blank" href="https://www.instagram.com/secreto_cactus/?hl=es-la"><InstagramIcon fontSize="large" /></a>
                            <a target="_blank" href="https://wa.me/5217772119369"><WhatsAppIcon fontSize="large" /></a>

                        </Typography>


                    </Container>


                </footer>

            </React.Fragment>

        )
    }

}

export default withStyles(useStyles, { withTheme: true })(Footer);