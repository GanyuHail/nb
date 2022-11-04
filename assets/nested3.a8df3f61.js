import { c as client, j as jsx, R as React } from "./jsx-runtime.94186190.js";
/* empty css                  */function StoreApp() {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: "0.01"
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert("Transaction completed by " + details.payer.name.given_name);
      });
    }
  }).render("#paypal");
}
client.createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx(React.StrictMode, {
  children: /* @__PURE__ */ jsx(StoreApp, {})
}));
