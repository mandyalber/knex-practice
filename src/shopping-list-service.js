/*contains methods for CRUD: to get, insert, update and delete shopping list items.*/
const shoppingListService = {
    getAllItems(knex) {
        return knex.select('*').from('shopping_list')
    },
    getItemById(knex, id) {
        return knex.from('shopping_list').select('*').where('item_id', id).first()
    },
    insertItem(knex, newItem) {
        return knex.insert(newItem  ).into('shopping_list').returning('*').then(rows => { return rows[0] })
    },
    updateItem(knex, item_id, newItemFields) {
        return knex('shopping_list').where({item_id}).update(newItemFields)
    },
    deleteItem(knex, item_id) {
        return knex('shopping_list').where({ item_id }).delete()
    },
}


module.exports = shoppingListService