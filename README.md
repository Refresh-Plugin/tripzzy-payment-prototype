## Instruction
Tripzzy Payment Prototype provides a framework to integrate a custom payment gateway with the Tripzzy plugin. It includes essential files to define, configure, and manage payment processing.

Our Prototype consists of three main files:

1. main.php – The core plugin file containing the plugin header, essential includes, and initialization logic.
   
2. PaymentGatey/MyGateway.php – Defines and configures the custom payment gateway, handling gateway-specific settings and processing.
   
3. assets/payment.js – Manages the checkout process, handling frontend payment interactions and communication with the gateway.
This structure ensures a streamlined and organized payment integration within the plugin.

### Getting Started

**Rename main.php**
you can rename the main.php as per your payment gateway or keep as it is.

**Update Your Plugin header**
   
> **Plugin Name:** Tripzzy Payment Prototype  
> **Plugin URI:** [https://wptripzzy.com](https://wptripzzy.com)  
> **Description:** Payment prototype allows you to create a custom payment gateway for Tripzzy.  
> **Version:** 1.0.0  
> **Author:** WP Tripzzy  
> **Author URI:** [https://wptripzzy.com](https://wptripzzy.com)  
> **License:** GPLv3  
> **License URI:** [http://www.gnu.org/licenses/gpl-3.0.html](http://www.gnu.org/licenses/gpl-3.0.html)  
> **Text Domain:** `payment-prototype`  
> **Domain Path:** `/languages/`  

**Please replase these texts in the prototype with your own text**

- MY_GATEWAY_URL
- my_gateway_init
- MyGateway
- My Gateway

**Rename MyGateway.php file to your name**

- require_once 'PaymentGateway/MyGateway.php';
  
Update the file name accordingly and modify the require statement in main.php:


Thats it for the main.php file.

**Now, Lets edit your Modified MyGateway.php file**

At this point, we assume you modified your above text. Now, here you only need to check the callback functions.

1. payment_gateway_args – **Required callback function**. This will add the Gateway configuration fields in fields key. like:
   ```
    // My Gateway Key.
	'key_id' => array(
        'name'  => 'key_id',
        'type'  => 'text',
        'label' => __( 'My Gateway Key' ),
        'value' => '',
    ),

- Where name refers to config field name.
- type refers the input Default field type is text and supported field types are text, textarea, heading, dropdown.
- label refers to Field label.
- value refers to default value of the field.
   
2. gateway_scripts – **Required callback function**. This will handle Loading script for checkout page. Only load payment gateway specific script defined here if the respective gateway button is clicked.
   
3. localized_variables – Optional callback function. If you handle payment vai php, you don't need it. You can remove this callback and above hook (`add_filter( 'tripzzy_filter_localize_variables', array( __CLASS__, 'localized_variables' ) );`), if you are not using javascript to handle payment script.

** And finally, Lets edit your payment.js file**

Here you only need to look at 2 things.

1. Check the '#tripzzy-payment-mode-my_gateway' Id of the button is correct or not in the checkout page. 
    ``` 
    // Payment option Button click event.
    document.addEventListener("click", function (event) {
        var target = event.target;
        var paymentOption = document.querySelector(
            "#tripzzy-payment-mode-my_gateway"
        );

        if (target === paymentOption) {
            initiateMyPayment();
        }
    });

2. Handle the payment button event
    ```
    paymentBtn.onclick = function (e) {
    let response = validateCheckoutForm(true);
        if (response.validated) {
        e.preventDefault();

        // if validated Proceed your payment.

        // add payment response to paymentDetailElement
        let response = {};
        paymentDetailElement.value = JSON.stringify(response);

        // Proceed form after payment complete
        alert("form validated and now proceed to booking.");
        formElement.submit();
        }
    };

### Final Steps
After completing the above modifications, your payment gateway should be fully functional within Tripzzy. 🎉

For further customization, refer to the Tripzzy documentation or contact support.