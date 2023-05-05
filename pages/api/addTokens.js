import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    //getSession gets active loging user
    const {user} = await getSession(req, res)

    console.log(user);

    const client = await clientPromise
    const db = client.db("aiblog")

    const userProfile = await db.collection("users").updateOne({
        auth0id: user.sub
    }, {
        $inc: {
            availableTokens: 10
        },
        $setOnInsert: {
            auth0id: user.sub
        }
    }, {
        upsert: true
    })

    res.status(200).json({ name: 'John Doe' })
}