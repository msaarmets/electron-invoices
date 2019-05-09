const electron = require('electron');
const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
var _ = require("lodash");

// https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e

class Store {
    constructor(opts) {
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = path.join(userDataPath, opts.configName + '.json');

        this.data = parseDataFile(this.path, opts.defaults);
        console.log("user path: ", this.path);
    }

    // This will just return the property on the `data` object
    get(key) {
        return this.data[key];
    }

    // ...and this will set it
    set(key, val) {
        this.data[key] = val;
        // Wait, I thought using the node.js' synchronous APIs was bad form?
        // We're not writing a server so there's not nearly the same IO demand on the process
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
        // we might lose that data. Note that in a real app, we would try/catch this.
        try{
            let jsonData = JSON.stringify(this.data);
            fs.writeFileSync(this.path, jsonData);
            // Set data to global variable to be accessed by renderer
            global.ExcelData = jsonData;
            // Open invoices list page
            BrowserWindow.getFocusedWindow().loadFile(path.join(__dirname, '../../', 'pages/invoices_list.html'));
            
        }
        catch(err){
            console.log(err);
        }
    }
}

function parseDataFile(filePath, defaults) {
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        // if there was some kind of error, return the passed in defaults instead.
        return defaults;
    }
}

// expose the class
module.exports = Store;

// Function to call from renderer process
// Attach listener in the main process with the given ID
ipcMain.on('saveExcelDataToFile', (event, arg) => {
    // Remove rows without invoice number
    let removedList=[]; // Removed rows. For debugging purposes.
    let data={};
    let a = 1;
    data[0] = arg.invoices[0];  // Headers
    for(var i=1; i<_.size(arg.invoices); i++){
        // Add rows with invoice number to "data" object
        if(arg.invoices[i][13] != null && arg.invoices[i][13] != ""){
            data[a] = arg.invoices[i];
            a++;
        }
        else{
            removedList.push(arg.invoices[i]);
        }
    }
    
    // Replace original invoice data with filtered one
    let invoicesData = arg;
    invoicesData.invoices = data;
    // Save data to file
    const store = new Store({
        // We'll call our data file 'invoice-data'
        configName: 'invoice-data',
        defaults: {}
    });
    store.set('invoiceData', invoicesData);
});


// Load saved data from file to global variable
ipcMain.on('loadInvoiceDataToGlobal', (event, arg) => {
    const store = new Store({
        // We'll call our data file 'invoice-data'
        configName: 'invoice-data',
        defaults: {}
    });
    data = store.get('invoiceData');
    global.ExcelData = data;
})