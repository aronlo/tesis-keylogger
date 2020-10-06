var Chance = require('chance');
const PDFDocument = require('pdfkit')
const fs = require('fs')

var random_user_assignation = () => {
    var chance = new Chance();
    return chance.weighted(['imposed', 'personal'], [7, 3])
}


var random_user_of_array = (usersList, weightList) => {
    var chance = new Chance();
    return chance.weighted(usersList, weightList)
}


var gcd = function (a, b) {
    return a ? gcd(b % a, a) : b;
}

var lcm = function (a, b) {
    return a * b / gcd(a, b);
}

function lcm_of_array(input_array) {
  if(input_array.every(e => e == 0)) return 1
  return input_array.filter(el => el != 0).reduce(lcm)
}


function getClientIp(req) {
    var ipAddress;
    // The request may be forwarded from local web server.
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
      // 'x-forwarded-for' header may return multiple IP addresses in
      // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
      // the first one
      var forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
      // If request was not forwarded
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
  };


var generatePDF = (name, lastname, dni) => {
  return new Promise(resolve => {
    var doc = new PDFDocument;
    var path = "./temp/" + new Date().getTime() + ".pdf"
    var writeStream = fs.createWriteStream(path)
    doc.pipe(writeStream);

    const h1_size = 21
    const h3_size = 11
    const title_size = 15
    const body_size = 12
    const spacing = 0.7

    doc
      .font('Times-Bold')
      .fontSize(h1_size)
      .text('Anexo 3. Formato referencial de consentimiento informado')

      .font('Times-Roman', h3_size)
      .moveDown(spacing)
      .text('UNIVERSIDAD DE LIMA')
      .moveDown(spacing)
      .text('FACULTAD DE INGENIERÍA Y ARQUITECTURA')
      .moveDown(spacing)
      .text('CARRERA DE INGENIERÍA DE SISTEMAS')

      .moveDown(spacing + 0.6)
      .font('Times-Bold', title_size)
      .text('MODELO REFERENCIAL CONSENTIMIENTO INFORMADO', {
        align: 'center'
      })

      .moveDown(spacing + 0.2)
      .font('Times-Roman', body_size)
      .text(`Yo, ${name} ${lastname} identificado con DNI Nro. ${dni} ACEPTO participar en el proceso de validación del trabajo de investigación titulado “Metodología para la generación de un dataset de dinámica de tecleo basado en un entorno web”, que se encuentra en evaluación experimental, mediante un prototipo de modelo. Comprendo que mi participación es totalmente libre y voluntaria, y que aún después de iniciada la investigación, puedo decidir suspender mi participación en cualquier momento, sin expresión de causa y sin que ello ocasione algún perjuicio.`, {
        align: 'justify'
      })

      .moveDown(spacing + 0.2)
      .text(`Este trabajo de investigación corresponde al estudiante (o estudiantes) ARON LO LI de la Universidad de Lima, carrera de Ingeniería de Sistemas identificado(s) con DNI Nro. 75623926, quienes están asesorados por los docentes: JUAN MANUEL GUTIERREZ CARDENAS con DNI Nro. 29515539 y VICTOR HUGO AYMA QUIRITA CON DNI Nro. 45025095.`, {
        align: 'justify'
      })

      .moveDown(spacing + 0.2)
      .text('Los responsables del proyecto podrán divulgar la información que se genere producto de mi participación en la investigación, mas no podrán divulgar mi información personal.', {
        align: 'justify'
      })

      .moveDown(spacing + 0.2)
      .text('Declaro que mi participación no implica ninguna contraprestación, por tratarse de una investigación académica.', {
        align: 'justify'
      })

      .moveDown(spacing + 0.8)
      .text(`Firma: ${name} ${lastname}`, {
        align: 'center'
      })

    doc.end();
    writeStream.on('finish', function () {
      resolve(path)
    })
  })
}

exports.random_user_assignation = random_user_assignation
exports.random_user_of_array = random_user_of_array
exports.lcm = lcm_of_array
exports.getClientIp = getClientIp
exports.generatePDF = generatePDF