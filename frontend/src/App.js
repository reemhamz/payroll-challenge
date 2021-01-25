import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: "AIzaSyA84wHaYDRPsns9rDjBX3WVk42yywZjo8I",
  authDomain: "wave-reports.firebaseapp.com",
  projectId: "wave-reports",
  storageBucket: "wave-reports.appspot.com",
  messagingSenderId: "537498900790",
  appId: "1:537498900790:web:b46f443450c887c5e0fb97",
};
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app();
}

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [fileID, setFileID] = useState();
  const [fileNameOkay, setFileNameOkay] = useState(false);

  const timeNow = new Date().toString();

  const fileInfo = (e) => {
    //retrieves FileList web API which gives us access to the items uploaded
    const uploadedFile = e.target.files[0];

    setFile(uploadedFile);

    const splitName = uploadedFile.name.split("-")[2].split(".")[0];
    setFileID(splitName);
    setFileName(uploadedFile.name);
    setFileNameOkay(true);
  };

  const sendData = (e) => {
    setUploaded(true);
    e.preventDefault();

    //FormData allows us to construct objects based on what we uploaded in our HTML forms and we can send it to an HTTP request
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:3001/upload", formData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const reportArr = [];
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      const getFileIDs = () => {
        const myData = response.val();
        console.log(myData);

        // if database is empty, iteration won't happen
        if (myData !== null) {
          const objKeys = Object.keys(myData);
          objKeys.forEach((objKey) => {
            reportArr.push(myData[objKey].fileID);
          });
        } else {
          console.log("Let's upload some time reports!");
        }
      };

      const checkReportID = () => {
        if (reportArr.includes(fileID) === true) {
          alert(
            "Error! This report has been previously uploaded, can't accept it."
          );
        } else {
          const databaseUpload = () => {
            if (fileNameOkay) {
              dbRef.push({
                fileName: fileName,
                fileID: fileID,
                timeUploaded: timeNow,
              });
            }
          };
          databaseUpload();
        }
      };

      getFileIDs();

      setTimeout(() => {
        checkReportID();
      }, 500);
    });
  }, [fileNameOkay, fileName, timeNow, fileID]);

  return (
    <div className="App">
      <h1>Wave Payroll Portal 🌊</h1>
      {/* <img src={"./assets/wave.png"} alt="wave logo" /> */}
      <form action="#">
        <label htmlFor="file">Upload time report</label>
        <input type="file" id="file" accept=".csv" onChange={fileInfo} />
        <button onClick={sendData}>Upload file</button>
      </form>
      <p>{uploaded === true && "Check console"}</p>
      <footer>
        <p>Challenge accepted by
          <a href="https://reemify.dev"> Reem</a> 
        </p>
      </footer>
    </div>
  );
}

export default App;
