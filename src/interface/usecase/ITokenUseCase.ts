interface ITokenUseCase {
  refreshAccessToken(refreshToken: string): Promise<string | never>
}

export default ITokenUseCase