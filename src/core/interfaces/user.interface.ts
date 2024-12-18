import {User} from '../entities/user.entity'

export interface UserInterface {

    store(user: User): Promise<User>
    index(user: User): User
}