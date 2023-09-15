const axios = require("axios");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { catchExceptions } = require("../helper");
const Mixpanel = require('../mixpanel');

/** get page details based on OrgKey */
async function getPageDetailsByOrgKey(req, res) {
    console.log('API Controller - getPageDetailsByOrgKey request- ', req.params.org_key);
    const org_key = req.params.org_key;
    try {
        const pages = await prisma.pages.findMany({
            where: {
                org_key: org_key,
            },
        });

        console.log("API Controller - getPageDetailsByOrgKey - pagesDetails- ", pages);
        return res.json({ pages: pages });
    } catch (e) {
        console.log("error in getPageDetailsByOrgKey --- ", e);
        return catchExceptions(req.session.email, res, e.message, 500, 'Get Pages');
    }
}
/** create page detail */
async function createPage(req, res) {
    try {
        console.log('createPage');
        const req_body = Array.isArray(req.body) ? req.body[0] : req.body;
        console.log("API Controller -  createPage - request", req_body);

        const result = await prisma.pages.create({
            data: req_body.data
        });

        await Mixpanel.track(req.session.email, { action: 'Added a new page' });

        console.log('API Controller - createPage - result ', result);
        return res.json({
            page_id: result.id,
        });
    } catch (e) {
        console.log("error in createPage --- ", e);
        return catchExceptions(req.session.email, res, e.message, 500, 'Create Page');
    }
}
/** update page detail */
async function updatePage(req, res) {
    try {
        const req_body = Array.isArray(req.body) ? req.body[0] : req.body;
        console.log("API Controller -  updatePage - request", req_body);

        const result = await prisma.pages.update({
            where: { id: req_body.data.id }, // Specify the unique identifier for the update
            data: req_body.data,
        });

        console.log('API Controller - updatePage - result ', result);
        return res.json({
            page_id: result.id,
        });
    } catch (e) {
        console.log("error in updatePage --- ", e);
        return catchExceptions(req.session.email, res, e.message, 500, 'Update Page');
    }
}
/** get org list */
async function listOfOrgKey(req, res) {
    console.log('List of Org key ');
    const url = process.env.QKEYS_URL || "";
    const access_token = process.env.JWT_TOKEN || "";
    try {
        console.log("Axios token ", access_token);
        console.log('Org keys ', req.session);
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
            },
        });
        console.log("result ", response.status);
        const result = response;
        if (response.status == 200) {
            Mixpanel.track(req.session.email, { action: 'Page Viewed' });
            return res.send(result.data);
        } else {
            console.log("**** Q-Keys Error ****");
            try {
                const msg = JSON.parse(result.data).error;
                res.send({ error: true, message: msg });
            } catch (err) {
                res.send({
                    error: true,
                    message:
                        "Something went wrong while fetching keys from " +
                        process.env.QKEYS_URL,
                });
            }
        }
    } catch (e) {
        console.log("error in listOfOrgKey --- ", e);
        return catchExceptions(req.session.email, res, e.message, 500, 'Get Org Key Data');
    }
}
module.exports = {
    getPageDetailsByOrgKey,
    createPage,
    updatePage,
    listOfOrgKey
};