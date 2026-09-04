import SubscribeForm from "./SubscribeForm";

export const metadata = {
  title: "Subscribe — Lough Signal",
  description:
    "Get the free Lough Signal economic briefing: an evidence-led reading of the Northern Ireland economy.",
};

export default function SubscribePage() {
  return (
    <main className="ls-page">
      <SubscribeForm leadSource="subscribe_page" />
    </main>
  );
}
