import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { Configuration, OpenAIApi } from "openai"
import clientPromise from "../../lib/mongodb"


export default withApiAuthRequired( async function handler(req, res) {
    //getting logged in user with session
    const {user} = await getSession(req,res)
    //conecction to mongodb **lib file**
    const client = await clientPromise
    //choosing database
    const db = client.db('aiblog')
    //locating user to do decrement
    const userProfile = await db.collection("users").findOne({
        auth0id: user.sub
    })

    console.log(userProfile.availableTokens);

    if(!userProfile.availableTokens){
        res.status(401)
        return
    }

    //makes the request to openai api
    const config = new Configuration({
        apiKey: process.env.OPEN_AI_KEY
    })
    const openai = new OpenAIApi(config)

    const {topic, keywords} = req.body

    //this is sent to openai api  **model: text-davinci-003**
    // const response = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     temperature: 1,
    //     max_tokens: 3600,
    //     prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following coma-seperated ${keywords}. 
    //     the content should be formatted in SEO-friendly HTML. 
    //     the response must also include appropriate HTML title and meta description.
    //     the return format must be stringified JSON in the following format:
    //     {
    //         "postContent: post content here,
    //         "title": meta description goes here
    //     }
    //     `
    // })

    //model: gpt-3.5-turbo
    const postContentResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 1,
        messages: [{
            //this is telling the api how it should behave
            role: "system",
            content: "You are a blog post generator"
        }, {
            role: "user",
            content: `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following coma-seperated ${keywords}. 
                    the content should be formatted in SEO-friendly HTML, 
                    limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i`
        }]
    })

    const postContent = postContentResponse.data.choices[0]?.message?.content || ""

    const titleResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 1,
        messages: [{
            role: "system",
            content: "You are a blog post generator"
        }, {
            role: "user",
            content: `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following coma-seperated ${keywords}. 
                    the content should be formatted in SEO-friendly HTML, 
                    limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i`
        }, {
            role: "assistant",
            content: postContent
        }, {
            role: "user",
            content: "Generate appropriate title tag text for the above blog post"
        }]
    })
    
    const metaDescriptionResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 1,
        messages: [{
            role: "system",
            content: "You are a blog post generator"
        }, {
            role: "user",
            content: `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following coma-seperated ${keywords}. 
                    the content should be formatted in SEO-friendly HTML, 
                    limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i`
        }, {
            role: "assistant",
            content: postContent
        }, {
            role: "user",
            content: "Generate SEO-friendly meta description content for the above blog post"
        }]
    })

    const title = titleResponse.data.choices[0]?.message.content || ""
    const metaDescription = metaDescriptionResponse.data.choices[0]?.message.content || ""


    console.log('Post Content: ', postContent);
    console.log('Title: ', title);
    console.log('Meta Description: ', metaDescription);

    
    //decrement tokens when pressed
    await db.collection("users").updateOne({
        auth0id: user.sub
    },{
        $inc: {
            availableTokens: -1
        }
    })
    
    const post = await db.collection("posts").insertOne({
        postContent,
        title,
        metaDescription,
        topic,
        keywords,
        user: userProfile._id,
        created: new Date()
    })
    
    res.status(200).json({
        post: {
            postContent,
            title,
            metaDescription,
        }
    })

    //model: text-davinci-003
    // res.status(200).json({ post: JSON.parse(response.data.choices[0]?.text.split("\n").join("")) })
})