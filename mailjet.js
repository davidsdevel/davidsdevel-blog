const mailjet = require ('node-mailjet')
.connect('8a708d779d53155525ae0164e3a506cc', 'bb7e3e81cbb08a5e23d7372dbbca1b3e')


const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "djgm1206@gmail.com",
        "Name": "David"
      },
      "To": [
        {
          "Email": "djgm1206@gmail.com",
          "Name": "David"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
})


request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
