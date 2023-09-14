const decode = require('salesforce-signed-request');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { catchExceptions } = require("../helper");

/** register endpoint called from q-passport - sends the org and user context data in the payload */
function register(req, res) {
    try {
        console.log("register");
        const json_body = Array.isArray(req.body) ? req.body[0] : req.body;
        console.log("Register - Body below");
        console.log(json_body);
        // Building a JSON object to carry Aloha credential info over to the handoff endpoint (/auth/handoff)
        const aloha_credentials = {
            token: json_body.creds.token,
        };
        // Bring the email along for further validation
        const email = json_body.user.email;
        const displayname = json_body.user.displayname;

        const handoff_param1 = {
            displayname: displayname,
            email: email,
            creds: JSON.stringify(aloha_credentials),
        };

        console.log("Handoff Params below");
        console.log(handoff_param1);
        // Serialize HTTP params from json object. Classy AF!
        const serialized_handoff_param = new URLSearchParams(
            handoff_param1
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
        const queryParamString = req.params;
        console.log("queryParamString1111 ", queryParamString.handoff_param);
        const searchParams = new URLSearchParams(queryParamString.handoff_param);

        const displayname = searchParams.get('displayname');
        const email = searchParams.get('email');
        const creds = JSON.parse(searchParams.get('creds'));

        console.log("displayname ", displayname, ' email ', email, ' creds ', creds);
        req.session.regenerate(() => {
            req.session.accessToken = creds.token;
            //req.session.instanceUrl = tokenResponse.instance_url;
            req.session.email = email;
            req.session.userInfo = displayname;
            res.redirect(302, `/admin`);
            // res.send('Redirect and AUthentication successful');
        });
        // res.redirect(302, `/admin`);
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

        const signedResponse = decode(
            signed_request,
            process.env.SFDC_CANVAS_SECRET
        );

        if (!signedResponse) res.statusCode = 500;
        console.log("canvasAuthentication ");
        if (signedResponse) {
            console.log("Signed res", signedResponse);
            const email = signedResponse.context.user.email;
            const parameters = signedResponse.context.environment.parameters;
            console.log("parameters", parameters);
            const orgType = parameters.OrgType;
            const page = parameters.Page;
            const orgIdentifier = parameters.OrgIdentifier;
            //query in database based on Id of page
            const pageDetails = await prisma.pages.findUnique({
                where: { id: page }, // Specify the unique identifier for the record
                select: {
                    id: true, // Include the fields you want to select here
                    page_name: true,
                    org_key: true,
                    description: true,
                    is_active: true,
                },
            });
            console.log("pagesDetails- ", pageDetails);
            const pageName = pageDetails?.page_name + " " + orgType;
            const url = `/?email=${email}&pageName=${pageName}&orgIdentifier=${orgIdentifier}&orgType=${orgType}`;
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