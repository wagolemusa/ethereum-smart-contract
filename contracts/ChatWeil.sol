pragma solidity ^0.4.18;

contract ChatWeil {

    // user transmit  "Message" Objects that contain the content and the data of the intended message;
    struct Message {
        address sender;
        bytes32 content;
        uint timestamp;
    }

    struct ContractProperties {
        address ChatWeilOwner;
        address[] registeredUserAddress;
    }

    struct Inbox {
        uint numSentMessages;
        uint numRecievedMessages;
        mapping (uint => Message) sentMessages;
        mapping (uint => Message) recievedMessages;
    }

    // Holds all inboxes of users
    mapping (address => Inbox) userInboxes;
    mapping (address => bool) hasRegistered;

    Inbox newInbox;
    Message newMessage;

    ContractProperties contractProperties;

    function checkUserRegistration() public view returns (bool){
        return hasRegistered[msg.sender];
    }

    function clearInbox() public {
        userInboxes[msg.sender] = newInbox;
    }

    function registerUser() public {
        if (!hasRegistered[msg.sender]){
            userInboxes[msg.sender] = newInbox;
            hasRegistered[msg.sender] = true;
            contractProperties.registeredUserAddress.push(msg.sender);
        }
    }


   
    function getContractProperties() public view returns(address, address[]){
        return (contractProperties.ChatWeilOwner, contractProperties.registeredUserAddress);
    }

    function sendMessages (address _reciever, bytes32 _content) public {
        newMessage.content = _content;
        newMessage.timestamp = now;
        newMessage.sender = msg.sender;

        // Update senders inbox
        Inbox  storage sendersInbox = userInboxes[msg.sender];
        sendersInbox.sentMessages[sendersInbox.numSentMessages] = newMessage;
        sendersInbox.numSentMessages++;

        // Update recievers inbox
        Inbox storage recieversInbox = userInboxes[_reciever];
        recieversInbox.recievedMessages[recieversInbox.numRecievedMessages] = newMessage;
        recieversInbox.numRecievedMessages++;

        return;

    }

    function recieveMessages() public view returns (bytes32[16], uint[], address[]){
        Inbox storage recieversInbox = userInboxes[msg.sender];
        bytes32[16] memory content;
        address[] memory sender = new address[](16);
        uint[] memory timestamp = new uint[](16);
        for (uint m = 0; m < 15; m++){
            Message memory message = recieversInbox.recievedMessages[m];
            content[m] =  message.content;
            sender[m] = message.sender;
            timestamp[m] = message.timestamp;
        }
        return(content, timestamp, sender);

    }

    // functon recieves a number of messages for aparticular user
    function getMyInboxesSize() public view returns(uint, uint){
        return (userInboxes[msg.sender].numSentMessages, userInboxes[msg.sender].numRecievedMessages);
    }

    // End


}