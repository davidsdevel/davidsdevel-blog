const nodemailer = require("nodemailer");

class Mail {
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "djgm1206@gmail.com",
				pass: "26929862"
			}
		});
	}
	sendEmail(data) {
		return new Promise((resolve, reject) => {
			const {email} = data;
			const mailOptions = {
				from: 'vindication@enron.com',
				to: email,
				subject: 'Invoices due',
				html: 'Dudes, we really need your money.'
			};

			this.transporter.sendMail(mailOptions, (err, info) => {
				if (err) return reject(err);
				resolve(info);
			});
		});
	}
}

module.exports = Mail;
