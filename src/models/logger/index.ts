import fs from "fs";
import path from "path";

class Logger {
  async add (data: any) {
    fs.appendFile(path.join(__dirname, "..", "..", "log.txt"), `${data}, ${new Date()}\n`, () => {
      console.log("Unexpected error wrote in log.txt", new Date())
    })
  }
}

export default new Logger()