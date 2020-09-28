var nodemailer = require('nodemailer');

var sendEmail = (email, un, pass) =>{
    var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'aron.lo.li@hotmail.com',
          pass: process.env.EMAIL_PASS
        }
      });
      
      var mailOptions = {
        from: 'aron.lo.li@hotmail.com',
        to: email,
        subject: '¡Cuenta registrada existosamente!',
        text: 'That was easy!',
        html: `
        <h1>Tesis: Recolección de Patrones de Tecleo</h1>
        <p>Usuario: ${un}</p>
        <p>Contraseña: ${pass}</p>
        <p>Te agradezco mucho por participar en las pruebas.</p>
        <p>Número de contacto: 959291344</p>
        <p>Aron Lo</p>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

export {sendEmail}