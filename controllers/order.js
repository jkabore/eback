const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const OrderItem = require("../models/orderItemSchema");

//create order
module.exports.createOrder = async (req, res) => {
  // using promise.all() to resolve pending promises errors
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice
}))

const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

  const {
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    
    user,
  } = req.body;
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice: totalPrice  ,
    user,
  });
  try {
    order = await order.save();
    return res.status(200).send(order);
  } catch (error) {
    console.log("order", error);
    return res.status(404).send("category cannot be created");
  }
};

/// getting orders
module.exports.getOrders = async (req, res) => {
  try {
    const orderList = await Order.find({})
      .populate("user", "name")
      .sort({ dateOrdered: -1 });

    res.status(200).send(orderList);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/// getting single order
module.exports.getSingleOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      })
      .sort({ dateOrdered: -1 });

    res.status(200).send(order);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
////update order
module.exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)){
      return res
      .status(400)
      .send(" Invalid order Id" );
    }
    const { status } = req.body;
  
    const order= await Order  .findByIdAndUpdate(id, {
     status
    },{
      new: true,
    });
    if (!order) {
      return res
        .status(500)
        .json({ message: "order cannot be updated" });
    }
    res.status(200).send(order);
  };
   ////delete order
module.exports.deleteOrder = (req, res) => {
    const { id } = req.params;
  
    Order.findByIdAndRemove(id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
  };

  
//// order count
module.exports.orderCount = (req, res) => {
    Order.countDocuments({})
      .then((orderCount) => {
        if (!orderCount) {
          return res.status(400).json({ success: false });
        } else {
         return res.status(200).send({
            success: true,
            orderCount: orderCount,
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err.message });
      });}


      
//// product count
module.exports.totalSales = async(req, res) => {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
      }