//nameing convention of page is to make it dynamic **example    get user id**
import { withPageAuthRequired} from "@auth0/nextjs-auth0";

export default function Post() {
    return <div>
        <h1>this is the post page</h1>
    </div>
    ;
}

export const getServerSideProps = withPageAuthRequired(() => {
    return{
        props: {}
    }
})