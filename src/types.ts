interface IResponseSuccess {
  status: "success",
  body: any,
  message: null,
}
interface IResponseWrong {
  status: "error" | "unexpectedError",
  body: any,
  message: string
}

export type IResponse = IResponseSuccess | IResponseWrong 