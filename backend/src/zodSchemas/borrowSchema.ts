import {z} from 'zod'

export const borrwoSchema = z.object({
    bookId : z.number().int().positive('Valid book ID is Required') , 
})