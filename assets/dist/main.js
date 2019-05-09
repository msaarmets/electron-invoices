const path = require("path");
const { BrowserWindow } = require("electron");
const { dialog } = require('electron');
const readXlsxFile = require('read-excel-file/node');   // https://www.npmjs.com/package/read-excel-file

// Class to load Excel file
class LoadExcel {
    constructor() {
        // Get current active window
        this.window = BrowserWindow.getFocusedWindow();
    }
    static load() {
        const file = dialog.showOpenDialog({ properties: ['openFile'], filters: [{name: 'Excel Files', extensions: ['xlsx']}] });
        console.log(file);
        readXlsxFile(file[0]).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            console.log("alustan ridade lugemist failist:")
            console.log(rows)
            global.ExcelData = rows;
          })
        BrowserWindow.getFocusedWindow().loadFile(path.join(__dirname, '../', 'pages/import_data.html'));
    }
}

module.exports.LoadExcel = LoadExcel;
module.exports.default = LoadExcel;