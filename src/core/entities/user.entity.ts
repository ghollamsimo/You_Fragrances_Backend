export class UserEntity {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly role: string,
        public password: string,
        public readonly gender: string,
        public readonly image : string
    ) {}
}
