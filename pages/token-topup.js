import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout/AppLayout";

export default function TokenTopUp() {

    const handleClick = async () => {
        await fetch(`/api/addTokens`, {
            method: "POST"
        })
    }

    return <div>
        <h1>this is the tokentop-up page</h1>
        <button className="btn" onClick={handleClick}>Add Tokens</button>
    </div>
    ;
}

TokenTopUp.getLayout = function getLayout(page, pageProps){
    return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired(()=>{
    return{
        props:{}
    }
})