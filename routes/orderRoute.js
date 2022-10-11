const { Router } = require("express");
const routerOrder = Router();
const order = require("../controllers/order");
routerOrder.post("/order", order.createOrder);
routerOrder.get("/order", order.getOrders);
routerOrder.delete("/order/:id",order.deleteOrder);
routerOrder.get("/order/:id",order.getSingleOrder);
routerOrder.put("/order/:id",order.updateOrder);
routerOrder.get("/order/get/totalsales",order.totalSales);
routerOrder.get("/order/get/count",order.orderCount);

module.exports = routerOrder;
