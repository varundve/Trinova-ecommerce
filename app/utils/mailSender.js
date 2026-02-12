import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

class MailSender {
  constructor() {
    this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ;
    this.templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  }

  validateParams(name, email, message) {
    if (!name || !email || !message) {
      toast.error("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return false;
    }

    if (message.length < 5) {
      toast.error("Message is too short");
      return false;
    }

    return true;
  }

  async sendMail(name, email, message) {
    if (!this.validateParams(name, email, message)) return false;

    try {
      await emailjs.send(
        this.serviceId,
        this.templateId,
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        this.publicKey
      );

      toast.success("Message sent successfully 🚀");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message ❌");
      return false;
    }
  }
}

export default MailSender;
