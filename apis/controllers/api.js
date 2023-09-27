const axios = require("axios");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { catchExceptions } = require("../helper");
const Mixpanel = require('../mixpanel');

/** get page details based on OrgKey */
async function getPageDetailsByOrgKey(req, res) {
    const org_key = req.params.org_key;
    try {
        const pages = await prisma.pages.findMany({
            where: {
                org_key: org_key,
            },
        });
        return res.json({ pages: pages });
    } catch (e) {
        console.log("API Controller - getPageDetailsByOrgKey request - error in getting keys data - ", e);
        return catchExceptions(res, e.message, 500, 'Get Trackers', req.session.email, org_key);
    }
}
/** create page detail */
async function createPage(req, res) {
    const req_body = Array.isArray(req.body) ? req.body[0] : req.body;
    try {

        const result = await prisma.pages.create({
            data: req_body.data
        });

        await Mixpanel.track(req.session.email, { action: 'Add New Tracker', data: { name: result.page_name, org_type: result.org_key } });
        return res.json({
            page_id: result.id,
        });
    } catch (e) {
        console.log("API Controller -  createPage - error in creating tracker ", e);
        return catchExceptions(res, e.message, 500, 'Create Tracker', req.session.email, req_body.data.org_key);
    }
}
/** update page detail */
async function updatePage(req, res) {
    const req_body = Array.isArray(req.body) ? req.body[0] : req.body;
    try {

        const result = await prisma.pages.update({
            where: { id: req_body.data.id }, // Specify the unique identifier for the update
            data: req_body.data
        });
        return res.json({
            page_id: result.id,
        });
    } catch (e) {
        console.log("API Controller -  updatePage - error in updating Tracker - ", e);
        return catchExceptions(res, e.message, 500, 'Update Tracker', req.session.email, req_body.data.org_key);
    }
}
/** get org list */
async function listOfOrgKey(req, res) {
    const url = process.env.QKEYS_URL || "";
    const access_token = process.env.JWT_TOKEN || "";
    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
            },
        });
        const result = response;
        if (response.status != 200) {
            console.log("API Controller - listOfOrgKey - **** Q-Keys Error ****");
            try {
                const msg = JSON.parse(result.data).error;
                return res.send({ error: true, message: msg });
            } catch (err) {
                return res.send({
                    error: true,
                    message:
                        "Something went wrong while fetching keys from " +
                        process.env.QKEYS_URL,
                });
            }
        }
        Mixpanel.track(req.session.email, { action: 'Page View' });
        return res.send(result.data);

    } catch (e) {
        console.log("API Controller - listOfOrgKey - error in getting list of keys - ", e);
        return catchExceptions(res, e.message, 500, 'Get Org Key Data', req.session.email);
    }
}
/** check for org key */
async function checkForOrgKey(org_identifier) {
    const url = process.env.QKEYS_URL || "";
    const access_token = process.env.JWT_TOKEN || "";
    let is_key = false;
    let org_type = '';
    try {
        const result = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
            },
        });
        if (result.status != 200) {
            console.log("API Controller - checkForOrgKey - **** Q-Keys Error ****");
            const msg = JSON.parse(result.data).error;
            return ({ is_key: is_key, error: true, message: msg });
        }

        result.data.keys.forEach((element) => {
            if (element.is_retired == false && element.org62__trialforce_id != null) {
                if (element.identifier == org_identifier) {
                    is_key = true;
                    org_type = element.name;
                }
            }
        });
        return ({
            is_key: is_key,
            keyorg_type: org_type,
            message: is_key ? 'Found the Org key' : 'Not a valid Org'
        });
    } catch (e) {
        console.log("API Controller - checkForOrgKey - error in identifing keys - ", e);
        return ({
            is_key: is_key,
            keyorg_type: org_type,
            message:
                "Something went wrong while fetching keys from " +
                process.env.QKEYS_URL,
        });
    }
}
module.exports = {
    getPageDetailsByOrgKey,
    createPage,
    updatePage,
    listOfOrgKey,
    checkForOrgKey
};