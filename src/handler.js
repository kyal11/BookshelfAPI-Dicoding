const { nanoid } = require('nanoid')
const books = require('./books')

const AddBookHandler = (request,h) =>{
    const { name,year,author,summary,publisher,pageCount,readPage,reading }=request.payload

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
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString()
    const updatedAt =insertedAt

    const newBooks={
        id,name,year,author,summary,publisher,pageCount,readPage,reading,finished,insertedAt,updatedAt,
    }
    books.push(newBooks)

    
    const isSucces = books.filter((book) => book.id == id).length > 0
    
    if(isSucces){
        const response=h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId:id,
            }
           })
           response.code(201)
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
    const { name, reading, finished } = request.query; 

  if (books.length >= 1) {
    let getBook = books.slice()

    if (name) {
      getBook = getBook.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (reading !== undefined) { 
      getBook = getBook.filter((book) => book.reading === Boolean(Number(reading)));
    }
    if (finished !== undefined) { 
      getBook = getBook.filter((book) => book.finished === Boolean(Number(finished)));
    }

    const response = h.response({
      status: 'success',
      data: {
        books: getBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });

  response.code(200)
  return response
}
const GetDtlBook=(request,h)=>{
    const { bookId }=request.params

    const book = books.filter((book)=>book.id === bookId)[0]

    if (book !== undefined){
        const response=h.response({
            status: 'success',
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
    const {bookId}=request.params
    const { name,year,author,summary,publisher,pageCount,readPage,reading } = request.payload
    const updatedAt = new Date().toISOString();

    if(name === undefined){
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
    const index = books.findIndex((book)=>book.id === bookId)

    if (index !== -1 ){
        const finished = pageCount === readPage ? true : false;
        

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
            status: 'success',
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
    const { bookId } = request.params

    const index = books.findIndex((book)=>book.id === bookId)

    if(index !== -1){
        books.splice(index,1)
        const response = h.response({
            status: 'success',
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