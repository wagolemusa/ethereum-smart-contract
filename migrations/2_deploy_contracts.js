var ChatWeil = artifacts.require("./ChatWeil.sol")


module.exports = function(deployer){
    deployer.deploy(ChatWeil);
}