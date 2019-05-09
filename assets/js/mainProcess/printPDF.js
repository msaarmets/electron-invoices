const {
    BrowserWindow,
    ipcMain
} = require('electron');
const fs = require('fs');
const path = require("path");
const _ = require("lodash");
const config = require("../../../config");
//const async = require("async");


/**
 * Print a single invoice to PDF 
 */
function printToPDF(ID, url = null, all = false) {
    // Create new hidden window
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });

    let URL;
    if (url != null) {
        URL = url;
    } else if (all == true) {
        URL = path.join(__dirname, '../..', '/pages/single_invoice.html?all=true'); // If all invoices should be on one page
    } else {
        URL = path.join(__dirname, '../..', '/pages/single_invoice.html'); // If page URL is not passed as argument
    }
    win.loadURL(URL);

    win.webContents.on('did-finish-load', () => {
        // Use default printing options
        win.webContents.printToPDF({}, (error, data) => {
            if (error) throw error
            const filename = "arve-" + ID + ".pdf";
            fs.writeFile(`${config.invoicesFolder}${filename}`, data, (error) => {
                if (error) throw error
                console.log('Write PDF successfully.');
                win.close();
            })
        })
    })
}

/**
 * Print all invoices to PDF-s (to different files)
 */
function printAllToPDF(keys) {

    // Iterate over all invoice keys
    keys.map(key => {
        let url = path.join(__dirname, '../..', '/pages/single_invoice.html?id=' + key);
        printToPDF(key, url);
    })
}

module.exports.printToPDF = printToPDF;

ipcMain.on('printPDF', (event, arg) => {
    printToPDF(arg.invoiceNumber);

});
ipcMain.on('printAllPDF', (event, arg) => {
    printAllToPDF(arg.keys);

});

ipcMain.on('printAllSinglePDF', (event, arg) => {
    printToPDF("1", null, true);

});

/**
 * Print all invoices to single PDF (to one file)
 */
/* function printAllToSinglePDF() {
    
    // Iterate over all invoice keys
    keys.map(key => {
        let url = path.join(__dirname, '../..', '/pages/single_invoice.html?id=' + key);
        printToPDF(key, url);
    })
}

module.exports.printAllToSinglePDF = printAllToSinglePDF; */