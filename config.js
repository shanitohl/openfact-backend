module.exports={
    port: process.env.PORT || 3000,
    db:process.env.MONGODB || "mongodb://localhost:27017/shop"
}



// module.exports = {
//     DBX_API_DOMAIN: 'https://api.dropboxapi.com',
//     DBX_OAUTH_DOMAIN: 'https://www.dropbox.com',
//     DBX_OAUTH_PATH: '/oauth2/authorize',
//     DBX_TOKEN_PATH: '/oauth2/token',
//     DBX_APP_KEY:'<appkey_in_dropbox_console>',
//     DBX_APP_SECRET:'<appsecret_in_dropbox_console>', 
//     OAUTH_REDIRECT_URL:"http://localhost:3000/oauthredirect",
//   }