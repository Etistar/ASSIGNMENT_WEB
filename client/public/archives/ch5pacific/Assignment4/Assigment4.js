document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const errorArea = document.getElementById("errorArea");

    form.addEventListener("submit", (event) => {
        // Immediately prevent the default form submission to force validation
        event.preventDefault();
        
        // Reset the error display area
        errorArea.innerHTML = "";
        let errors = [];

        // 1. OBJECT CREATION: Store all form data inside a structured JavaScript object
        const formData = {
            "First Name": document.getElementById("firstName").value.trim(),
            "Last Name": document.getElementById("lastName").value.trim(),
            "Email": document.getElementById("email").value.trim(),
            "Age": document.getElementById("age").value.trim(), 
            "Address": document.getElementById("address").value.trim(),
            "City": document.getElementById("city").value.trim(),
            "Province": document.getElementById("province").value,
            "Postal Code": document.getElementById("postalCode").value.trim(),
            "Password": document.getElementById("password").value,
            "Confirm Password": document.getElementById("confirmPassword").value
        };

        // 2. REQUIREMENT 1: Dynamic blank field validation using the object keys
        // Loop through the object properties to find and name specific missing inputs
        let hasEmptyFields = false;
        for (const key in formData) {
            if (formData[key] === "") {
                errors.push(`The field "${key}" cannot be left blank.`);
                hasEmptyFields = true;
            }
        }

        // 3. COMPLEX VALIDATIONS: Only run if all fields have data entered
        if (!hasEmptyFields) {
            
            // Requirement 2: Email format verification (email@domain.tld)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData["Email"])) {
                errors.push("Email must match the format 'email@domain.tld'.");
            }

            // Requirement 3: Age must be 18 or older
            const ageNum = parseInt(formData["Age"], 10);
            if (isNaN(ageNum) || ageNum < 18) {
                errors.push("Age must be 18 or older.");
            }

            // Requirement 4: Province must be QC, ON, MN, SK, AB, or BC
            const validProvinces = ["QC", "ON", "MN", "SK", "AB", "BC"];
            if (!validProvinces.includes(formData["Province"])) {
                errors.push("Province must be QC, ON, MN, SK, AB, or BC.");
            }

            // Requirement 5: Postal Code format verification (A0A0A0)
            const postalRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
            if (!postalRegex.test(formData["Postal Code"])) {
                errors.push("Postal Code must match the format 'A0A0A0' without spaces.");
            }

            // Requirement 6: Password standard conditions
            const pass = formData["Password"];
            // a. 6+ characters long
            if (pass.length < 6) {
                errors.push("Password must be at least 6 characters long.");
            }
            // b. Must contain a digit
            if (!/\d/.test(pass)) {
                errors.push("Password must contain at least one digit.");
            }
            // c. Must contain an uppercase character
            if (!/[A-Z]/.test(pass)) {
                errors.push("Password must contain at least one uppercase letter.");
            }

            // Requirement 7: Password and Confirm Password matching verification
            if (pass !== formData["Confirm Password"]) {
                errors.push("Password and Confirm Password fields must have an identical value.");
            }
        }

        // 4. OUTPUT PROCESSING: Handle the results of the validation check
        if (errors.length > 0) {
            // Display specific errors clearly on the form
            errorArea.style.color = "red";
            errorArea.innerHTML = errors.map(err => `• ${err}`).join("<br>");
        } else {
            // If all validation rules pass, display the required alert and reset the form
            alert("Thanks for registering! Our staff will contact you shortly.");
            form.reset(); 
        }
    });
});