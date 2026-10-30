import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import './sentry.js';
import init from './init.jsx';

const socket = io();
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

init(socket).then((vdom) => {
  root.render(<StrictMode>{vdom}</StrictMode>);
});
