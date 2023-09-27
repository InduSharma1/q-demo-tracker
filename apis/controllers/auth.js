const decode = require('salesforce-signed-request');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { catchExceptions, trackMixpanel } = require("../helper");
const { checkForOrgKey } = require("./api");

/** register endpoint called from q-passport - sends the org and user context data in the payload */
function register(req, res) {
    try {
        const json_body = Array.isArray(req.body) ? req.body[0] : req.body;
        // Building a JSON object to carry Aloha credential info over to the handoff endpoint (/auth/handoff)
        const aloha_credentials = {
            token: json_body.creds.token,
        };
        // Bring the email along for further validation
        const email = json_body.user.email;
        const display_name = json_body.user.displayname;

        const handoff_parameter = {
            display_name: display_name,
            email: email,
            creds: JSON.stringify(aloha_credentials),
        };
        // Serialize HTTP params from json object. Classy AF!
        const serialized_handoff_param = new URLSearchParams(
            handoff_parameter
        ).toString();
        return res.json({ handoff_param: serialized_handoff_param });
    } catch (e) {
        console.log("Auth Controller - Register - error - ", e);
        return catchExceptions(res, e.message, 500);
    }
}

/** handoff endpoint called from q-passport - create the jwt token and load the frontend */
async function handoff(req, res) {
    try {
        const query_params = req.params;
        const params = new URLSearchParams(query_params.handoff_param);

        const display_name = params.get('display_name');
        const email = params.get('email');
        // const creds = JSON.parse(params.get('creds'));

        req.session.regenerate(() => {
            req.session.email = email;
            req.session.userInfo = display_name;
            res.redirect(`/`);
        });
    } catch (e) {
        console.log("Auth Controller - Handoff - error - ", e);
        return catchExceptions(res, e.message, 500);
    }
}

async function checkForSession(req, res) {
    if (req.session.email) {
        res.send({ isAuthenticated: true });
    } else {
        res.send({ isAuthenticated: false });
    }
}

async function canvasAuthentication(req, res) {
    let email = '';
    let org_identifier = '';
    try {
        const signed_request = req.body.signed_request;

        const signed_response = decode(
            signed_request,
            process.env.SFDC_CANVAS_SECRET
        );
        if (!signed_response) {
            res.statusCode = 500;
            return res.send('Signed response not found');
        }
        email = signed_response.context.user.email;
        const parameters = signed_response.context.environment.parameters;
        if (Object.keys(parameters).length == 0) {
            trackMixpanel(email, 'canvas Authentication', 'Parameters not found');
            return res.send('Parameters not found');
        }
        let org_type = parameters.OrgType;
        const page = parameters.Page;
        org_identifier = parameters.OrgIdentifier;

        /** query in q Key for validating Org Identifier **/
        const { is_key, keyorg_type, message } = await checkForOrgKey(org_identifier);
        if (!is_key) {
            trackMixpanel(email, 'canvas Authentication', message);
            return res.send('Not a valid Org');
        }
        /** Org type is not selected in custom metadata **/
        if (!org_type) {
            org_type = keyorg_type;
        }

        /** query in database based on Id of page **/
        const page_details = await prisma.pages.findUnique({
            where: {
                id: page,
                is_active: true
            },
            select: {
                id: true,
                page_name: true,
                org_key: true,
                description: true,
                is_active: true,
            },
        });
        if (!page_details) {
            trackMixpanel(email, 'canvas Authentication', 'No Active tracker present', org_identifier);
            return res.send('No Active tracker present');
        }
        const page_name = page_details?.page_name + " " + org_type;
        const url = `/track?email=${email}&pageName=${page_name}&orgIdentifier=${org_identifier}&orgType=${org_type}`;
        console.log(url);
        return res.redirect(url);

    } catch (e) {
        console.log("Auth Controller - canvasAuthentication - error - ", e);
        return catchExceptions(res, e.message, 500, 'canvas Authentication', email, org_identifier);
    }
}
/**
* @description login endpoint is redireting to the authentication demo tools login screen directly
*/
async function login(req, res) {
    return res.redirect(`${process.env.PASSPORT_AUTH_URL}`);
}

module.exports = {
    register,
    handoff,
    checkForSession,
    canvasAuthentication,
    login
};