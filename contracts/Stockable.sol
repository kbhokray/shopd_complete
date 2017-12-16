pragma solidity ^0.4.11;

contract Stockable {

    enum ItemStatus { InStock, Delivered }
    
    struct Item {
        string itemId;
        string itemName;
        uint price;
        address owner;
        ItemStatus status;
    }
    
    mapping(string => Item) stock;
    
    function isInStock(string itemId) constant public returns(bool) {
        if(bytes(stock[itemId].itemId).length == 0) {
            return false;
        } else {
            return true;
        }
    }
    
    function addToStock(address owner, string itemId, string itemName, uint price) public returns(bool) {
        stock[itemId] = Item({itemId: itemId, itemName: itemName, owner: owner, price: price, status: ItemStatus.InStock});
    }
    
    function isBuyable(address orderer, string itemId, uint payment) constant public returns (bool){
        if(!isInStock(itemId)) {
            return false;
        }

        Item storage item = stock[itemId];

        if(item.owner == orderer) {
            return false;
        }
        if(item.status != ItemStatus.InStock) {
            return false;
        }
        if(item.price > payment) {
            return false;
        }
        
        return true;
    }
    
    function getOwner(string itemId) constant public returns (address) {
        return stock[itemId].owner;
    }
    
    function removeFromStock(string itemId) internal {
        delete stock[itemId];
    }
}