var admin = require('firebase-admin');

var serviceAccount = {
  "type": "service_account",
  "project_id": "lorven-sys",
  "private_key_id": "899496439433e7250645bb94824137eb2fd3aa8a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+91jcZ+Sg7m5Z\nEZDmVEf0oUg0NjcyETo8LkLEkMcxF4aBMXy5py/pIZrc532dse7C1gzhO7QLzrbK\nktZxeLdckflh9uKFSg7jE7n9qkXeN7si3jf+MMMGuL74PvQ+2tdyJp0tolOYhcWD\nc9mLO6117+cSF7OpeL9fv+pVV5FGqKEd+i34nG+z10JcyNo/0Sxg4LGE67niRI8Y\nEEPoCJ9f4XsDNlp/W5OnFnb63eIwND3XhEsZHmHM8CpWeXUxlfpkeFs4g+hPd9qP\nptEsHZyY95pZqEtgiuLrmPEFaVITkXYAY1ZEv5Re8Ay9epzlygvyx3RwGxpKFSyP\njcCGn6iZAgMBAAECggEALGKwQDZToQYaFtCq5aYkPVs5PY12Ycg4SWGVOjvOWH43\n0JJwg3Q1AhJB/OM/QqZnMNjwkG9Ah1gKC2Z6ulANClKRbLAl8UYH1MayfZ+UcrRw\nZgfRat7pjYfmNyvmuC9EUS9hbAhlNres80M7ho2d4SIcCowAwbyjen1QWXqrdQj4\n9B2RS6wmaPs9ZwuOmTxvUVfh8zkRPdhVq6TnQl66xbhaiwEJmivzGGu4Y0mqxoGd\nodE0aHY3gvw3lC5FaOrYGGwri5k5M3jjORcwpTrhLUhSmlGzylD0KeJ6xzue4E8/\nlKwQedzStWELeQpxugNrPDYmDYdzwCuiI3ZEQNNKiQKBgQDfXEHeigUsVfSRpS0a\ndzpD7Ged33S8mqavxawChae4br1uo3fUe6fKfu6FzQN6bJSnnM2JmtYgnH8cbS/p\nZ7CHWB931SLEnrtNLlVVNrFyPFzCTP3U+c1l6qXVmDf9zgwJZ3nJ+h0mY7YfFXnx\n3f5JtWKtUbD1bDLwsdo+adnFFQKBgQDa3z+AKE7x3xSW+3BT94/qbvUIvMQp9d7E\n5P2YtoTQg9TT+ZHb+6BE8eRZ1LzM2bEUaUUMxhN71Ln70BBRy7lQ8avehtYBJoEY\n3yoUA4w1P9l5XHKyomO8OzKKDtg0SD3fr/N8gwOgfSiwDULc9DKO09pVIMJN8oYO\nIoQCqUe+dQKBgCWuOq6AOj8wgQHRC7rbQkkTKKfJergWnugoQMxsH89NX0e67Aw8\nkCHpJ/QKkfulNa7RFRuRs23s+MSi5uJJS86JX0Wn/yWMYayzlFG72FOdO0jMFEZJ\nng0DeNZ/x3JZwE4V1sXsG97OE3tK9DeJa8yjfPIgReohRra0Sk0dLk/BAoGBAKVY\n3noM+YbUBpQBI9zrOzfZ1xdgs7kXW9HXRJXn3PJBhbkV41ETCQLM0rvicTc4hgRr\nepSp1vJHxLEtgAarJza1PCgCKQ35brHBdeJkw7k+oSaD5sp4z2vWNNoDWOY2ZTfl\njsZTm5vUsbY+bnLJsKAh/+ErvF5yhz+KZ7wy8lY5AoGAOpPA3irDZ90tGE6/2hDl\nhRGAkoIxcVnSyp6UU9rZGDLNmN+iBRKSpW9Mv/dxA0AoBIVANgm5PoDGl9gKmVVH\n7+co3ZxBlrNKfMObu+Dy65zft0fXqNEyMl0rpf2/VaAaAn/4/3BbstkUoSkViCFj\nz7LkmSaJpgwP4ogQiUmOADw=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@lorven-sys.iam.gserviceaccount.com",
  "client_id": "105960753068453727976",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40lorven-sys.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = async function(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  var { title, body, token } = req.body;
  
  try {
    await admin.messaging().send({
      token: token,
      notification: { title: title, body: body }
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};