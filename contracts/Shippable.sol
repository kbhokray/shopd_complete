pragma solidity ^0.4.11;

contract Shippable {
    
    enum ShippmentStatus { InTransit, Delivered }
    struct Shippment {
        string orderId;
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

    function isInTransit(string orderId) 
    constant 
    public 
    returns(bool) {
        if(bytes(shipments[orderId].itemId).length != 0) {
            return true;
        } else {
            return false;
        }
    }

    function ship(string orderId, string itemId, address from, address to) 
    onlyRegisteredShipper 
    public {
        shipments[orderId] = Shippment({orderId:orderId, itemId: itemId, from: from, to: to, shipper: msg.sender, status: ShippmentStatus.InTransit});
    }
    
    function updateShipmentStatus(string orderId, uint8 status) 
    onlyRegisteredShipper
    public {
        require(bytes(shipments[orderId].itemId).length != 0);
        require(shipments[orderId].shipper == msg.sender);
        require(status <= uint8(ShippmentStatus.Delivered));

        if(status == 1) {
            shipments[orderId].status = ShippmentStatus.Delivered;   
        }
    }
    
    function addShipper(address shipper) public {
        registeredShipper[shipper] = true;
    }
}