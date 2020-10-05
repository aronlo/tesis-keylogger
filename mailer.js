const mailgun = require("mailgun-js");
var { generatePDF } = require("./utils")
const fs = require('fs')

const mg = mailgun({
  apiKey: process.env.MAILGUN_API,
  domain: process.env.MAILGUN_DOMAIN
});


var sendEmailWord = async (email, name, lastname, dni, un, pass) => {
  
  var html =
      `
      <h1>Tesis: Recolección de Patrones de Tecleo</h1>
      <p>Usuario: ${un}</p>
      <p>Contraseña: ${pass}</p>
      <br>
      <b><p>Por favor completar y devolver el documento de consentimiento firmado a <a href="mailto:aron.lo@yahoo.com?subject=Consulta">aron.lo@yahoo.com</a></p></b>
      <p>Te agradezco mucho por participar en las pruebas.</p>
      <p>Número de contacto: 959291344</p>
      <p>Aron Lo</p>
      `
  var path = await generatePDF(name, lastname, dni)
  var mailOptions = {
    from: 'Aron Lo <aron.lo.li@hotmail.com>',
    to: email,
    cc: 'aron.lo@yahoo.com',
    subject: '¡Cuenta registrada existosamente!',
    html: html,
    attachment: [path.toString(), './docs/devolver_doc_consentimiento.docx']
  };

  mg.messages().send(mailOptions, function (error, body) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + body.id);
      fs.unlink(path.toString(), err => {
        if (!err) console.log(path.toString() + " deleted");
      })
    }
  });
}

var sendEmail = async (email, name, lastname, dni, un, pass) => {
  
  var html =
      `
      <h1>Tesis: Recolección de Patrones de Tecleo</h1>
      <p>Usuario: ${un}</p>
      <p>Contraseña: ${pass}</p>
      <p>Te agradezco mucho por participar en las pruebas.</p>
      <p>Número de contacto: 959291344</p>
      <p>Aron Lo</p>
      `
  var path = await generatePDF(name, lastname, dni)
  var mailOptions = {
    from: 'Aron Lo <aron.lo.li@hotmail.com>',
    to: email,
    cc: 'aron.lo@yahoo.com',
    subject: '¡Cuenta registrada existosamente!',
    html: html,
    attachment: path.toString()
  };

  mg.messages().send(mailOptions, function (error, body) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + body.id);
      fs.unlink(path.toString(), err => {
        if (!err) console.log(path.toString() + " deleted");
      })
    }
  });
}


var sendRecoverPassEmail = async (email, name, lastname, dni ,un, pass) => {

  var html =
    `
      <h1>Tesis: Recolección de Patrones de Tecleo</h1>
      <p>Usuario: ${un}</p>
      <p>Contraseña: ${pass}</p>
      <p>Te agradezco mucho por participar en las pruebas.</p>
      <p>Número de contacto: 959291344</p>
      <p>Aron Lo</p>
      `

  var path = await generatePDF(name, lastname, dni)
  var mailOptions = {
    from: 'Aron Lo <aron.lo.li@hotmail.com>',
    to: email,
    cc: 'aron.lo@yahoo.com',
    subject: '¡Datos de la cuenta!',
    html: html,
    attachment: path.toString()
  };

  mg.messages().send(mailOptions, function (error, body) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + body.id);
      fs.unlink(path.toString(), err => {
        if (!err) console.log(path.toString() + " deleted");
      })
    }
  });
}

var sendLogoutEmail = (email, name ) => {

  var html =
      `
      <h1>Tesis: Recolección de Patrones de Tecleo</h1>
      <p>Felicidades ${name} </p>
      <p>Haz completado correctamente todas las tareas del día: ${new Date().toLocaleDateString()}.</p>
      <p>Te agradezco mucho por participar en las pruebas.</p>
      <p>Número de contacto: 959291344</p>
      <p>Aron Lo</p>
      `

  var mailOptions = {
    from: 'Aron Lo <aron.lo.li@hotmail.com>',
    to: email,
    cc: 'aron.lo@yahoo.com',
    subject: '¡Datos registados correctamente!',
    html: html
  };

  mg.messages().send(mailOptions, function (error, body) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + body.id);
    }
  });
}


exports.sendEmail = sendEmail
exports.sendLogoutEmail = sendLogoutEmail
exports.sendRecoverPassEmail = sendRecoverPassEmail
exports.sendEmailWord = sendEmailWord