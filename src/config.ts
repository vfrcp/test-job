interface IConfig {
  app: {
    port: number,
    reqTimeout: string
  }
  auth: {
    secretA: string
    secretR: string
  }
  db: {
    url: string
  }
}
// Default 
// export const config: IConfig = {
//   app: {
//     port: 5000,
//     reqTimeout: "5s"
//   },
//   auth: {
//     secretA: "secretA",
//     secretR: "secretR"
//   },
//   db: {
//     url: "mongodb+srv://1111:1111@cluster0.vz6oheb.mongodb.net/?retryWrites=true&w=majority"
//   }
// }
