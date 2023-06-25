export interface IRegister {
  name: string
  password: string
  bossId?: string
  role: "regular" | "administrator"
}

export interface ILogin {
  name: string
  password: string
}

export interface IBossChange {
  newBossId: string,
  subordinateId: string
}