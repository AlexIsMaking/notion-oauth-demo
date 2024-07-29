import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  // Send the user to integration's auth url
  const handleClick = () => {
    router.push(process.env.NEXT_PUBLIC_NOTION_AUTH_URL);
  };

  return <button onClick={handleClick}>Connect</button>;
}
