import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CallbackPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Once the router is ready, check the url params for the code
  // and fetch the user's access token from the API
  useEffect(() => {
    async function fetchToken() {
      if (!router.isReady) return;

      if (router.query.error) {
        setError(router.query.error);
        return;
      }

      const res = await fetch(`/api/token?code=${router.query.code}`);
      const json = await res.json();
      const { data, error } = json;

      if (error) {
        setError(error);
        return;
      }

      setData(data);
    }
    fetchToken();
  }, [router.isReady, router.query.code]);

  return (
    <div>
      <h1>Callback</h1>
      {renderContent(data, error)}
    </div>
  );
}

function renderContent(data, error) {
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {data.access_token && <p>Token: {data.access_token}</p>}
      {data.workspace_name && <p>Workspace Name: {data.workspace_name}</p>}
    </>
  );
}
