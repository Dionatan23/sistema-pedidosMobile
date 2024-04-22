import axios from "axios";

const api = axios.create({
    baseURL: "https://sistema-pedido-back-end.vercel.app/"
});

export { api };