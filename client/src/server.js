const { app, BrowserWindow, ipcMain, remote, net,session } = require('electron');
const path = require('path');

let mainWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule:true
    }
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/views/home.html'));
  //Register
  ipcMain.on("registerPage",function(event){
    mainWindow.loadFile(path.join(__dirname,'/views/register.html'));
    ipcMain.on("register",function(event){
      mainWindow.loadFile(path.join(__dirname,'/views/home.html'));
    })
  })
  //Delete cookies and logout
  ipcMain.on("logout",function(event){
    mainWindow.loadFile(path.join(__dirname,'/views/home.html'));
    session.defaultSession.clearStorageData([]).then();
  })
  //Set cookies with access token
  ipcMain.on("accessToken",function(event,token){
    let cookies={
      name : "access-token",
      value : `${token}`,
      url: 'http://localhost:4000/backend/'
    }
    session.defaultSession.cookies.set(cookies)
    .then(() => {
      console.log("set token data ok");
      mainWindow.loadFile(path.join(__dirname,'/views/login.html'));
      session.defaultSession.cookies.get({})
        .then((cookies) => {
          console.log(cookies)
        }).catch((error) => {
          console.log(error)
        });
    }).catch((error) => {
      console.error("set cookies error ", error)
    })
  })
  //Redirect to some functionality page
  ipcMain.on("userPage",function(event){
    mainWindow.loadFile(path.join(__dirname,'/views/user.html'));
  })
  ipcMain.on("teamPage",function(event){
    mainWindow.loadFile(path.join(__dirname,'/views/team.html'));
  })
  ipcMain.on("projectPage",function(event){
    mainWindow.loadFile(path.join(__dirname,'/views/project.html'));
  })
  //Send data of a team
  ipcMain.on("teamMember",function(event,data){
    mainWindow.loadFile(path.join(__dirname,'/views/teamMember.html'));
    mainWindow.webContents.on("did-finish-load",function(event){
      mainWindow.webContents.send("teamList",data);
    })
  })
  //Send data of a project
  ipcMain.on("projectDetail",function(event,data){
    mainWindow.loadFile(path.join(__dirname,'/views/projectDetail.html'));
    mainWindow.webContents.on("did-finish-load",function(event){
      mainWindow.webContents.send("detail",data);
    })
  })
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
