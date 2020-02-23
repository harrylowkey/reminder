const fs = require('fs');
const readline = require('readline');

const { google } = require('googleapis');
const CREDENTIALS_PATH =  __dirname + '/credentials.json'
const TOKEN_PATH = __dirname + '/token.json';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];



let getAccessToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}

let authorize = async () => {
  return new Promise((res, rej) => {
    try {
      let content = fs.readFileSync(CREDENTIALS_PATH)
      let credentials = JSON.parse(content)
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      res()
      // Check if we have previously stored a token.
      try {
        let token = fs.readFileSync(TOKEN_PATH) 
        oAuth2Client.setCredentials(JSON.parse(token));
      } catch (error) {
        return getAccessToken(oAuth2Client);
      }
    } catch (error) {
      console.log(error)
      rej('Error loading client secret file')
    }

  })
}

module.exports = {
  authorize
}