const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUri = process.env.OAUTH_REDIRECT_URI;
const databaseId = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  /* Make the request to Notion to get the token, user and workspace info */
  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code: code,
    }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error("Error response from Notion:", errorResponse);
    return res.status(response.status).json(errorResponse);
  }

  const data = await response.json();

  // console.log("Response data", JSON.stringify(data, null, 2));

  /* Fetch your database to test the token */
  // const { access_token } = data;

  // const response2 = await fetch(
  //   `https://api.notion.com/v1/databases/${databaseId}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //       "Notion-Version": process.env.NOTION_VERSION,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // if (!response2.ok) {
  //   const errorResponse = await response2.json();
  //   console.error("Error response from Notion:", errorResponse);
  //   return res.status(response2.status).json({ error: errorResponse.message });
  // }

  // const data2 = await response2.json();

  // console.log("Response 2 data: ", JSON.stringify(data2, null, 2));

  /* Store the access token for future requests */

  return res.status(200).json({ data });
}
