const mailjet = require('node-mailjet'); 

const apiKey = "a926ffbf40080e2166bf551b9f6d2a6a";
const apiSecret = "98447a4099a9b2d3d43d1fd58151dbb7";

const mailjetClient = mailjet.apiConnect(apiKey, apiSecret);

async function enviarCorreo(destinatario, asunto, nombreUsuario) {
  const htmlContenido = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fintrack - Controla tu futuro financiero</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color: #ffffff; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <tr>
        <td style="background-color: #004e92; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Fintrack</h1>
          <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0;">Tu camino hacia la libertad financiera</p>
        </td>
      </tr>

      <tr>
        <td style="padding: 30px;">
          <h2 style="color: #004e92;">Hola ${nombreUsuario},</h2>
          <p style="color: #333333; font-size: 16px; line-height: 1.6;">
            Fintrack es la plataforma perfecta para llevar un control total de tus gastos, ingresos y metas financieras. Ya seas estudiante, trabajador independiente o empresario, <strong>Fintrack</strong> se adapta a ti.
          </p>

          <ul style="padding-left: 20px; color: #333333;">
            <li>✔ Registro automático de movimientos</li>
            <li>✔ Análisis visual con gráficos en tiempo real</li>
            <li>✔ Objetivos y alertas personalizadas</li>
            <li>✔ Disponible desde cualquier dispositivo</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://localhost:3001/Login" target="_blank" style="background-color: #4CAF50; color: #ffffff; padding: 15px 30px; text-decoration: none; font-size: 16px; border-radius: 5px;">
              Inicia sesión ahora
            </a>
          </div>

          <p style="font-size: 14px; color: #888888; text-align: center;">
            ¿Tienes preguntas? Responde a este correo o visita nuestro sitio web.
          </p>
        </td>
      </tr>

      <tr>
        <td style="background-color: #004e92; padding: 20px; text-align: center;">
          <p style="color: #ffffff; font-size: 14px; margin: 0;">© 2025 Fintrack. Todos los derechos reservados.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    const request = await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "jealsanchezto@ittepic.edu.mx",
              Name: "FinTrack",
            },
            To: [
              {
                Email: destinatario,
                Name: nombreUsuario,
              },
            ],
            Subject: asunto,
            HTMLPart: htmlContenido,
          },
        ],
      });

    console.log("Correo enviado correctamente:", request.body);
    return request.body;
  } catch (error) {
    console.error("Error al enviar correo:", error?.response?.body || error.message);
    throw error;
  }
}

module.exports = { enviarCorreo };