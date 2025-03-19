// No need to modify this.
function validateCheckoutForm(initialLoad = false) {
  let response = {
    validated: true,
    message: null,
  };

  let focused = false;
  let hasError = false;
  let erorMessage = "";

  // first required validation
  let requiredValidation = document.querySelectorAll(
    "#tripzzy-checkout-form [required]"
  );
  if (requiredValidation.length > 0) {
    requiredValidation.forEach(function (inputElement) {
      let inputVal = inputElement.value;
      let inputLabel = inputElement
        .closest(".tripzzy-form-field")
        .getAttribute("title");

      inputElement.classList.remove("has-error");
      if (!inputVal) {
        hasError = true;
        erorMessage += "* " + inputLabel + " is required field. </br />";
        if (!initialLoad) {
          inputElement.classList.add("has-error"); // not for init.
          if (!focused) {
            focused = true;
            inputElement.focus();
          }
        }
      }
    });
  }
  // email validation.
  let emailValidation = document.querySelectorAll(
    "#tripzzy-checkout-form input[type=email]"
  );
  if (emailValidation.length > 0) {
    emailValidation.forEach(function (inputElement) {
      let inputVal = inputElement.value;
      let inputLabel = inputElement
        .closest(".tripzzy-form-field")
        .getAttribute("title");
      inputElement.classList.remove("has-error");

      // Regx for email id validation.
      let validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (inputVal && !inputVal.match(validRegex)) {
        hasError = true;
        erorMessage += "* " + inputLabel + " is not valid. </br />";
        if (!initialLoad) {
          inputElement.classList.add("has-error"); // not for init.
          if (!focused) {
            focused = true;
            inputElement.focus();
          }
        }
      }
    });
  }

  // Return response.
  if (hasError) {
    response.validated = false;
    response.message = erorMessage;
  }
  return response;
}

// No need to modify this.
function displayErrorMessage(erorMessage) {
  // ErrorElements
  let errorWrapperElement = document.getElementById(
    "tripzzy-checkout-form-response-msg"
  );
  let errorTitleElement = document.getElementById(
    "tripzzy-checkout-form-response-title"
  );
  let errorMessageElement = document.getElementById(
    "tripzzy-checkout-form-response"
  );

  if (erorMessage) {
    errorWrapperElement.classList.add("tripzzy-response-msg", "tripzzy-error");
    errorTitleElement.innerHTML = "Error";
    errorMessageElement.innerHTML = erorMessage;
  } else {
    errorWrapperElement.classList.remove(
      "tripzzy-response-msg",
      "tripzzy-error"
    );
    errorTitleElement.innerHTML = "";
    errorMessageElement.innerHTML = "";
  }
}

// No need to modify this.
function getPaymentDescription() {
  const { payment_description } = tripzzy;
  return payment_description;
}

function initiateMyPayment() {
  let paymentButtonWrapper = document.getElementById("tripzzy-payment-button");
  try {
    let buttonTemplate = wp.template("tripzzy-pay-now");
    paymentButtonWrapper.innerHTML = buttonTemplate();
    paymentButtonWrapper.classList.remove("tripzzy-is-processing");

    let paymentBtn = paymentButtonWrapper.querySelector(
      "input[name='tripzzy_book_now']"
    );
    // Payment Details
    let paymentDetailElement = document.getElementById(
      "tripzzy-payment-details"
    );

    // Form Element.
    let formElement = document.getElementById("tripzzy-checkout-form");

    let amount = paymentButtonWrapper.getAttribute("data-total");
    let currency = paymentButtonWrapper.getAttribute("data-currency");
    amount = amount;
    let firstName = document.getElementById("billing-first-name")
      ? document.getElementById("billing-first-name").value
      : "";
    let lastName = document.getElementById("billing-last-name")
      ? document.getElementById("billing-last-name").value
      : "";
    let billingEmail = document.getElementById("billing-email")
      ? document.getElementById("billing-email").value
      : "";
    let billingPhone = document.getElementById("billing-phone")
      ? document.getElementById("billing-phone").value
      : "";
    let billingCity = document.getElementById("billing-city")
      ? document.getElementById("billing-city").value
      : "";
    let billingCountry = document.getElementById("billing-country")
      ? document.getElementById("billing-country").value
      : "";

    const { gateway } = tripzzy || {};
    // const { my_gateway } = gateway || {};
    // const { key_id } = my_gateway;

    if (currency !== "NPR") {
      setTimeout(function () {
        paymentButtonWrapper.classList.remove("tripzzy-is-processing");
      }, 100);
      displayErrorMessage("My Payment only Supports NPR.");
      paymentBtn.disabled = true;
      return;
    }

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
  } catch (e) {
    displayErrorMessage(e.message);
    // paymentButtonWrapper.classList.remove("tripzzy-is-processing");
    setTimeout(function () {
      paymentButtonWrapper.classList.remove("tripzzy-is-processing");
    }, 100);
  }
}

initiateMyPayment();

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
