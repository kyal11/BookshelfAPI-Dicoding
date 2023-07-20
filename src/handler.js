const { nanoid } = require('nanoid')
const books = require('./books')

const AddBookHandler = (request,h) =>{
    const {name,year,author,summary,publisher,pageCount,readPage,reading}=request.payload

    if (!name){
       const response=h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
       })
       response.code(400)
       return response
    }
    if (readPage>pageCount){
        const response=h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
           })
           response.code(400)
           return response
    }

    const id = nanoid(16)
    const finished = (pageCount === readPage)
    const insertedAt = new Date().toISOString()
    const updateAt =insertedAt

    const newBooks={
        name,year,author,summary,publisher,pageCount,readPage,reading,finished,insertedAt,updateAt  
    }
    books.push(newBooks)

    
    const isSucces = books.filter((book) => book.id == id).length > 0
    
    if(isSucces){
        const response=h.response({
            status: 'succes',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId:id,
            }
           })
           response.code(200)
           return response
    }
    const response=h.response({
        status:'error',
        message: 'Buku gagal ditambahkan',
    })
    response.code(500)
    return response
}

const GettAllBook = (request,h) =>{
    const {name,reading,finished}=request.payload

    if(books.length >= 1){
        const getBook=books
        if(name){
            getBook=getBook.filter((book)=>book.name.toLowerCase().include(name.toLowerCase()))
        }
        if (reading){
            getBook=getBook.filter((book)=>book.reading === Boolean(Number(reading)))
        }
        if (finished){
            getBook=getBook.filter((book)=>book.finished === Boolean(Number(finished)))
        }
        const response = h.response({
            status:'succes',
            data:{
                books:getBook.map((book)=>({
                    id:book.id,
                    name:book.name,
                    publisher:book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status:'succes',
        data:{
            books: [],
        }
    })
    response.code(200)
    return response
}
const GetDtlBook=(request,h)=>{
    const { id }=request.params

    const book = book.filter((book)=>book.id === id)[0]

    if (book !== undefined){
        const response=h.response({
            status: 'succes',
            data:{
                book,
            }
        })
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    })
    response.code(404)
    return response
}

const UpdateBook=(request,h)=>{
    const { name,year,author,summary,publisher,pageCount,readPage,reading } = request.payload

    if(!name){
        const response =h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }
    const index = book.findIndex((book)=>book.id === id)

    if (index !== -1 ){
        const finished = pageCount === readPage ? true : false;
        const updatedAt = new Date().toISOString();

        books[index]={
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        }
        const response = h.response({
            status: 'succes',
            message: 'Buku berhasil diperbarui'
        })
    
        response.code(200)
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });

    response.code(404)
    return response

}

const DeleteBook=(request,h)=>{
    const { id } = request.params

    const index = books.findIndex((book)=>book.id === id)

    if(index !== -1){
        books.splice(index,1)
        const response = h.response({
            status: 'succes',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response

}

module.exports={AddBookHandler,GettAllBook,GetDtlBook,UpdateBook,DeleteBook}