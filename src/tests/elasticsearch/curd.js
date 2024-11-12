const { getClients, init } = require('../../dbs/init.elasticsearch');

init({
    ELASTICSEARCH_ENABLED: true
})

const esClient = getClients().elasticClient

// search document
const searchDocument = async ({ idxName, docType, payload }) => {
    const result = await esClient.search({
        index: idxName,
        type: docType,
        body: payload
    });

    console.log(`search result`, result?.body?.hits?.hits);
}

const addDocument = async ({ idxName, _id, docType, payload }) => {
    try {
        const newDoc = await esClient.index({
            index: idxName,
            type: docType,
            id: _id,
            body: payload
        });
        console.log(`add new`, newDoc);
        return newDoc
    } catch (err) {
        console.error(err)
    }

}

// addDocument({
//     idxName: 'product_001',
//     _id: '1111123',
//     docType: 'product',
//     payload: {
//         title: 'Iphone 16',
//         price: '1000',
//         image: '...',
//         category: 'mobiles'
//     }
// }).then(rs => console.log(rs))

searchDocument({ idxName: 'product_001', docType: 'product', body: { size: 20 } }).then()
// module.exports = {
//     searchDocument,
//     addDocument
// }