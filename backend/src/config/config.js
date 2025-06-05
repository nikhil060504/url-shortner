

export const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 3600000),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
}