const nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
var transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ondarkpath@gmail.com',
      pass: 'ojhntazakdklnxep'
    }
});

var template = fs.readFileSync(path.join(__dirname, 'views', 'emails', 'email.html'), 'utf8');
var tempvars = {
  logo : 'http://megakovka.com.ua:3000/logo.png',
  oklogo : 'http://megakovka.com.ua:3000/img/okok.gif',
  date : '20.02.2018 17:00',
  total : '600 ₴',
  title1 : 'Спасибо за доверие',
  title2 : 'Ваш заказ #20001 в обработке',
  title3 : 'Мы свяжемся с Вами для уточнения информации после рассмотрения.'
};
for(var key in tempvars) {
  var content = tempvars.hasOwnProperty(key) ? tempvars[key] : null;
  if(content) {
    template = template.replace("{{" + key + "}}", content);
    template = template.replace("{{ " + key + " }}", content);
  }
};

transport.sendMail({
    from: 'info@megakovka.com.ua',
    to: 'ondarkpath@gmail.com',
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: template
}, (error, info) => {
    if (error) {
        return console.log(error);
    }
    res.send(info);
});
