const path = require("path");
const { BrowserWindow, ipcMain } = require("electron");
const { dialog } = require('electron');
const _ = require("lodash");
const readXlsxFile = require('read-excel-file/node');   // https://www.npmjs.com/package/read-excel-file

// Class to load Excel file
class LoadExcel {
    constructor() {
        // Get current active window
        this.window = BrowserWindow.getFocusedWindow();
    }
    static load() {
        const file = dialog.showOpenDialog({ properties: ['openFile'], filters: [{name: 'Excel Files', extensions: ['xlsx']}] });
        readXlsxFile(file[0]).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            //console.log(rows)
            global.ExcelData = cleanData(rows);
          });
        BrowserWindow.getFocusedWindow().loadFile(path.join(__dirname, '../../', 'pages/import_data.html'));

        function cleanData(dataset){
            let data = dataset;
            const textValues = [0,1,2,3,8,9,10,11,12,13];       // Rows containing text
            const floatValues = [4,5,6,7];      // Rows containing float values
            // Clean data
            for(var i=1; i<_.size(data); i++){     //Iterate over every row
                
                _.forEach(textValues, el => {       // Iterate over cells containing text values
                    // Replace "null" text values with empty string
                    if (data[i][el]==null){
                        data[i][el] = "";
                    }
                    else{
                    }
                });
    
                _.forEach(floatValues, el =>{       // Iterate over cells containing float values
                    // Replace "null" float values with zero
                    if (data[i][el]==null){
                        data[i][el] = 0;
                    }
                    else {
                        data[i][el] = Math.round(parseFloat(data[i][el]) * 100) / 100;
                    }
                });
            }
    
            //console.log("cleandata: ", data);
            return data;
        }
    }
}

module.exports.LoadExcel = LoadExcel;
module.exports.default = LoadExcel;

// Function to call from renderer process
// Attach listener in the main process with the given ID
ipcMain.on('loadExcelFile', (event, arg) => {
    LoadExcel.load();
});