import { useState } from "react";
import Admin from "./Admin";
import Navbar from "../components/Navbar";

const PIN = "1234";

export default function AdminGuard({ lang, setLang }) {
  const [pin, setPin] = useState("");
  const auth = localStorage.getItem("admin_auth") === "true";

  if (auth) return <Admin lang={lang} setLang={setLang} />;

  return (
    <div>
      <Navbar lang={lang} setLang={setLang} />
    
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (pin === PIN) {
          localStorage.setItem("admin_auth", "true");
          window.location.reload();
        }
      }}
    >
      <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" />
      <button>Enter</button>
    </form>
    </div>
  );
}
