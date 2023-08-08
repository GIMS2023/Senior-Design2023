import Head from 'next/head';

const DOMAIN = process.env.DOMAIN;

export async function getServerSideProps(context) {
    const { userId } = context.params;

    const response = await fetch(DOMAIN + `/api/verifyUser`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

    const data = await response.json();
    const { success } = data;

    return {
        props: {
            success: success
        }
    }
}

export default function Verify({ success }) {
    if (success) {
        return (
            <>
            <Head>
                <title>Verify</title>
            </Head>
            <div>
                <h1>You have been verified</h1>
            </div>
            </>
        );
    } else {
        return (
            <>
            <Head>
                <title>Verify</title>
            </Head>
            <div>
                <h1>There was an error verifying your account</h1>
            </div>
            </>
        );
    }
}