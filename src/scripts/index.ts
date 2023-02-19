import '@node_modules/swiper/swiper.scss';
import "../styles/index.scss";

import controllerChecker from './controller';

console.log(process.env.ESLINT_USE)

controllerChecker();
