(function(){
  emailjs.init("jHOZi2x_3bcXNcb-U")
})()

const form = document.getElementById("contact-form")
const status = document.getElementById("form-status")

form.addEventListener("submit", function(e){
  e.preventDefault()

  emailjs.sendForm(
    "service_ps6pgde",
    "template_szx85g8",
    this
  )
  .then(() => {
    status.innerText = "Message sent successfully!"
    form.reset()
  })
  .catch(() => {
    status.innerText = "Failed to send message."
  })
})