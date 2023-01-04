import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter, { async } from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import Button from "react-bootstrap/Button";

import { format6FirstsAnd6LastsChar, formatDate } from "./utils";
import meta from "./assets/metamask.png";

function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [signer, setSigner] = useState();
  
  const [nextBallotId, setNextBallotId]= useState('');
  const [ballots, setBallots] =useState([])
  const [descriptionBallot, setDescriptionBallot] = useState('');
  const [daysBallot, setDaysBallot] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [ballotIdResult, setBallotIdResult] = useState('');
  

  const contractAddress = '0x34a5DD0bE685F1f0b9059f0fC36e0e316763421c';

  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ballots",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "end",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "nextBallotId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "votes",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "addVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "choices",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "offset",
          "type": "uint256"
        }
      ],
      "name": "createBallot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ballotId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "choiceId",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ballotId",
          "type": "uint256"
        }
      ],
      "name": "getBallot",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "votes",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Voting.Choice[]",
              "name": "choices",
              "type": "tuple[]"
            },
            {
              "internalType": "uint256",
              "name": "end",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Ballot",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ballotId",
          "type": "uint256"
        }
      ],
      "name": "results",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "votes",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Choice[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
  

  async function handleConnectWallet (){
    try {
      setLoading(true)
      let userAcc = await provider.send('eth_requestAccounts', []);
      setUser({account: userAcc[0], connected: true});

      const contrSig = new ethers.Contract(contractAddress, abi, provider.getSigner())
      setSigner( contrSig)

    } catch (error) {
      if (error.message == 'provider is undefined'){
        toastMessage('No provider detected.')
      } else if(error.code === -32002){
        toastMessage('Check your metamask')
      }
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    
    async function getData() {
      try {
        const {ethereum} = window;
        if (!ethereum){
          toastMessage('Metamask not detected');
          return
        }
  
        const prov =  new ethers.providers.Web3Provider(window.ethereum);
        setProvider(prov);

        const contr = new ethers.Contract(contractAddress, abi, prov);
        setContract(contr);
        
        if (! await isGoerliTestnet()){
          toastMessage('Change to goerli testnet.')
          return;
        }

        //contract data
        let nextBalId=  await contr.nextBallotId();
        setNextBallotId(nextBalId)
    
        let arrayBallots = [];
        for (let i = 0 ; i < nextBalId; i ++){
          let newBallot = await contr.getBallot(i);
          arrayBallots.push(newBallot);
        }
        setBallots(arrayBallots);  
        
      } catch (error) {
        toastMessage(error.reason)        
      }
      
    }

    getData()  
    
  }, [])
  
  function isConnected(){
    if (!user.connected){
      toastMessage('You are not connected!')
      return false;
    }
    
    return true;
  }

  async function isGoerliTestnet(){
    const goerliChainId = "0x5";
    const respChain = await getChain();
    return goerliChainId == respChain;
  }

  async function getChain() {
    const currentChainId = await  window.ethereum.request({method: 'eth_chainId'})
    return currentChainId;
  }

  async function handleDisconnect(){
    try {
      setUser({});
      setSigner(null);
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }


  async function handleCreateBallot(){
    try {
      if (!isConnected()) {
        return;
      }
      if (! await isGoerliTestnet()){
        toastMessage('Change to goerli testnet.')
        return;
      }
      setLoading(true);
      const resp  = await signer.createBallot(descriptionBallot, ["Yes", "No"], Date.now() + ( daysBallot * 86400 + 1000 ));  
      toastMessage("Please wait.")
      await resp.wait();
      toastMessage("Ballot created.")
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }

  async function handleVote(ballotId, choice){
    try {
      if (!isConnected()) {
        return;
      }
      if (! await isGoerliTestnet()){
        toastMessage('Change to goerli testnet.')
        return;
      }
      setLoading(true);
      const resp  = await signer.vote((ballotId).toString(), choice);  
      toastMessage("Please wait.")
      await resp.wait();
      toastMessage("Voted.")
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  
  }

  async function handleAddVoter(voterAddr){
    
    try {
      if (!isConnected()) {
        return;
      }
      if (! await isGoerliTestnet()){
        toastMessage('Change to goerli testnet.')
        return;
      }
      setLoading(true);
      const resp  = await signer.addVoter(voterAddr);  
      toastMessage("Please wait.")
      await resp.wait();
      toastMessage("Voter Added.")
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }

  async function handleGetResult(){
    try {
      const resp  = await contract.results(ballotIdResult);  
      toastMessage(`Yes votes: ${(resp[0].votes).toString()}`)
      toastMessage(`No votes: ${(resp[1].votes).toString()}`)
    } catch (error) {
      toastMessage(error.reason);
    }
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Dapp Voting" image={true} />
      <WRInfo chain="Goerli" testnet={true} />
      <WRContent>
 
        <h1>MULTISIGN WALLET</h1>
        {loading && 
          <h1>Loading....</h1>
        }
        { !user.connected ?<>
            <Button className="commands" variant="btn btn-primary" onClick={handleConnectWallet}>
              <img src={meta} alt="metamask" width="30px" height="30px"/>Connect to Metamask
            </Button></>
          : <>
            <label>Welcome {format6FirstsAnd6LastsChar(user.account)}</label>
            <button className="btn btn-primary commands" onClick={handleDisconnect}>Disconnect</button>
          </>
        }
        <hr/> 

        {nextBallotId !== '' &&
          <>
          <h2>Voting Info</h2>
          <label>Ballots: {(nextBallotId).toString()}</label>

          <hr/>
          <h2>Add voter (only admin)</h2>
          <input type="text" className="commands" placeholder="Voter address" onChange={(e) => setVoterAddress(e.target.value)} value={voterAddress}/>
          <button className="btn btn-primary commands" onClick={() => handleAddVoter(voterAddress)}>Add voter</button>

          <hr/>
          <h2>Create ballot (only admin)</h2>
          <input type="text" className="commands" placeholder="Ballot" onChange={(e) => setDescriptionBallot(e.target.value)} value={descriptionBallot}/>
          <input type="number" className="commands" placeholder="Time (in days)" onChange={(e) => setDaysBallot(e.target.value)} value={daysBallot}/>
          <button className="btn btn-primary commands" onClick={handleCreateBallot}>Create</button>

          <hr/>
          <h2>Ballots</h2>

          { ballots.length > 0 ?
            <table className="table">
              <thead>
                <tr>
                  <td style={{width: 100}}>Id</td>
                  <td style={{width: 100}}>Name</td>
                  <td style={{width: 100}}>Chose Yes</td>
                  <td style={{width: 100}}>Chose No</td>
                  <td style={{width: 100}}>End</td>
                  <td style={{width: 100}}>Vote Yes</td>
                  <td style={{width: 100}}>Vote No</td>
                </tr>
              </thead>
              <tbody>
                {
                ballots.map((item, ind) =>  
                  <tr key={ind}>
                    <td>{(item.id).toString()}</td>
                    <td>{item.name}</td>
                    <td>{(item.choices[0].votes).toString()}</td>
                    <td>{(item.choices[1].votes).toString()}</td>
                    <td>{formatDate((item.end))}</td>
                    <td><button className="btn btn-primary" onClick={()=>handleVote(item.id, 0)}>Vote Yes</button></td>
                    <td><button className="btn btn-primary" onClick={()=>handleVote(item.id, 1)}>Vote No</button></td>
                  </tr>
                )}                
              </tbody>
            </table>:<p>No ballots registered</p>
          }
          <hr/>
          <h2>Results</h2>
          <input type="number" className="commands" placeholder="Ballot Id" onChange={(e) => setBallotIdResult(e.target.value)} value={ballotIdResult}/>
          <button className="btn btn-primary commands" onClick={handleGetResult}>Get Result</button>
          </>
        }
      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter /> 
    </div>
  );
}

export default App;



