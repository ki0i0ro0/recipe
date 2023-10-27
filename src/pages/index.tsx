import { useSession, signIn } from "next-auth/react";
import { TopPage } from "@/components/TopPage";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return <TopPage />;
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
