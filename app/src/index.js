import Web3 from "web3";
import votingArtifact  from "../../build/contracts/Voting.json";
const aInBytes32 = "0x4100000000000000000000000000000000000000000000000000000000000000";
const bInBytes32 = "0x4200000000000000000000000000000000000000000000000000000000000000";


const App = {
  web3: null,
  account: null,
  voting: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = votingArtifact.networks[networkId];
      this.voting = new web3.eth.Contract(
        votingArtifact.abi,
        deployedNetwork.address,
         );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.ready();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },


  refresh: async function(id,nameInBytes32){
         const {totalVotesFor} = this.voting.methods;
         const tickets = await totalVotesFor(nameInBytes32).call();
         const element = document.getElementById(id);
         element.innerHTML = tickets.toString();
        },

       ready: async function(){
       try{
             this.refresh("user1",aInBytes32);
             this.refresh("user2",bInBytes32);
        }catch(err){
                console.log(err);
        }
      },

      voteForCandidate: async function(){
       console.log("vote");
      try{
         const { voteForCandidate } = this.voting.methods;
         const candidateName = document.getElementById("candidate").value;

        console.log(candidateName);
         if(candidateName == "user1"){
                await voteForCandidate(aInBytes32).send({from: this.account});
                this.refresh("user1",aInBytes32);
                }else if(candidateName == "user2"){
                await voteForCandidate(bInBytes32).send({from: this.account});
                this.refresh("user2",bInBytes32);
                console.log("vote user2");
        }

        } catch(err){
                console.log(err);
        }
      },
}
window.App = App;

window.addEventListener("load", function() {
  /*if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }*/
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

  App.start();
});

