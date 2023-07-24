import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";

const socket = io("http://localhost:3030/");
const feathersClient = feathers();
feathersClient.configure(socketio(socket));


const messageService = feathersClient.service('todo')

messageService.on('created', (message) => console.log('Created a message', message))


export { feathersClient };
