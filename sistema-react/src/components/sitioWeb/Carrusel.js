import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
 
//importacion de imagenes
import cac1 from '../../img/cac1.JPG';
import cac2 from '../../img/cac2.JPG';
import cac3 from '../../img/cac3.JPG';
class Carrusel extends Component {
    render() {
        return (
            <Carousel infiniteLoop={true} autoPlay={true} showStatus={false}>
                <div>
                    <img src={cac1}
                    alt={'cactus1'} />
                    <p className="legend">Cactus 1</p>
                </div>
                <div>
                    <img src={cac2}
                    alt={'cactus1'}  />
                    <p className="legend">Cactus 2</p>
                </div>
                <div>
                    <img src={cac3}
                    alt={'cactus1'}  />
                    <p className="legend">Cactus 3</p>
                </div>
            </Carousel>
        );
    }
}
 
export default Carrusel;
