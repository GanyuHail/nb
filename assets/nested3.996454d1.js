import { c as client, a as jsx, R as React } from "./jsx-runtime.b46df4c1.js";
/* empty css                  */paypal.Buttons({
  createOrder: function() {
    return fetch("/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: [{
          id: 1,
          quantity: 2
        }, {
          id: 2,
          quantity: 3
        }]
      })
    }).then((res) => {
      if (res.ok)
        return res.json();
      return res.json().then((json) => Promise.reject(json));
    }).then(({
      id
    }) => {
      return id;
    }).catch((e) => {
      console.error(e.error);
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert("Transaction completed by " + details.payer.name.given_name);
    });
  }
}).render("#paypal");
function StoreApp() {
}
client.createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx(React.StrictMode, {
  children: /* @__PURE__ */ jsx(StoreApp, {})
}));
