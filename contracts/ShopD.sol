pragma solidity ^0.4.11;

import './Stockable.sol';
import './Orderable.sol';
import './Shippable.sol';

contract ShopD is Stockable, Orderable, Shippable {

    address public owner;

    function ShopD() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function addItem(string itemId, string itemName, uint price) public {
        require(!super.isInStock(itemId));
        
        super.addToStock(msg.sender, itemId, itemName, price);
    }
    
    function order(string orderId, string itemId) public payable {
        require(super.isBuyable(msg.sender, itemId, msg.value));
        
        address itemOwner = super.getOwner(itemId);
        super.placeOrder(orderId, itemId, itemOwner, msg.sender, msg.value);
    }

    function shipOrder(string orderId) public {
        require(super.isActiveOrder(orderId));
        require(!super.isInTransit(orderId));
        var itemId = super.getOrderItemId(orderId);

        address from;
        address to;
        (from, to) = super.getOrderFromAndTo(orderId);
        super.ship(orderId, itemId, from, to);
    }
    
    function settle(string orderId) public {
        require(super.isActiveOrder(orderId));
        require(super.isRecipient(orderId, msg.sender));
        var itemId = super.getOrderItemId(orderId);

        super.settleOrder(orderId);
        super.changeOwner(itemId, msg.sender);
    }

    function addShipper(address shipper) 
    onlyOwner 
    public {
        super.addShipper(shipper);
    }
}