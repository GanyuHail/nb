require("dotenv").config();
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("src"));
app.use(express.json());
const paypal = require("@paypal/checkout-server-sdk");
const Environment = paypal.core.LiveEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    {}.PAYPAL_CLIENT_ID,
    {}.PAYPAL_CLIENT_SECRET
  )
);
const storeItems = /* @__PURE__ */ new Map([
  [1, { price: 100, name: "Learn React Today" }],
  [2, { price: 200, name: "Learn CSS Today" }]
]);
app.get("/", (req, res) => {
  res.render("index", {
    paypalClientId: {}.PAYPAL_CLIENT_ID
  });
});
app.post("/create-order", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  const total = req.body.items.reduce((sum, item) => {
    return sum + storeItems.get(item.id).price * item.quantity;
  }, 0);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "GBP",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "GBP",
              value: total
            }
          }
        },
        items: req.body.items.map((item) => {
          const storeItem = storeItems.get(item.id);
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "GBP",
              value: storeItem.price
            },
            quantity: item.quantity
          };
        })
      }
    ]
  });
  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.listen(5173);
