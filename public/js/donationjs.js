// first request - to server to create order

var orderId;
$(document).ready(function () {
    var settings = {
        "url": "/donation/create/orderId",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "amount": "3300"
        }),
    };

    //creates new orderId everytime
    $.ajax(settings).done(function (response) {

        orderId = response.orderId;
        console.log(orderId);
        $("button").show();
    });
});


document.getElementById('rzp-button1').onclick = function(e){
    var options = {
        "key": "rzp_test_ngxOrke35Nhg0f", // Enter the Key ID generated from the Dashboard
        "amount": "3300", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Mohitech",
        "description": "High quality Tech",
        "image": "https://example.com/your_logo",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the previous step
        "handler": function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)
            var settings = {
                "url": "/api/payment/verify",
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/json"
                },
                "data": JSON.stringify({response}),
              }
              $.ajax(settings).done(function(renponse) {
                  alert(JSON.stringify(response));
              })
        },
        
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    document.getElementById('rzp-button1').onclick = function(e){
        rzp1.open();
        e.preventDefault();
    }}

 