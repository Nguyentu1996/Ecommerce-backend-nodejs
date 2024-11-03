'use strict';

const templateModel = require('../models/template.model');
const { renderTemplate } = require('../utils/tem.email');

class TemplateService {
    static async newTemplate({
        tem_name = null,
    }) {

        // 1. check template exists
        const emailContent = await renderTemplate({
            name: userName,
            link: `https://yourwebsite.com/verify?token=placeholder`
        });
        const newTem = await templateModel.create({
            tem_name,
            tem_html: emailContent
        });

        return newTem
    }

    static async getTemplate({ tem_name }) {
        return await templateModel.find({ tem_name }).lean();
    }
    
}

module.exports = TemplateService
