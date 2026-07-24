export interface JwtPayload {
  sub: number;
  role: "doctor" | "patient";
}
