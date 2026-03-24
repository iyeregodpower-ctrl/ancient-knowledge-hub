id="newsletter-final"
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("newsletter-form");
    const emailInput = document.getElementById("newsletter-email");
    const message = document.getElementById("newsletter-message");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            message.textContent = "Please enter your email.";
            message.style.color = "red";
            return;
        }

        // 1️⃣ Save to Supabase
        const { error } = await db
            .from("newsletter")
            .insert([{ email }]);

        if (error) {
            if (error.message.includes("duplicate")) {
                message.textContent = "You're already subscribed!";
            } else {
                message.textContent = "Something went wrong.";
            }
            message.style.color = "red";
            console.error(error);
            return;
        }

        // 2️⃣ Send Welcome Email
        emailjs.send("service_ps6pgde", "template_ihbyvtm", {
            email: email
        })
        .then(() => {
            console.log("Welcome email sent!");
        })
        .catch(err => {
            console.error("Email failed:", err);
        });

        message.textContent = "Subscribed successfully! Check your email 🎉";
        message.style.color = "gold";

        emailInput.value = "";
    });

});