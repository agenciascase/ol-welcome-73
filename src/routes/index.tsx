import { createFileRoute } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scase | Fim de ano é a hora de vender" },
      {
        name: "description",
        content:
          "Tráfego pago para novembro e dezembro, sem contrato. Responda algumas perguntas e escolha um horário com o time da Scase.",
      },
    ],
  }),
  component: LandingPage,
});

const ACCENT = "#00ff6a";
const BG = "#0b0b0b";
const PANEL = "#0f0f0f";
const LINE = "#1f1f1f";
const MUTED = "#a3a3a3";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type ContactKey = "nome" | "empresa" | "instagram" | "email" | "whatsapp";

const CONTACT_FIELDS: { key: ContactKey; label: string }[] = [
  { key: "nome", label: "Nome completo" },
  { key: "empresa", label: "Nome da empresa" },
  { key: "instagram", label: "Instagram da empresa (@)" },
  { key: "email", label: "E-mail" },
  { key: "whatsapp", label: "WhatsApp" },
];

type Step =
  | { kind: "contact"; label: string; title: string }
  | { kind: "choice"; label: string; title: string; key: string; options: string[] };

const STEPS: Step[] = [
  { kind: "contact", label: "01 / CONTATO", title: "Informe seus dados para dar início ao atendimento." },
  {
    kind: "choice",
    label: "02 / PORTE",
    title: "Quantos colaboradores tem sua empresa?",
    key: "porte",
    options: ["Até 10 pessoas", "11 a 50", "Acima de 50"],
  },
  {
    kind: "choice",
    label: "03 / MARKETING",
    title: "Quem cuida do marketing atualmente?",
    key: "marketing",
    options: ["Equipe interna", "Agência", "Freelancer", "Franqueadora", "Nós mesmos", "Não temos estrutura definida"],
  },
  {
    kind: "choice",
    label: "04 / TRÁFEGO",
    title: "Hoje vocês investem em tráfego pago?",
    key: "trafego",
    options: ["Não investimos", "Até R$ 3 mil/mês", "R$ 3 mil a R$ 10 mil/mês", "R$ 10 mil a R$ 30 mil/mês", "Acima de R$ 30 mil/mês"],
  },
  {
    kind: "choice",
    label: "05 / DECISÃO",
    title: "Você participa da decisão sobre contratação de marketing?",
    key: "decisor",
    options: ["Sim, sou o responsável pela decisão", "Participo da decisão", "Preciso apresentar para outro responsável"],
  },
  {
    kind: "choice",
    label: "06 / FATURAMENTO",
    title: "Qual o faturamento mensal aproximado?",
    key: "faturamento",
    options: ["Até R$ 30 mil", "R$ 30 a 100 mil", "Acima de R$ 100 mil"],
  },
  {
    kind: "choice",
    label: "07 / OBJETIVO",
    title: "Qual o seu objetivo nos próximos 2 meses?",
    key: "objetivo",
    options: ["Mais clientes", "Mais contatos", "Entrar em nova região", "Fortalecer a marca"],
  },
  {
    kind: "choice",
    label: "08 / INÍCIO",
    title: "Quando você quer começar?",
    key: "inicio",
    options: ["Esta semana", "Em até 15 dias", "Só depois de novembro"],
  },
];

const TIME_SLOTS = ["Seg 10h", "Seg 14h", "Ter 11h", "Qua 16h"];

type Screen = "form" | "schedule" | "disqualified";

function LandingPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState("");
  const [screen, setScreen] = useState<Screen>("form");
  const [slot, setSlot] = useState<string | null>(null);

  const total = STEPS.length;
  const step = STEPS[idx];

  function next() {
    if (step.kind === "contact") {
      const missing = CONTACT_FIELDS.some((f) => !(answers[f.key] ?? "").trim());
      if (missing) return setError("Preencha todos os campos para continuar.");
    } else if (!answers[step.key]) {
      return setError("Escolha uma opção para continuar.");
    }
    setError("");
    if (idx === total - 1) {
      const desqualificado =
        answers.faturamento === "Até R$ 30 mil" || answers.inicio === "Só depois de novembro";
      setScreen(desqualificado ? "disqualified" : "schedule");
      return;
    }
    setIdx(idx + 1);
  }

  function back() {
    setError("");
    if (idx > 0) setIdx(idx - 1);
  }

  function setValue(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div style={{ background: BG, color: "#f4f4f4", minHeight: "100vh", fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <header style={{ padding: "16px 28px", borderBottom: `1px solid ${LINE}` }}>
          <img src="/logo-branca.png" alt="Scase" style={{ height: 44, width: "auto" }} />
        </header>

        <section
          style={{
            padding: "48px 28px 40px",
            position: "relative",
            background: `linear-gradient(180deg, rgba(11,11,11,0.25) 0%, rgba(11,11,11,0.6) 70%, ${BG} 100%), url(/fundo-crise.jpg) center 30% / cover no-repeat`,
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, letterSpacing: 2, marginBottom: 16 }}>
            FIM DE ANO É A HORA DE VENDER
          </div>
          <h1 style={{ fontSize: 40, lineHeight: 1.05, fontWeight: 800, letterSpacing: -1, margin: "0 0 18px", textWrap: "balance" }}>
            Ou você aumenta suas vendas nesse final de ano, ou sua empresa vai falir.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: MUTED, margin: "0 0 24px" }}>
            Com a Scase, sua marca aparece para quem está comprando agora, não depois do Natal. Dois meses de tráfego
            pago, sem contrato.
          </p>
          <a
            href="#form"
            style={{
              display: "inline-block",
              background: ACCENT,
              color: "#0b0b0b",
              fontWeight: 800,
              fontSize: 15,
              padding: "16px 30px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Começar agora ↓
          </a>
        </section>

        {screen === "form" && (
          <section id="form" style={{ padding: "40px 28px", borderTop: `1px solid ${LINE}`, background: PANEL }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: "#8a8a8a" }}>
                {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <div style={{ flex: 1, height: 2, background: "#262626" }}>
                <div style={{ height: 2, width: `${((idx + 1) / total) * 100}%`, background: ACCENT }} />
              </div>
            </div>

            <div style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, letterSpacing: 2, marginBottom: 12 }}>{step.label}</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, margin: "0 0 22px", textWrap: "balance" }}>
              {step.title}
            </h2>

            {step.kind === "contact" ? (
              <div style={{ display: "grid", gap: 10 }}>
                {CONTACT_FIELDS.map((f) => (
                  <input
                    key={f.key}
                    id={f.key}
                    placeholder={f.label}
                    value={answers[f.key] ?? ""}
                    onChange={(e) => setValue(f.key, e.target.value)}
                    style={inputStyle}
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {step.options.map((opt) => {
                  const on = answers[step.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setValue(step.key, opt);
                        setError("");
                      }}
                      style={{
                        ...optionStyle,
                        borderColor: on ? ACCENT : "#333",
                        color: on ? ACCENT : "#d4d4d4",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ fontSize: 13, color: "#f87171", minHeight: 20, marginTop: 12 }}>{error}</div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
              {idx > 0 && (
                <button type="button" onClick={back} style={backButtonStyle}>
                  Voltar
                </button>
              )}
              <button type="button" onClick={next} style={primaryButtonStyle}>
                {idx === total - 1 ? "Ver horários →" : "Próxima →"}
              </button>
            </div>
          </section>
        )}

        {screen === "schedule" && (
          <section style={{ padding: "40px 28px", borderTop: `1px solid ${LINE}` }}>
            <div style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, letterSpacing: 2, marginBottom: 12 }}>ÚLTIMO PASSO</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", textWrap: "balance" }}>
              Escolha o melhor horário para falar com o time.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, marginBottom: 24 }}>
              {TIME_SLOTS.map((s) => {
                const on = slot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    style={{
                      border: `1px solid ${on ? ACCENT : "#333"}`,
                      borderRadius: 8,
                      padding: "12px 6px",
                      fontSize: 13,
                      color: on ? "#0b0b0b" : MUTED,
                      background: on ? ACCENT : "transparent",
                      fontWeight: on ? 700 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <button type="button" disabled={!slot} style={{ ...primaryButtonStyle, width: "100%", opacity: slot ? 1 : 0.5 }}>
              Confirmar agendamento
            </button>
          </section>
        )}

        {screen === "disqualified" && (
          <section style={{ padding: "40px 28px", borderTop: `1px solid ${LINE}` }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, margin: "0 0 12px" }}>
              Por enquanto, vamos te enviar conteúdo gratuito.
            </h2>
            <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>
              Seu perfil ainda não se encaixa na condição de novembro e dezembro. Quando fizer sentido, a agenda estará
              aberta.
            </p>
          </section>
        )}

        <footer
          style={{
            padding: "18px 28px",
            borderTop: `1px solid ${LINE}`,
            fontFamily: MONO,
            fontSize: 11,
            color: "#6b6b6b",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span>© SCASE</span>
          <span>BRANDING · DESIGN · PERFORMANCE</span>
        </footer>
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "1px solid #333",
  borderRadius: 12,
  padding: "16px 18px",
  color: "#f4f4f4",
  fontSize: 15,
  fontFamily: "inherit",
};

const optionStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  background: "transparent",
  border: "1px solid #333",
  borderRadius: 12,
  padding: "16px 18px",
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "inherit",
};

const primaryButtonStyle: CSSProperties = {
  background: ACCENT,
  color: "#0b0b0b",
  fontWeight: 800,
  fontSize: 15,
  padding: "16px 34px",
  borderRadius: 999,
  border: 0,
  cursor: "pointer",
  fontFamily: "inherit",
};

const backButtonStyle: CSSProperties = {
  border: "1px solid #333",
  color: MUTED,
  padding: "14px 22px",
  borderRadius: 999,
  fontSize: 14,
  background: "transparent",
  cursor: "pointer",
  fontFamily: "inherit",
};
