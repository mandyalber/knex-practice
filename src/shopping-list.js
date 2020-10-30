require('dotenv').config()
const knex = require('knex')
const shoppingListService = require('./shopping-list-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

shoppingListService.getAllItems(knexInstance)
    .then(items => console.log(items))
    .then(() => shoppingListService.insertItem(knexInstance,
        {
            name: 'test item',
            price: 5,
            category: 'Snack',
            checked: false,
            date_added: new Date()
        }
    ))
    .then(newItem => {
        console.log(newItem)
        return shoppingListService.updateItem(knexInstance, newItem.item_id, { name: 'Updated name' })
            .then(() => shoppingListService.getItemById(knexInstance, newItem.item_id))
    })
    .then(item => {
        console.log(item)
        return shoppingListService.deleteItem(knexInstance, item.item_id)
    })