import { Header } from "@/components/header";
import { PasswordList } from "@/components/password-list";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <PasswordList />
      </main>
    </div>
  );
}
