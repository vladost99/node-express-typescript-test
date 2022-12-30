import { compare, hash } from 'bcryptjs';

export class User {
    private _passsword: string;

    constructor( private readonly _email: string, private readonly _name: string, passwordHash?: string) {
        
        if(passwordHash) {
            this._passsword = passwordHash;
        }
    }

    get email(): string {
       return this._email;
    }

    get name(): string {
        return this._name;
    }

    get password(): string {
        return this._passsword;
    }

    public async setPassword(pass: string, salt: number): Promise<void> {
        this._passsword = await hash(pass, salt);
    }

    public async comparePassword(pass: string): Promise<boolean> {
        return compare(pass, this._passsword);
    }
}