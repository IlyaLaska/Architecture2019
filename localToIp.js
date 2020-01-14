const fs = require('fs');
console.log(process.argv);

let login = fs.readFile('.\\Auth_container\\Auth\\login.html', 'utf8', (e, d) => {
  console.log(d);
  d = d.split('localhost').join(process.argv[2]);
  fs.writeFile('.\\Auth_container\\Auth\\login.html', d, e => {
    if (e) throw e;
    let signup = fs.readFile('.\\Auth_container\\Auth\\signup.html', 'utf8', (e, d) => {
      d = d.split('localhost').join(process.argv[2]);
      fs.writeFile('.\\Auth_container\\Auth\\signup.html', d, e => {
        if (e) throw e;
        let booking = fs.readFile('.\\Booking_container\\Booking\\booking.html', 'utf8', (e, d) => {
          d = d.split('localhost').join(process.argv[2]);
          fs.writeFile('.\\Booking_container\\Booking\\booking.html', d, e => {
            if (e) throw e;
            let bookingSel = fs.readFile('.\\Booking_container\\Booking\\bookingselect.html', 'utf8', (e, d) => {
              d = d.split('localhost').join(process.argv[2]);
              fs.writeFile('.\\Booking_container\\Booking\\bookingselect.html', d, e => {
                if (e) throw e;
                console.log('Done');
              });
            });
          });
        });
      });
    });
  });
});

