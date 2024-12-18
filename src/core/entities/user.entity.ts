export class User {
    constructor(
        public readonly name: unknown,
        public readonly email: string,
        public password: string,
        public readonly gender: string,
        public readonly phone: number
    ) {}
}
