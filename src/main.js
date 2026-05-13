import './styles/main.css';
import { createApp } from './app.js';

const appRoot = document.querySelector('#app');

if (!appRoot) {
  throw new Error('App root element not found');
}

createApp(appRoot);