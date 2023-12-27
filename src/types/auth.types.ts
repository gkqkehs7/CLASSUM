interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
}

export { SignUpResponse, SignInResponse };
