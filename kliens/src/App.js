import Web3 from "web3";
import SimpleStorage from "./contracts/SimpleStorage.json";
import {useState,useEffect} from "react";
import './App.css';

function App() {
  const [state, setState]=useState({web3:null,contract:null});
  const [data,setData]=useState("nil");
  useEffect(()=>{
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template(){
      const web3 = new Web3(provider);
      //console.log(web3);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      //console.log(deployedNetwork.address);
      const contract = new web3.eth.Contract(SimpleStorage.abi, deployedNetwork.address);
      //console.log(contract); //instance of our contract
      setState({web3:web3,contract:contract});
    }
    provider && template();
  }, []);
  //console.log(state);

  useEffect(()=>{
    const {contract}=state;
    async function readData(){
      const data = await contract.methods.getter().call();
      setData(data);
      //console.log(data);
    }
    contract && readData();
  },[state]);

  async function writeData(){
    const{contract}=state;
    const data = document.querySelector("#value").value;
    await contract.methods.setter(data)
    .send({from:"0xC0C4446e01fd1085c34252FC1060976f491eC34F"});
    window.location.reload();
  }
  return (
    <div className="App">
      <p>Contract Data: {data}</p>
      <input type="text" id="value"></input>
      <button onClick={writeData}>Change Data</button>
    </div>
  );
}

export default App;
