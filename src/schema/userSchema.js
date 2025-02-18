import { z } from 'zod';

export const UserSchema = z.object({
    email:z.string().email(),
    username:z.string().max(20),
    password:z.string()
})