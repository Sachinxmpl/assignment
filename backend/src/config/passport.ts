import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dbclient from "./db";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                let user = await dbclient.user.findUnique({
                    where: { googleId: profile.id },
                });
                if (!user) {
                    user = await dbclient.user.create({
                        data: {
                            googleId: profile.id,
                            email: profile.emails![0].value,
                            name: profile.displayName,
                            role: "USER",
                        },
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);


passport.serializeUser((user: any, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await dbclient.user.findUnique({
            where: {
                id: id
            }
        })
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})