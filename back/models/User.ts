import mongoose, {Model} from "mongoose";
import {UserDef} from "../types";
import bcrypt from "bcrypt";
import {randomUUID} from "node:crypto";

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserDef, object, UserMethods>

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema <UserDef, UserModel, UserMethods>({
    email: {type: String, required: true, unique: true,
        validate: {
            validator: async function(value: string): Promise<boolean> {
                if (!this.isModified('email')) {
                    return true;
                }
                const user = await User.findOne({email: value});
                return Boolean(!user);
            },
            message: 'This user already exist'
        }},
    password: {type: String, required: true,
        validate: {
            validator: (value: string) => {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{8,}$/.test(value);
            },
            message: 'Password must be at least 8 characters and in both registers'
        }},
    token: {type: String, required: true},
    }
)

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

UserSchema.set('toJSON', {
    transform: (_doc, ret: Partial<UserDef>) => {
        delete ret.password;
        return ret;
    }
})

UserSchema.methods.checkPassword = function(password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function() {
    this.token = randomUUID();
}

const User = mongoose.model<UserDef, UserModel>("User", UserSchema);
export default User;