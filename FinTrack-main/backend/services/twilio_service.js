// Importar twilo
const twilio = require('twilio');

// KEYS
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const numeroOrigen = process.env.NUMERO_ORIGEN;

// Creación del objeto para enviar mensajes
const client = twilio(accountSid, authToken);


async function enviarSMS(numeroDestino, nombreUsuario) {


  try {
    return client.messages.create({
    body: `FinTrack te da la bienvenida ${nombreUsuario}, nos alegra tenerte con nosotros.`,
    from: "+17432564072",
    to: "+523111021664"
    })
    .then(message => console.log('Mensaje enviado:', message.sid) )
    .catch(error => console.error('Error:', error.message) );

  } catch (error) {
    console.error('Error al enviar SMS:', error);
    throw error;
  }



}

module.exports = { enviarSMS };