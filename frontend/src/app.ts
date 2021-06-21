import App from "@components/App";
import React from "react";
import ReactDOM from "react-dom";
import Framework7 from "framework7/lite-bundle";
import Framework7React from "framework7-react";
import i18n from './assets/lang/i18n.js';
import 'lodash';

// Import Icons and App Custom Styles
import "framework7/framework7-bundle.css";
import '@styles/icons.css';
import '@styles/app.less';

const globalAny: any = global;
globalAny.i18next = i18n;

Framework7.use(Framework7React);
ReactDOM.render(React.createElement(App), document.getElementById("app"));
