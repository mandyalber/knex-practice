require('dotenv').config()
const knex = require('knex')
const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL

})
/*1. Get all items that contain text*/
function searchByItemName(searchTerm) {
    knexInstance
        .select('item_id', 'name', 'price', 'category', 'checked', 'date_added')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}
searchByItemName('steak')

/*2. Get all items paginated*/
function paginateByPageNumber(pageNumber) {
    const itemsPerPage = 6
    const offset = itemsPerPage * (pageNumber - 1)
    knexInstance
        .select('item_id', 'name', 'price', 'category', 'checked', 'date_added')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}
paginateByPageNumber(3)

/*3. Get all items added after date*/
function getItemsAfterDate(daysAgo) {
    knexInstance
        .select('name', 'date_added')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .from('shopping_list')
        .groupBy('name', 'date_added')
        .orderBy([
            { column: 'date_added', order: 'ASC' },
            { column: 'name', order: 'DESC' },
        ])
        .then(result => {
            console.log(result)
        })
}
getItemsAfterDate(6)

/*4. Get the total cost for each category*/
function getTotalCostByCategory() {
    knexInstance
        .select('category')        
        .sum('price AS total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}
getTotalCostByCategory()
