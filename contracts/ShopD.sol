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
    
    function placeOrder(string itemId) public payable {
        require(super.isBuyable(msg.sender, itemId, msg.value));
        
        address itemOwner = super.getOwner(itemId);
        super.placeOrder(itemId, itemOwner, msg.sender, msg.value);
    }

    function shipOrder(string itemId) public {
        require(super.isActiveOrder(itemId));
        require(!super.isInTransit(itemId));

        address from;
        address to;
        (from, to) = super.getOrderFromAndTo(itemId);
        super.ship(itemId, from, to);
    }
    
    function settle(string itemId) public {
        require(super.isActiveOrder(itemId));
        require(super.isRecipient(itemId, msg.sender));
        
        super.settleOrder(itemId);
        super.removeFromStock(itemId);
    }

    function addShipper(address shipper) 
    onlyOwner 
    public {
        super.addShipper(shipper);
    }
}