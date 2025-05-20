import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Use the secret key for verifying tokens (ensure this key matches the one used to sign tokens)
const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET_KEY
);

export async function middleware(req: NextRequest) {
  const { cookies } = req;
  const token = cookies.get("token")?.value;
  const loginUrl = new URL("/login", req.url);

  if (!token) {
    console.log("No token found. Redirecting to /login");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decodedPayload = decodeJWT(token);

    // Verify the token using your secret key
    const { payload: verifiedPayload } = await jwtVerify(token, SECRET_KEY);
    console.log("Verified token payload:", verifiedPayload);

    // Check token expiration
    if (verifiedPayload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = verifiedPayload.exp - currentTime;

      console.log(
        `Time remaining before token expires: ${timeRemaining} seconds`
      );

      if (timeRemaining <= 0) {
        console.log(
          "Token has expired. Removing token from cookies and redirecting to /login"
        );
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.set("token", "", { path: "/", maxAge: 0 });
        return response;
      }
    } else {
      console.log(
        "No expiration time found in token. Removing token and redirecting to /login"
      );
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.set("token", "", { path: "/", maxAge: 0 });
      return response;
    }

    // Admin role check
    if (verifiedPayload.role !== "Admin") {
      console.log("User is not admin. Redirecting to /login");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("token", "", { path: "/", maxAge: 0 });
      return response;
    }

    // Passed all checks
    return NextResponse.next();
  } catch (err) {
    console.log("Invalid token format. Redirecting to /login");
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("token", "", { path: "/", maxAge: 0 });
    return response;
  }
}

// Helper function to decode a JWT (without verifying its signature)
function decodeJWT(token: string): any | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = Buffer.from(payloadBase64, "base64").toString(
      "utf-8"
    );
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

// Specify the matcher to apply this middleware only to desired paths
export const config = {
  matcher: ["/((?!login|public|_next|favicon.ico|auth/).*)"],
};
