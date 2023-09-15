const decode = require('salesforce-signed-request');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { catchExceptions } = require("../helper");

/** register endpoint called from q-passport - sends the org and user context data in the payload */
function register(req, res) {
    try {
        const json_body = Array.isArray(req.body) ? req.body[0] : req.body;
        console.log("Register - Body below");
        console.log(json_body);
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

        console.log("Handoff Params below");
        console.log(handoff_parameter);
        // Serialize HTTP params from json object. Classy AF!
        const serialized_handoff_param = new URLSearchParams(
            handoff_parameter
        ).toString();
        return res.json({ handoff_param: serialized_handoff_param });
    } catch (e) {
        console.log("error in register --- ", e);
        return catchExceptions(res, e.message, 500);
    }
}

/** handoff endpoint called from q-passport - create the jwt token and load the frontend */
async function handoff(req, res) {
    try {
        const query_params = req.params;
        console.log("query_params ", query_params.handoff_param);
        const params = new URLSearchParams(query_params.handoff_param);

        const display_name = params.get('display_name');
        const email = params.get('email');
        const creds = JSON.parse(params.get('creds'));
        console.log("displayname ", display_name, ' email ', email, ' creds ', creds);

        req.session.regenerate(() => {
            req.session.accessToken = creds.token;
            //req.session.instanceUrl = tokenResponse.instance_url;
            req.session.email = email;
            req.session.userInfo = display_name;
            res.redirect(`/admin`);
        });
    } catch (e) {
        console.log("error in handoff --- ", e);
        return catchExceptions(res, e.message, 500);
    }
}

async function checkForSession(req, res) {
    if (req.session.accessToken) {
        res.send({ isAuthenticated: true });
    } else {
        res.send({ isAuthenticated: false });
    }
}

async function canvasAuthentication(req, res) {
    try {
        console.log("canvasAuthentication ");
        const signed_request = req.body.signed_request;

        const signed_response = decode(
            signed_request,
            process.env.SFDC_CANVAS_SECRET
        );

        if (!signed_response) res.statusCode = 500;
        console.log("canvasAuthentication ");
        if (signed_response) {
            console.log("Signed res", signed_response);
            const email = signed_response.context.user.email;
            const parameters = signed_response.context.environment.parameters;
            console.log("parameters", parameters);
            const org_type = parameters.OrgType;
            const page = parameters.Page;
            const org_identifier = parameters.OrgIdentifier;
            //query in database based on Id of page
            const page_details = await prisma.pages.findUnique({
                where: { id: page }, // Specify the unique identifier for the record
                select: {
                    id: true, // Include the fields you want to select here
                    page_name: true,
                    org_key: true,
                    description: true,
                    is_active: true,
                },
            });
            console.log("pagesDetails- ", page_details);
            const page_name = page_details?.page_name + " " + org_type;
            const url = `/?email=${email}&pageName=${page_name}&orgIdentifier=${org_identifier}&orgType=${org_type}`;
            console.log(url);
            res.redirect(url);
        }
    } catch (e) {
        console.log("error in handoff --- ", e);
        return catchExceptions(res, e.message, 500, 'GA4 Tracking');
    }
}

module.exports = {
    register,
    handoff,
    checkForSession,
    canvasAuthentication
};