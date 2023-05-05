import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState } from "react";
import {AppLayout } from "../../components/AppLayout/AppLayout";

export default function NewPost() {
    const [postContent, setPostContent] = useState("")
    const [topic, setTopic] = useState("")
    const [keywords, setKeywords] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`/api/generatePost`, {
            // post request to server end point ^^
            method:'POST',
            //indicates that the request body is in JSON format
            headers: {
                'content-type': 'application/json'
            },
            //JSON_encoded request body from form
            body: JSON.stringify({topic, keywords})
        })
        const json = await response.json()

        setPostContent(json.post.postContent);
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    <strong>Generate a blog post on the topic of: </strong>
                </label>
                <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={topic} onChange={e => setTopic(e.target.value)}/>
            </div>

            <div>
                <label>
                    <strong>Targeting the following key words: </strong>
                </label>
                <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={keywords} onChange={e => setKeywords(e.target.value)}/>
            </div>

            <button type="submit" className="btn">
                Generate
            </button>
        </form>

        <div dangerouslySetInnerHTML={{__html: postContent}} className="max-w-screen-sm p-10"/>
    </div>
    ;
}

NewPost.getLayout = function getLayout(page, pageProps){
    return <AppLayout {...pageProps}>{page}</AppLayout>
}

//0auth function to redirect none login users
export const getServerSideProps = withPageAuthRequired(() => {
    return{
        props: {}
    }
})