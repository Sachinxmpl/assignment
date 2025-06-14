import {z} from 'zod'

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password : z.string().min(6, 'Password must be altest 6 characters') , 
    name : z.string().min(1 , 'Name is required')
})

export const loginSchema = z.object({
    email : z.string().email('Invalid email address') , 
    password : z.string().min(6 , 'Password must be atleast 6 character')
})