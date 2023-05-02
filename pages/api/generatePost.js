import { Configuration, OpenAIApi } from "openai"


export default async function handler(req, res) {
    const config = new Configuration({
        apiKey: process.env.OPEN_AI_KEY
    })
    const openai = new OpenAIApi(config)

    const {topic, keywords} = req.body

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        temperature: 1,
        max_tokens: 3600,
        prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following coma-seperated ${keywords}. 
        the content should be formatted in SEO-friendly HTML. 
        the response must also include appropriate HTML title and meta description.
        the return format must be stringified JSON in the following format:
        {
            "postContent: post content here,
            "title": meta description goes here
        }
        `
    })
    console.log(response.data.choices);
    res.status(200).json({ post: JSON.parse(response.data.choices[0]?.text.split("\n").join("")) })
}