const {AddBookHandler,GettAllBook,GetDtlBook,UpdateBook, DeleteBook}=require('./handler')
const routes=[
    {
        method: 'POST',
        path: '/books',
        handler: AddBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: GettAllBook,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler:GetDtlBook,
    },
    {
        method:'PUT',
        path: '/books/{bookId}',
        handler: UpdateBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: DeleteBook
    }

]

module.exports=routes