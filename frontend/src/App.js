import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import { ethers } from "ethers";
import './App.css';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { _toEscapedUtf8String } from "ethers/lib/utils";

function App() {

  const [nextBallotId, setNextBallotId]= useState('');
  const [ballots, setBallots] =useState([])
  const [descriptionBallot, setDescriptionBallot] = useState('');
  const [daysBallot, setDaysBallot] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [ballotIdResult, setBallotIdResult] = useState('');
  

  const addressContract = '0xebe48C6fAed44FEADE1122682Bb0C362a0fEab48';

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
  
  let contractDeployed = null;
  let contractDeployedSigner = null;
  
  useEffect( () => {

    getData()
    
  }, [])

  function getProvider(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, abi, provider)
    }
    if (contractDeployedSigner == null){
      contractDeployedSigner = new ethers.Contract(addressContract, abi, provider.getSigner());
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function getData() {
    getProvider();
    let nextBalId=  await contractDeployed.nextBallotId();
    setNextBallotId(nextBalId)

    let arrayBallots = [];
    for (let i = 0 ; i < nextBalId; i ++){
      let newBallot = await contractDeployed.getBallot(i);
      arrayBallots.push(newBallot);
    }
    setBallots(arrayBallots);
    console.log(arrayBallots);
  }

  async function handleCreateBallot(){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.createBallot(descriptionBallot, ["Yes", "No"], Date.now() + ( daysBallot * 86400 + 1000 ));  
     // const resp  = await contractDeployedSigner.createBallot(descriptionBallot, ["Yes", "No"], 0);  
      console.log(resp);
      toastMessage("Ballot created.")
    } catch (error) {
      toastMessage(error.data.message);
    }
  }

  async function handleVote(ballotId, choice){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.vote((ballotId).toString(), choice);  
      toastMessage("Voted.")
    } catch (error) {
      toastMessage(error.data.message);
    }
  }

  async function handleAddVoter(voterAddr){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.addVoter(voterAddr);  
      toastMessage("Voter Added.")
    } catch (error) {
      toastMessage(error.data.message);
    }
  }

  function formatDate(dateTimestamp){
    let date = new Date(parseInt(dateTimestamp));
    let dateFormatted = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes();
    return dateFormatted;
  }

  async function handleGetResult(){
    getProvider();
    try {
      const resp  = await contractDeployed.results(ballotIdResult);  
      console.log(resp);
      toastMessage(`Yes votes: ${(resp[0].votes).toString()}`)
      toastMessage(`No votes: ${(resp[1].votes).toString()}`)
    } catch (error) {
      toastMessage(error.error.data.message);
    }
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Dapp Voting" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
 
        {nextBallotId == '' ?
          <>
            <button onClick={getData}>Load data from blockchain</button>
          </>
          : 
          <>
          <h2>Voting Info</h2>
          <h5>Ballots: {(nextBallotId).toString()}</h5>

          <hr/>
          <h2>Add voter (only admin)</h2>
          <input type="text" placeholder="Voter address" onChange={(e) => setVoterAddress(e.target.value)} value={voterAddress}/>
          <button onClick={() => handleAddVoter(voterAddress)}>Add voter</button>

          <hr/>
          <h2>Create ballot (only admin)</h2>
          <input type="text" placeholder="Ballot" onChange={(e) => setDescriptionBallot(e.target.value)} value={descriptionBallot}/>
          <input type="text" placeholder="Time (in days)" onChange={(e) => setDaysBallot(e.target.value)} value={daysBallot}/>
          <button onClick={handleCreateBallot}>Create</button>

          <hr/>
          <h2>Ballots</h2>

          { ballots.length > 0 ?
            <table>
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
                    <td><button onClick={()=>handleVote(item.id, 0)}>Vote Yes</button></td>
                    <td><button onClick={()=>handleVote(item.id, 1)}>Vote No</button></td>
                  </tr>
                )}                
              </tbody>
            </table>:<p>No ballots registered</p>
          }
          <hr/>
          <h2>Results</h2>
          <input type="text" placeholder="Ballot Id" onChange={(e) => setBallotIdResult(e.target.value)} value={ballotIdResult}/>
          <button onClick={handleGetResult}>Get Result</button>
          </>
        }
      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter /> 
    </div>
  );
}

export default App;



