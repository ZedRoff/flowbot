import { io } from 'socket.io-client';
import config from "../config.json"
// "undefined" means the URL will be computed from the `window.location` object
const URL = `http://${config.URL}:5000/`

export const socket = io(URL);