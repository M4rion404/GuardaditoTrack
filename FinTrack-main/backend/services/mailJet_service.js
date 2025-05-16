// mailer.js
const mailjet = require('node-mailjet');


const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET_KEY;
const correo = process.env.EMAIL;

const mailjetClient = mailjet.apiConnect(apiKey, apiSecret);

async function enviarEmail({ destinatario, nombre, asunto, mensaje }) {
  try {
    
    const result = await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: correo,
            Name: 'FinTrack'
          },
          To: [
            {
              Email: destinatario,
              Name: nombre
            }
          ],
          Subject: asunto,
          TextPart: mensaje,
          HTMLPart: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Bienvenido a FinTrack</title>
  <style>
    body {
      background-color: #f5f8fa;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #2278b5;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .content {
      padding: 30px;
      color: #333333;
    }

    .content p {
      line-height: 1.6;
    }

    .content ul {
      padding-left: 20px;
    }

    .button-container {
      text-align: center;
      margin-top: 30px;
    }

    .btn {
      background-color: #00bfa6;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
    }

    .footer {
      background-color: #f5f8fa;
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bienvenido a FinTrack, ${nombre} 👋</h1>
    </div>
    <div class="content">
      <p>¡Nos alegra mucho tenerte con nosotros!</p>
      <p>FinTrack es tu nueva herramienta para dominar tus finanzas personales. A partir de hoy podrás:</p>
      <ul>
        <li>📊 Crear presupuestos y metas de ahorro</li>
        <li>💡 Recibir contenido educativo para mejorar tus finanzas</li>
        <li>📜 Consultar tu historial de movimientos y progreso</li>
      </ul>
      <p>Estamos emocionados de acompañarte en este camino financiero.</p>

      <div class="button-container">
        <a href="http://localhost:3001/" class="btn">Empezar ahora</a>
      </div>
    </div>
    <div class="footer">
      © 2025 FinTrack. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
`
        }
      ]
    });

    console.log('📧 Correo enviado con éxito:', result.body);
    return true;

  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw error;
  }
}

module.exports = { enviarEmail };
