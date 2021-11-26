// Upon refresh of page the following happens in order
//1. initWeb3()
//2. initContract();
//3. getContractProperties()
//4. displayMyAccountInfo()
const web3 = new Web3(window.web3.currentProvider);


App = {

    web3Provider: null,
    contracts: {},

    init: function() {
        return App.initWeb3();
    },

    // todo

    initWeb3: function(){
        // Initialze web3 and set the provider
        if(typeof web3 !== 'undefined'){
            // Use Metamast's provider
            App.web3Provider = web3.currentProvider;
            App.setStatus("MetaMask detected");
        }else{
            // set the provider you from web3.providers
            alert("Error: Please install MetaMask then refresh the page");
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            return null;
        }

        // Get the initial account balance so it be displayed

        web3.eth.getAccounts(function(err, accs){
            if (err != null){
                alert("There was an err fetching  your account please try again later");
                return;
            }
            account = accs[0];
            if (!account){
                App.setStatus("Please Login to MetaMask")
                alert("Could not fetch your account. Make sure you are logged in to MetaMask, then refresh  the paage");
                return ;
            }
            return App.initContract();
        })
    },

    // todo
    initContract: function() {
        $.getJSON('ChatWeil.json', function(ChatWeilArtifact){
            // Get the neccessary contract artifact file and use it to instantitate a truffle contract abstraction
            App.contracts.ChatWeil = TruffleContract(ChatWeilArtifact);

            // Set the provider for our contract
            App.contracts.ChatWeil.setProvider(App.web3Provider);
            return App.getContractProperties();
        });
    },

    // todo
    getContractProperties: function() {
        var self = this;
        var meta;
        App.contracts.ChatWeil.deployed().then(function(instance) {
            meta = instance; 
            return meta.getContractProperties.call({from: account});
        }).then(function(value){
            var networkAddress = App.contracts.ChatWeil.address;
            document.getElementById("contractAddress").innerHTML = networkAddress;
            var by = values[0];
            var registeredUserAddress = Value[1];
            var numRegisteredUsers = registeredUserAddress.length;
            var select = '';
            for (i = 0; i < numRegisteredUsers; i++){
                select += '<option val=' + i + '>' + registeredUserAddress[i] + '</option>';
            }
            $('#regesteredUsersAddressMenu').html(select);
            document.getElementById("contractOwner").innerHTML = by;

        }).catch(function(e){
            console.log(e)
            self.setStatus("");
        })
        return App.displayMyAccountInfo();
    },

    displayMyAccountInfo: function(){
        web3.eth.getAccounts(function(err, account){
            if (err == null){
                App.account = account;
                document.getElementById("myAddress").innerHTML = account;
                web3.eth.getBalance(account[0], function(err, balance){
                    if (err == null){
                        if (balance == 0){
                            alert("Your account has zore balance. You must tranfer same ether to your  MetaMast account");
                            App.setStatus("Please buy same Ether");
                            return
                        }else{
                            document.getElementById("MyBalance").innerHTML = web3.fromWei(balance, "ether").toNumber()+" Ether";
                            return App.checkUserRegistration()
                        }
                    }else{
                        console.log(err)
                    }
                    
                });
            }
        })
        return null;
    },

    setStatus: function(message){
        document.getElementById("status").innerHTML = message;
    },

    // todo  
    // checkUserRegistration: function() {},

    // todo
    // copyAddressToSend: function() {}, 

}
    $(document).ready(function(){
        App.init();
    })
