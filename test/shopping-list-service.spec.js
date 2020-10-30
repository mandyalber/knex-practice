/* Also, make a ./test/shopping-list-service.spec.js file that tests the CRUD methods.*/
const shoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe.only(`Shopping List service object`, function () {
    let db
    let testItems = [
        {
            item_id: 1,
            name: 'test item 1', 
            price: '13.10', 
            category: 'Main',  
            checked: false,  
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            item_id: 2,
            name: 'test item 2', 
            price: '41.25', 
            category: 'Snack',  
            checked: true,  
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },        
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })
    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())


    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })
        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return shoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })
        it(`getItemById() resolves an item by id from 'shopping_list' table`, () => {
            const testId = 2
            const testItem = testItems[testId - 1]
            return shoppingListService.getItemById(db, testId)
                .then(actual => {
                    expect(actual).to.eql({
                        item_id: testId,
                        name: testItem.name,
                        price: testItem.price,
                        category:testItem.category,
                        checked:testItem.checked,
                        date_added: testItem.date_added,
                    })
                })
        })
        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 1
            return shoppingListService.deleteItem(db, itemId)
                .then(() => shoppingListService.getAllItems(db))
                .then(allItems => {                   
                    const expected = testItems.filter(item => item.item_id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItem = 2
            const newItemData = {
                name: 'updated name',
                price: '100.00',
                category: 'Main',
                checked: false,
                date_added: new Date(),
            }
            return shoppingListService.updateItem(db, idOfItem, newItemData)
                .then(() => shoppingListService.getItemById(db, idOfItem))
                .then(item => {
                    expect(item).to.eql({
                        item_id: idOfItem,
                        ...newItemData,
                    })
                })
        })
    })


    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return shoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
            const newItem = {
                name: 'Test new item',
                price:'15.00',
                category:'Snack',
                checked: false,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
            }
            return shoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        item_id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        category: newItem.category,
                        checked: newItem.checked,
                        date_added: newItem.date_added
                    })
                })
        })
    })
})