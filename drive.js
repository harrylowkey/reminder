
let downloadFile = (auth, { name, id, mimeType, kind }) => {
  const drive = google.drive({ version: 'v3', auth });
  let fileName = name.replace(/\s/g, "").toLowerCase()
  const dest = fs.createWriteStream(`./downloads/${fileName}.xlsx`);
  drive.files.export({
    fileId: id,
    mimeType
  }, (err, res) => {
    if (err) return console.log('Fail at download file', err)
    res.on('end', function () {
      console.log('Done');
    })
    res.on('error', function (err) {
      console.log('Error during download', err);
    })
      .pipe(dest);
  })

}

let listFiles = (auth) => {
  const drive = google.drive({ version: 'v3', auth });
  drive.files.list({
    pageSize: 50,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
      console.log('--------------------------------');
      let file = getFileByName(files, 'Team structure')
      downloadFile(drive, file)
    } else {
      console.log('No files found.');
    }
  });
}

let getFileByName = (files, _name) => {
  let file = files.find((file) => file.name === _name)
  if (!file) {
    console.log('Not found file')
    return
  }
  return file
}

module.exports = {
  downloadFile,
  listFiles,
  getFileByName
}