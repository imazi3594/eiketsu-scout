import { useEffect, useState } from "react";
import { Download, Share, Smartphone, Zap } from "lucide-react";
import { CARD_COUNT } from "@/data/catalog";

type BeforeInstall = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function AboutPage() {
  const [installEvent, setInstallEvent] = useState<BeforeInstall | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(standalone);
    setIos(/iPhone|iPad|iPod/i.test(navigator.userAgent) && !standalone);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstall);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallEvent(null);
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <img
          src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
          alt=""
          width={96}
          height={96}
          className="size-24 rounded-3xl shadow-[var(--shadow-border)]"
        />
        <div className="mt-4 flex items-center gap-2">
          <Zap className="size-5 fill-cost text-cost" strokeWidth={2.25} aria-hidden />
          <h2 className="font-display text-2xl tracking-tight">英傑大戦 速查</h2>
        </div>
        <p className="mt-2 text-sm text-muted">對戰用口袋手冊　·　{CARD_COUNT} 張</p>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-pretty text-fg">
        對戰入面打個名、卡號或計略，即刻睇時長（C）、武力／回血、渾身三欄、琥煌 0–6 劍。專為手機一隻手速查。
      </p>

      <section className="mt-6 rounded-lg border border-white/10 bg-black/35 p-4">
        <p className="flex items-center gap-2 text-xs text-faint">
          <Smartphone className="size-3.5" />
          裝去主畫面
        </p>
        {installed ? (
          <p className="mt-3 text-sm text-fg">已經裝咗。之後由主畫面開就得，唔使行瀏覽器。</p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void install()}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-md border border-black bg-cost font-medium text-black"
            >
              <Download className="size-4" />
              安裝到手機
            </button>
            {ios ? (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
                <li>
                  撳 Safari 底欄
                  <Share className="mx-1 inline size-3.5 align-[-2px]" />
                  分享
                </li>
                <li>向上滑，揀「加到主畫面」</li>
                <li>右上角「加入」</li>
              </ol>
            ) : !installEvent ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                如果掣撳唔到，用 Chrome 右上選單 →「安裝應用程式」／「加到主畫面」。
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted">撳上面就會彈系統安裝確認。</p>
            )}
          </>
        )}
      </section>

      <section className="mt-4 rounded-lg border border-white/10 bg-black/35 p-4 text-sm leading-relaxed text-pretty text-muted">
        <p>
          數值整理自{" "}
          <a className="text-fg underline decoration-border underline-offset-2" href="https://eiketsudb.com/" target="_blank" rel="noreferrer">
            eiketsudb.com
          </a>
          ，對戰時唔使另開官網慢慢翻。
        </p>
        <p className="mt-3">英傑大戦係 SEGA 嘅遊戲。呢個係玩家自用速查，同官方無關係。</p>
      </section>

      <section className="mt-4 rounded-lg border border-white/10 bg-black/35 p-4 text-sm leading-relaxed text-pretty text-muted">
        <p className="text-xs text-faint">Credit</p>
        <p className="mt-2 text-fg">Grok（xAI）設計同整</p>
        <p className="mt-1">
          開源：{" "}
          <a
            className="text-fg underline decoration-border underline-offset-2"
            href="https://github.com/imazi3594/eiketsu-scout"
            target="_blank"
            rel="noreferrer"
          >
            imazi3594/eiketsu-scout
          </a>
        </p>
      </section>
    </main>
  );
}
