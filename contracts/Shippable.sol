pragma solidity ^0.4.11;

contract Shippable {
    
    enum ShipmentStatus { InTransit, Delivered }
    struct Shippment {
        string orderId;
        string itemId;
        address from;
        address to;
        address shipper;
        ShipmentStatus status;
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
        if(bytes(shipments[orderId].orderId).length != 0) {
            return true;
        } else {
            return false;
        }
    }

    function ship(string orderId, string itemId, address from, address to) 
    onlyRegisteredShipper 
    public {
        shipments[orderId] = Shippment({orderId:orderId, itemId: itemId, from: from, to: to, shipper: msg.sender, status: ShipmentStatus.InTransit});
    }
    
    function updateShipmentStatus(string orderId, uint8 status) 
    onlyRegisteredShipper
    public {
        require(bytes(shipments[orderId].orderId).length != 0);
        require(shipments[orderId].shipper == msg.sender);
        require(status <= uint8(ShipmentStatus.Delivered));

        if(status == 1) {
            shipments[orderId].status = ShipmentStatus.Delivered;   
        }
    }
    
    function getShipmentStatus(string orderId) 
    constant
    public
    returns (ShipmentStatus) {
        return shipments[orderId].status;
    }
    
    function getShipper(string orderId) 
    constant
    public
    returns (address) {
        return shipments[orderId].shipper;
    }
    
    function addShipper(address shipper) public {
        registeredShipper[shipper] = true;
    }
    
    function isShipper(address shipper) 
    constant 
    public 
    returns(bool) {
        return (registeredShipper[shipper]);
    }
}