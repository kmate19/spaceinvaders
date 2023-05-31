import { fetchData } from "./modules/firebase.js";

document.getElementsByTagName("body")[0].onload = () => {
    fetchData();
}

document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.code==='Backspace') {
        location.href='./index.html'
        return;
    }
})