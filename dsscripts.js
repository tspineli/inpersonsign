const docusign = require("docusign-esign");
const accountid = process.env.accountid;
const jwt = require("./jwt");
var request = require("request");

async function teste(req, res) {
  let token = await jwt.geratoken();
  var options = {
    method: "GET",
    url:"https://demo.docusign.net/restapi/v2.1/accounts/8177285/billing_charges?include_charges=envelopes",
    headers: {"Authorization":"Bearer "+token,"Content-Type": "application/json"}
  };
  request(options, (err, response) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(response.body);
  });
}

async function desinstala(req, res) {
  let token = await jwt.geratoken();
  let redirect = req.protocol + "://" + req.get("host");
  let data = req.body;

  let envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
    templateId:
      data.tipoassinatura == "remota"
        ? "30f5882a-1b98-4539-878a-c878a43757af"
        : "badf8158-654a-40a9-bb2e-8e65efb76bac",
    status: "sent"
  });

  let cnpj = docusign.Text.constructFromObject({
      tabLabel: "cnpj",
      value: data.cnpj
    }),
    comodataria = docusign.Text.constructFromObject({
      tabLabel: "comodataria",
      value: data.comodataria
    }),
    matricula = docusign.Text.constructFromObject({
      tabLabel: "matricula",
      value: data.matricula
    }),
    endereco = docusign.Text.constructFromObject({
      tabLabel: "endereco",
      value: data.endereco
    }),
    representante = docusign.Text.constructFromObject({
      tabLabel: "representante",
      value: data.representante
    }),
    cpf = docusign.Text.constructFromObject({
      tabLabel: "cpf",
      value: data.cpf
    }),
    tag = docusign.Text.constructFromObject({
      tabLabel: "tag",
      value: data.tag
    }),
    baixovolume = docusign.Checkbox.constructFromObject({
      tabLabel: "baixovolume",
      selected: data.baixovolume || "false"
    }),
    energia = docusign.Checkbox.constructFromObject({
      tabLabel: "energia",
      selected: data.energia || "false"
    }),
    vendazero = docusign.Checkbox.constructFromObject({
      tabLabel: "vendazero",
      selected: data.vendazero || "false"
    }),
    concorrencia = docusign.Checkbox.constructFromObject({
      tabLabel: "concorrencia",
      selected: data.concorrencia || "false"
    }),
    juridico = docusign.Checkbox.constructFromObject({
      tabLabel: "juridico",
      selected: data.juridico || "false"
    }),
    conservacao = docusign.Checkbox.constructFromObject({
      tabLabel: "conservacao",
      selected: data.conservacao || "false"
    }),
    mauuso = docusign.Checkbox.constructFromObject({
      tabLabel: "mauuso",
      selected: data.mauuso || "false"
    }),
    desligado = docusign.Checkbox.constructFromObject({
      tabLabel: "desligado",
      selected: data.desligado || "false"
    }),
    encerrou = docusign.Checkbox.constructFromObject({
      tabLabel: "encerrou",
      selected: data.encerrou || "false"
    }),
    evento = docusign.Checkbox.constructFromObject({
      tabLabel: "evento",
      selected: data.evento || "false"
    }),
    migrou = docusign.Checkbox.constructFromObject({
      tabLabel: "migrou",
      selected: data.migrou || "false"
    }),
    reforma = docusign.Checkbox.constructFromObject({
      tabLabel: "reforma",
      selected: data.reforma || "false"
    }),
    reduzir = docusign.Checkbox.constructFromObject({
      tabLabel: "reduzir",
      selected: data.reduzir || "false"
    }),
    vandalismo = docusign.Checkbox.constructFromObject({
      tabLabel: "vandalismo",
      selected: data.vandalismo || "false"
    }),
    tabs = docusign.Tabs.constructFromObject({
      textTabs: [
        cnpj,
        comodataria,
        matricula,
        endereco,
        representante,
        cpf,
        tag
      ],
      checkboxTabs: [
        baixovolume,
        energia,
        vendazero,
        concorrencia,
        juridico,
        conservacao,
        mauuso,
        desligado,
        encerrou,
        evento,
        migrou,
        reforma,
        reduzir,
        vandalismo
      ]
    });

  let Comodataria = docusign.TemplateRole.constructFromObject({
    inPersonSignerName: data.tipoassinatura == "remota" ? "" : "Joao Silva",
    roleName: "Comodataria",
    clientUserId: data.tipoassinatura == "remota" ? "" : "123",
    tabs: tabs
  });

  envelopeDefinition.templateRoles = [Comodataria];

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath("https://demo.docusign.net/restapi");
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
  docusign.Configuration.default.setDefaultApiClient(dsApiClient);

  let envelopesApi = new docusign.EnvelopesApi();
  let results = await envelopesApi.createEnvelope(accountid, {
    envelopeDefinition: envelopeDefinition
  });

  const envelopeId = results.envelopeId;

  if (data.tipoassinatura == "remota") {
    res.sendFile(__dirname + "/views/index.html");
  } else {
    let recipientViewRequest = docusign.RecipientViewRequest.constructFromObject(
      {
        authenticationMethod: "none",
        clientUserId: "123",
        returnUrl: redirect,
        userName: "Tiago Spineli",
        email: "tspineli02@gmail.com"
      }
    );

    let pagina = await envelopesApi.createRecipientView(accountid, envelopeId, {
      recipientViewRequest: recipientViewRequest
    });
    res.redirect(pagina.url);
  }
}
module.exports = { desinstala, teste };
