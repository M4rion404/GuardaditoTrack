const twilio = require('twilio');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function enviarSMS({ mensaje, numeroDestino, numeroOrigen }) {
  return client.messages.create({
    body: mensaje,
    from: numeroOrigen,
    to: numeroDestino
  });
}

module.exports = { enviarSMS };
