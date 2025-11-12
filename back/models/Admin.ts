import mongoose, {Model} from "mongoose";
import {AdminDef} from "../types";
import bcrypt from "bcrypt";
import {randomUUID} from "node:crypto";

interface AdminMethods {
  checkPassword(password: string): Promise<boolean>;

  generateToken(): void;
}

type AdminModel = Model<AdminDef, object, AdminMethods>

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const AdminSchema = new Schema<AdminDef, AdminModel, AdminMethods>({
    email: {
      type: String, required: true, unique: true,
      validate: {
        validator: async function (value: string): Promise<boolean> {
          if (!this.isModified('email')) {
            return true;
          }
          const admin = await Admin.findOne({email: value});
          return Boolean(!admin);
        },
        message: 'This user already exist'
      }
    },
    password: {
      type: String, required: true,
      validate: {
        validator: (value: string) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{8,}$/.test(value);
        },
        message: 'Password must be at least 8 characters and in both registers'
      }
    },
    token: {type: String, required: true},
    role: {type: String, required: true, enum: ["admin", "superAdmin"], default: "admin"},
  }
)

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);

  next();
})

AdminSchema.set('toJSON', {
  transform: (_doc, ret: Partial<AdminDef>) => {
    delete ret.password;
    return ret;
  }
})

AdminSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

AdminSchema.methods.generateToken = function () {
  this.token = randomUUID();
}

const Admin = mongoose.model<AdminDef, AdminModel>("Admin", AdminSchema);
export default Admin;