pragma solidity ^0.4.11;

contract Orderable {
    
    enum OrderStatus { Active, InActive }
    struct Order {
        string itemId;
        address from;
        address to;
        uint amount;
        OrderStatus status;
    }
    
    mapping(string => Order) orders;
    
    function placeOrder(string itemId, address from, address to, uint amount) public {
        orders[itemId] = Order({itemId: itemId, from: from, to: to, amount: amount, status: OrderStatus.Active});
    }
    
    function isActiveOrder(string itemId) constant public returns (bool) {
        if(bytes(orders[itemId].itemId).length == 0) {
            return false;
        }
        if(orders[itemId].status != OrderStatus.Active) {
            return false;
        }
        return true;
    }
    
    function isRecipient(string itemId, address addr) 
    constant 
    public 
    returns (bool){
        return (orders[itemId].to == addr);
    }

    function getOrderFromAndTo(string itemId) 
    constant 
    public 
    returns (address from, address to) {
        return (orders[itemId].from, orders[itemId].to);
    }
    
    function settleOrder(string itemId) 
    internal {
        address from = orders[itemId].from;
        uint amount = orders[itemId].amount;

        require(this.balance >= amount);
                
        from.transfer(amount);

        delete orders[itemId];
    }
}