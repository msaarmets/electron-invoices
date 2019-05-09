const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { Store } = require("./store");

/**
 * Function to set selected invoice data to global variable
 * and redirect to single invoice page ( single_invoice.html )
 */
// Function to call from renderer process
// Attach listener in the main process with the given ID
ipcMain.on('openSingleInvoice', (event, arg) => {

    BrowserWindow.getFocusedWindow().loadFile(path.join(__dirname, '../..', 'pages/single_invoice.html'));

});