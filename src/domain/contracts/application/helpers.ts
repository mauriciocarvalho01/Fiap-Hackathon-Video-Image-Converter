export interface TokenValidator {
  validate: (input: TokenValidator.Input) => Promise<string>;
  encrypt: (data: string) => Promise<string>;
  generateUuid: () => string
}

export namespace TokenValidator {
  export type Input = { token: string };

}
