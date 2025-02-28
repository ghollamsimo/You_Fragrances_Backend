export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export class RegisterDto {
  readonly name: string;
  readonly email: string;
  readonly role: Role;
  password: string;
  readonly gender: string;
  readonly image: string;

  constructor(name: string, email: string, role: Role, password: string, gender: string, image : string) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
    this.gender = gender;
    this.image = image
  }
}
