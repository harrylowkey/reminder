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

let authorize = async (fileName) => {
  return new Promise((res, rej) => {
    try {
      let content = fs.readFileSync(fileName)
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
      rej('Error loading client secret file:', error)
    }

  })
}

async function init() {
  let data = await xlsx.fromFileAsync('./data.xlsx')
    .then(async workbook => {
      const value = workbook.sheet("Sheet1").range(RANGE).value();
      if (!value.length < 0) {
        return await authorize(CREDENTIALS_PATH)
          .then(async () => {
            return await getSpreadSheetById(SPREAD_SHEET_ID)
          })
          .catch(err => console.log('Error when fetching data', err))
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
          .catch(err => console.log('Error when fetching data'))
      }
    })
  if (!data) return console.log('Error when fetching data')
  let birthdayReport = reporter(data, 'BIRTH_DAY')
  console.log(birthdayReport)
}
init()







