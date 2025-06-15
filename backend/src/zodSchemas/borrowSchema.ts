import {z} from 'zod'

export const borrowSchema = z.object({
    bookId : z.number().int().positive('Valid book ID is Required') , 
})