import { Navbar } from "@/components/navbar";
import { connection } from "next/server";

export async function MarketHeader() {
  await connection();

  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return <Navbar banglaDate={banglaDate} />;
}
