import { type Database } from "./database"

type PostEntity = Database['public']['Tables']['post']['Row'] 
type UserEntity = Database['public']['Tables']['users']['Row']

export type Post = PostEntity & {
    user: UserEntity
}