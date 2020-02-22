require('dotenv').config()
const fs = require('fs');
const readline = require('readline');
const RANGE = 'A1:L40'
const { google } = require('googleapis');
const xlsx = require('xlsx-populate')
const { reporter } = require('./utils')
const SPREAD_SHEET_ID = '126KByeu4XDePZ01oUd9DvutPLw1167Oaw94Kpo2cdZ8'
const { preData } = require('./spreadsheet')
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json'

const { getSpreadSheetById } = require('./spreadsheet')

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

let authorize = (fileName) => {
  return new Promise((res, rej) => {
    fs.readFile(fileName, (err, content) => {
      if (err) rej('Error loading client secret file:', err)
      let credentials = JSON.parse(content)
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
      });

      res()
    });
  })
}

async function init() {
  let data = await xlsx.fromFileAsync('./data.xlsx')
    .then(async workbook => {
      const value = workbook.sheet("Sheet1").range(RANGE).value();
      if (!value.length) {
        return await authorize(CREDENTIALS_PATH)
          .then(async () => {
            return await getSpreadSheetById(SPREAD_SHEET_ID)
          })
      }
      return preData(value)
    })
    .catch(async err => {
      // No file data found
      if (err.errno === -2) {
        return await authorize(CREDENTIALS_PATH)
          .then(async () => {
            return await getSpreadSheetById(SPREAD_SHEET_ID)
          })
      }
    })
  let birthdayReport = reporter(data, 'BIRTH_DAY')
  console.log(birthdayReport)
}
init()







