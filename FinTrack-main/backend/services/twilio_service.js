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
    body: `🔥 FinTrack te da la bienvenida 🔥\n\n${nombreUsuario}, nos alegra tenerte con nosotros.\n\n` +
      `📊 Con FinTrack podrás:\n` +
      `- Registrar metas de ahorro y presupuestos\n` +
      `- Acceder a contenido que mejorará tus habilidades financieras\n` +
      `- Usar el historial para seguir todos tus movimientos a lo largo del tiempo\n\n` +
      `¡Gracias por confiar en nosotros! 🚀`,
    
    from: numeroOrigen,
    to: numeroDestino
    });
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    throw error;
  }

  
  
}

module.exports = { enviarSMS };
