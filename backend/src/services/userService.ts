import dbClient from "../config/db"
import bcrypt from 'bcryptjs'

export const userService = {
    register: async (email: string, password: string, name: string) => {
        const hashedpassword = await bcrypt.hash(password, 10)
        return dbClient.user.create({
            data: {
                email,
                password: hashedpassword,
                name,
                role: 'USER'
            }
        })
    },

    login: async (email: string, password: string) => {
        const user = await dbClient.user.findUnique({
            where: {
                email
            }
        })
        if (!user || !user.password) {
            throw new Error('Invalid Credentials')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Invalid Credentials')
        }
        return user
    },

    getUsers: async () => {
        return dbClient.user.findMany({
            select: {
                id: true, email: true, name: true, role: true
            }
        })
    },

    updateUser: async (id: number, data: Partial<{ email: string; name: string; role: 'USER' | 'ADMIN' }>) => {
        return dbClient.user.update({
            where: { id },
            data
        })
    },

    deleteUser: async (id: number) => {
        return dbClient.user.delete({
            where: {
                id
            }
        })
    }
}