pragma solidity ^0.4.11;

contract Orderable {
    
    enum OrderStatus { Active, Complete }
    struct Order {
        string orderId;
        string itemId;
        address from;
        address to;
        uint amount;
        OrderStatus status;
    }
    
    mapping(string => Order) orders;
    
    function placeOrder(string orderId, string itemId, address from, address to, uint amount) public {
        orders[orderId] = Order({orderId:orderId, itemId: itemId, from: from, to: to, amount: amount, status: OrderStatus.Active});
    }
    
    function isActiveOrder(string orderId) constant public returns (bool) {
        if(bytes(orders[orderId].orderId).length == 0) {
            return false;
        }
        if(orders[orderId].status != OrderStatus.Active) {
            return false;
        }
        return true;
    }
    
    function isRecipient(string orderId, address addr) 
    constant 
    public 
    returns (bool){
        return (orders[orderId].to == addr);
    }

    function getOrderFromAndTo(string orderId) 
    constant 
    public 
    returns (address from, address to) {
        return (orders[orderId].from, orders[orderId].to);
    }
    
    function getOrderItemId(string orderId)
    constant
    public
    returns (string) {
        return orders[orderId].itemId;
    }

    function settleOrder(string orderId) 
    internal {
        address from = orders[orderId].from;
        uint amount = orders[orderId].amount;

        require(this.balance >= amount);
                
        from.transfer(amount);

        delete orders[orderId];
    }
}