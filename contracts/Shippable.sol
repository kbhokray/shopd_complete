pragma solidity ^0.4.11;

contract Shippable {
    
    enum ShippmentStatus { InTransit, Delivered }
    struct Shippment {
        string itemId;
        address from;
        address to;
        address shipper;
        ShippmentStatus status;
    }
    
    mapping(address => bool) registeredShipper;
    mapping(string => Shippment) shipments;

    modifier onlyRegisteredShipper() {
        require(registeredShipper[msg.sender]);
        _;
    }

    function isInTransit(string itemId) 
    constant 
    public 
    returns(bool) {
        if(bytes(shipments[itemId].itemId).length != 0) {
            return true;
        } else {
            return false;
        }
    }

    function ship(string itemId, address from, address to) 
    onlyRegisteredShipper 
    public {
        shipments[itemId] = Shippment({itemId: itemId, from: from, to: to, shipper: msg.sender, status: ShippmentStatus.InTransit});
    }
    
    function updateShipmentStatus(string itemId, uint8 status) 
    onlyRegisteredShipper
    public {
        require(bytes(shipments[itemId].itemId).length != 0);
        require(shipments[itemId].shipper == msg.sender);
        require(status <= uint8(ShippmentStatus.Delivered));

        if(status == 1) {
            shipments[itemId].status = ShippmentStatus.Delivered;   
        }
    }
    
    function addShipper(address shipper) public {
        registeredShipper[shipper] = true;
    }
}