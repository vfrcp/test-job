import CustomError from "../../../errors";
import {hash as hashPassword, compare as comparePassword} from "bcrypt";
import { UserModel } from "../../entities/user/model";
import { IChangeBoss, ILogin} from "./types";
import { IRegister } from "../../../../controllers/users/types";
import { IUser } from "../../entities/user/types";

class UserDB {
  async _userWithThatInfo (fieldName: string, value: string | undefined) {
    const obj: any = {}
    obj[fieldName] = value

    return await UserModel.findOne(obj)
  }
  async _getRecurseSubordinates (bossId: string) {
    const user = await UserModel.findById(bossId, {password: 0, authToken: 0}).populate('subordinates')
    if(!user) throw  CustomError.notExist("Your account was not found in the database")
    let subordinates = [user]
    if(user.subordinates?.length) {
      for (const sub of user.subordinates) {
        const subSubordinates = await this._getRecurseSubordinates(sub._id);
        subordinates = subordinates.concat(subSubordinates);
      }
    }
  return subordinates;
  }
  async _getNotSensitiveFields (user: IUser) {
    return {id: user.id, role: user.role, name: user.name}
  }
  async registerAdmin (data: IRegister) {
    const adminFromDB = await this._userWithThatInfo("role", data.role)
    if(adminFromDB) throw CustomError.alreadyExist("The administrator already exists")
    if(await this._userWithThatInfo("name", data.name)) throw CustomError.alreadyExist("A user with this name already exists")
    const newAdmin = new UserModel(data)
    newAdmin.bossId = undefined 
    newAdmin.password = await hashPassword(newAdmin.password, 10)
    await newAdmin.save()
    return newAdmin._id
  }
  async registerRegular (data: IRegister) {
    const bossFromDB = await UserModel.findById(data.bossId)
    if(!bossFromDB) throw CustomError.notExist("A boss with this Id was not found in the database")
    if(await this._userWithThatInfo("name", data.name)) throw CustomError.alreadyExist("A user with this name already exists")
    const newUser = new UserModel(data)
    newUser.password = await hashPassword(newUser.password, 10)
    await newUser.save()
    if(bossFromDB.role === "regular") {
      bossFromDB.role = "boss"
      await bossFromDB.save()
    }
    return newUser._id
  }
  async getAllUsers () {
    return await UserModel.find({}, {password: 0, authToken: 0})
  }
  async getSubordinates (bossId: string) {
    return await this._getRecurseSubordinates(bossId)
    
  }
  async changeBoss (data: IChangeBoss) {
    const boss = await UserModel.findById(data.bossId)
    const newBoss = await UserModel.findById(data.newBossId)
    if(!boss) throw CustomError.notExist("Your account was not found in the database")
    if(!newBoss) throw CustomError.notExist("The new boss was not found")
    const subordinates = await this._getRecurseSubordinates(data.bossId)
    let subordinateIndex = null
    subordinates.forEach((sub, subordinateIndexFromDb) => {
      if(sub.id === data.subordinateId) {
        subordinateIndex = subordinateIndexFromDb
      }
    })
    if(!subordinateIndex) throw  CustomError.notExist("The subordinate not found")
    subordinates[subordinateIndex].bossId = data.newBossId
    await subordinates[subordinateIndex].save()
    //New check because newBoss could be sub boss
    const newSubordinates = await this._getRecurseSubordinates(data.bossId)
    if(newSubordinates.length < 2) {
      boss.role = "regular"
      await boss.save()
    }
    newBoss.role = "boss"
    await newBoss.save()
    return boss.id
  }
  async login (data: ILogin) {
    const userFromDB = await this._userWithThatInfo("name", data.name)
    if(!userFromDB) throw CustomError.notExist("A user with this name does not exist")
    if(!comparePassword(userFromDB.password, data.password)) throw CustomError.reqBodyInvalid("The password is wrong")
    return this._getNotSensitiveFields(userFromDB)
  }
  async getAuthToken (userId: string) {
    const user = await UserModel.findById(userId)
    if(!user) throw CustomError.notExist("The user not found")
    return user.authToken
  }
  async setAuthToken (userId: string, token: string) {
    const user = await UserModel.findById(userId)
    if(!user) throw CustomError.notExist("The user not found")
    user.authToken = token 
    await user.save()
  }
}

export default new UserDB()