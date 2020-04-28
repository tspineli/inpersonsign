const ds = require("docusign-esign");
const scopes = 'signature';
const jwtLifeSec = 3600;

async function geratoken() {
  let dsApi = new ds.ApiClient();
  dsApi.setOAuthBasePath(process.env.authServer);
  let results = await dsApi.requestJWTUserToken(
    process.env.clientId,
    process.env.impersonatedUserGuid,
    scopes,
    process.env.privateKey,
    jwtLifeSec
  );
  return results.body.access_token;
}

module.exports = { geratoken };
