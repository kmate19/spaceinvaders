import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js';
import { getDatabase, ref, set, get} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js';
import { getPerformance } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-performance.js';

const firebaseConfig = {
    apiKey: "AIzaSyCsr1k2RbKtTgcQAXW9UOegOlUbl220GSg",
    authDomain: "spaceinvadersjsckik.firebaseapp.com",
    projectId: "spaceinvadersjsckik",
    storageBucket: "spaceinvadersjsckik.appspot.com",
    messagingSenderId: "1026689494436",
    appId: "1:1026689494436:web:dfce21067d42c88d96e531",
    measurementId: "G-JQKJ77SXND",
    databaseURL: "https://spaceinvadersjsckik-default-rtdb.europe-west1.firebasedatabase.app/"//'http://127.0.0.1:9000/?ns=spaceinvadersjsckik-default-rtdb'
};
      

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const perf = getPerformance(app);

export function writeDataToDB(userId,time,score) {
    set(ref(database,"Users/"+userId), {
            time:time,
            score:score
    });
};

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key].score === value);
}

export function fetchData() {
  get(ref(database,"Users/")).then((snapshot)=>{
    let arr=[];
    Object.keys(snapshot.val()).forEach(key => {
      arr.push(snapshot.val()[key].score)
    });

    arr.sort(function(a, b){return b-a});

    arr.forEach(val => {
      document.getElementById("leaderboard").appendChild(Object.assign(document.createElement("li"),{innerText:'Score: '+val+' | '+getKeyByValue(snapshot.val(),val)}));
    });
  })
}