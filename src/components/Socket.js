import openSocket from "socket.io-client";
const socket = openSocket(`http://${window.location.hostname}:8085`);

export default socket;