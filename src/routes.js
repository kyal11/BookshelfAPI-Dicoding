const {AddBookHandler}=require('./handler')
const routes=[
    {
        method: 'POST',
        path: '/books',
        handler: AddBookHandler,
    },

]

module.exports=routes