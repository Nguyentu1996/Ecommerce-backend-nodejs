'use strict';

const ejs = require('ejs');
const path = require('path');

const renderTemplateToken = async ({ email_name, link_verify }) => { 
    return await ejs.renderFile(path.join(__dirname, 'email.template.ejs'), { email_name, link_verify });
}

const renderTemplateWelcome = async ({ email_name, password }) => { 
    return await ejs.renderFile(path.join(__dirname, 'email.welcome.template.ejs'), { email_name, password });
}

module.exports = {
    renderTemplateToken,
    renderTemplateWelcome
}
