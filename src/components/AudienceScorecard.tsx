import growthData from "../newsletter-growth.json";

interface MonthlyRow {
  period: string;
  program_total: number;
  program_opted_in: number;
  direct_newsletter: number;
  partial?: boolean;
}

interface WeeklyRow {
  period: string;
  program_opted_in: number;
  direct_newsletter: number;
  partial?: boolean;
}

const fmt = (n: number | undefined | null) =>
  n == null ? "—" : n.toLocaleString("en-US");

function StackedBarChart({ monthly }: { monthly: MonthlyRow[] }) {
  if (!monthly.length) return null;
  const W = 760, H = 260, P = { t: 20, r: 16, b: 36, l: 52 };
  const chartW = W - P.l - P.r;
  const chartH = H - P.t - P.b;
  const max = Math.max(
    ...monthly.map((r) => (r.program_total || 0) + (r.direct_newsletter || 0))
  );
  const yMax = Math.ceil(max / 500) * 500;
  const barW = (chartW / monthly.length) * 0.7;
  const gap = (chartW / monthly.length) * 0.3;

  return (
    <div
      style={{
        background: "var(--cream)",
        border: "1px solid var(--gray-200)",
        borderRadius: "var(--radius-md)",
        padding: "16px 20px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--gray-700)",
          }}
        >
          Monthly newsletter funnel
        </div>
        <div style={{ fontSize: 11, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                background: "var(--gray-300)",
                borderRadius: 2,
                marginRight: 5,
                verticalAlign: "middle",
              }}
            />
            Program Interest (no opt-in)
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                background: "var(--blue)",
                borderRadius: 2,
                marginRight: 5,
                verticalAlign: "middle",
              }}
            />
            Program Opt-ins
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                background: "var(--green)",
                borderRadius: 2,
                marginRight: 5,
                verticalAlign: "middle",
              }}
            />
            Direct Newsletter
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = P.t + chartH * (1 - i / 4);
          return (
            <g key={i}>
              <line
                x1={P.l}
                y1={y}
                x2={W - P.r}
                y2={y}
                stroke="var(--gray-200)"
                strokeWidth={0.5}
              />
              <text
                x={P.l - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--gray-500)"
              >
                {fmt(Math.round((yMax * i) / 4))}
              </text>
            </g>
          );
        })}
        {monthly.map((r, idx) => {
          const cx = P.l + (chartW / monthly.length) * idx + gap / 2;
          const nonOpt = Math.max(0, (r.program_total || 0) - (r.program_opted_in || 0));
          const opt = r.program_opted_in || 0;
          const direct = r.direct_newsletter || 0;
          const nonOptH = (chartH * nonOpt) / yMax;
          const optH = (chartH * opt) / yMax;
          const directH = (chartH * direct) / yMax;
          const nonOptY = P.t + chartH - nonOptH;
          const optY = nonOptY - optH;
          const directY = optY - directH;
          const opacity = r.partial ? 0.55 : 1;
          const totalAll = nonOpt + opt + direct;
          return (
            <g key={r.period}>
              <rect
                x={cx}
                y={nonOptY}
                width={barW}
                height={nonOptH}
                fill="var(--gray-300)"
                opacity={opacity}
              >
                <title>
                  {r.period} Program (no opt-in): {fmt(nonOpt)}
                </title>
              </rect>
              <rect
                x={cx}
                y={optY}
                width={barW}
                height={optH}
                fill="var(--blue)"
                opacity={opacity}
              >
                <title>
                  {r.period} Program Opt-ins: {fmt(opt)}
                </title>
              </rect>
              <rect
                x={cx}
                y={directY}
                width={barW}
                height={directH}
                fill="var(--green)"
                opacity={opacity}
              >
                <title>
                  {r.period} Direct Newsletter: {fmt(direct)}
                </title>
              </rect>
              <text
                x={cx + barW / 2}
                y={P.t + chartH + 20}
                textAnchor="middle"
                fontSize="11"
                fill="var(--gray-700)"
              >
                {r.period.slice(2)}
                {r.partial ? "*" : ""}
              </text>
              <text
                x={cx + barW / 2}
                y={directY - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight={600}
                fill="var(--charcoal)"
              >
                {fmt(totalAll)}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize: 10, color: "var(--gray-500)", marginTop: 4 }}>
        * partial period
      </div>
    </div>
  );
}

export function AudienceScorecard() {
  const monthly = (growthData.monthly || []) as MonthlyRow[];
  const weekly = (growthData.weekly || []) as WeeklyRow[];

  const q4 = monthly.filter((r) => r.period >= "2026-04");
  const q4Program = q4.reduce((s, r) => s + r.program_opted_in, 0);
  const q4Direct = q4.reduce((s, r) => s + r.direct_newsletter, 0);

  const cellN: React.CSSProperties = {
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    padding: "10px 12px",
  };
  const cellL: React.CSSProperties = { padding: "10px 12px", textAlign: "left" };
  const thStyle: React.CSSProperties = {
    ...cellN,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "var(--gray-500)",
    fontWeight: 600,
    borderBottom: "1px solid var(--gray-200)",
  };
  const thL: React.CSSProperties = { ...thStyle, textAlign: "left" };
  const tdBorder: React.CSSProperties = {
    borderBottom: "1px solid var(--gray-100)",
  };

  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: 960,
        margin: "0 auto",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: 28,
            fontWeight: 600,
            margin: "0 0 4px",
            color: "var(--charcoal)",
          }}
        >
          OpenEd Audience Scorecard
        </h1>
        <div style={{ fontSize: 13, color: "var(--gray-500)" }}>
          Newsletter growth by source · Q4 FY26
        </div>
      </div>

      {/* Q4-to-date headline cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Q4 Program Interest",
            value: q4Program,
            note: "checkbox opt-ins",
          },
          {
            label: "Q4 Direct Newsletter",
            value: q4Direct,
            note: "standalone + footer + LM",
          },
          {
            label: "Q4 Total New Subs",
            value: q4Program + q4Direct,
            note: "gross acquisition",
          },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "var(--cream)",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--gray-500)",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "var(--charcoal)",
                fontFamily: "var(--font-headline)",
              }}
            >
              {fmt(c.value)}
            </div>
            <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 2 }}>
              {c.note}
            </div>
          </div>
        ))}
      </div>

      <StackedBarChart monthly={monthly} />

      {/* Monthly table */}
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--gray-500)",
          fontWeight: 600,
          margin: "24px 0 8px",
        }}
      >
        Monthly detail
      </div>
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid var(--gray-200)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={thL}>Month</th>
              <th style={thStyle}>Program Total</th>
              <th style={thStyle}>Program Opt-ins</th>
              <th style={thStyle}>Opt-in %</th>
              <th style={thStyle}>Direct Newsletter</th>
              <th style={thStyle}>Total New</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((r) => {
              const rate = r.program_total
                ? Math.round((100 * r.program_opted_in) / r.program_total)
                : 0;
              const total = r.program_opted_in + r.direct_newsletter;
              const rateColor =
                rate >= 70
                  ? "var(--green)"
                  : rate >= 50
                  ? "var(--orange)"
                  : "var(--red)";
              return (
                <tr key={r.period}>
                  <td style={{ ...cellL, ...tdBorder }}>
                    {r.period}
                    {r.partial && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 10,
                          color: "var(--orange)",
                        }}
                      >
                        partial
                      </span>
                    )}
                  </td>
                  <td style={{ ...cellN, ...tdBorder, color: "var(--gray-500)" }}>
                    {fmt(r.program_total)}
                  </td>
                  <td style={{ ...cellN, ...tdBorder }}>
                    {fmt(r.program_opted_in)}
                  </td>
                  <td
                    style={{
                      ...cellN,
                      ...tdBorder,
                      color: rateColor,
                      fontWeight: 600,
                    }}
                  >
                    {rate}%
                  </td>
                  <td style={{ ...cellN, ...tdBorder }}>
                    {fmt(r.direct_newsletter)}
                  </td>
                  <td
                    style={{ ...cellN, ...tdBorder, fontWeight: 700 }}
                  >
                    {fmt(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Weekly table */}
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--gray-500)",
          fontWeight: 600,
          margin: "24px 0 8px",
        }}
      >
        Weekly opt-ins
      </div>
      <div style={{ fontSize: 11, color: "var(--gray-500)", marginBottom: 8 }}>
        Weekly total-funnel submissions not yet tracked — opt-in % shown at
        monthly level above.
      </div>
      <div
        style={{
          background: "var(--cream)",
          border: "1px solid var(--gray-200)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={thL}>Week</th>
              <th style={thStyle}>Program Opt-ins</th>
              <th style={thStyle}>Direct Newsletter</th>
              <th style={thStyle}>Total New</th>
            </tr>
          </thead>
          <tbody>
            {weekly
              .slice()
              .reverse()
              .map((r) => {
                const total = r.program_opted_in + r.direct_newsletter;
                return (
                  <tr key={r.period}>
                    <td style={{ ...cellL, ...tdBorder }}>
                      {r.period}
                      {r.partial && (
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: 10,
                            color: "var(--orange)",
                          }}
                        >
                          partial
                        </span>
                      )}
                    </td>
                    <td style={{ ...cellN, ...tdBorder }}>
                      {fmt(r.program_opted_in)}
                    </td>
                    <td style={{ ...cellN, ...tdBorder }}>
                      {fmt(r.direct_newsletter)}
                    </td>
                    <td
                      style={{ ...cellN, ...tdBorder, fontWeight: 700 }}
                    >
                      {fmt(total)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          fontSize: 11,
          color: "var(--gray-500)",
          marginTop: 16,
          lineHeight: 1.5,
        }}
      >
        <strong>Program Interest</strong> = checkbox opt-ins on enrollment funnel
        forms (Reserve Your Spot, Info Guide, applications). <strong>Direct Newsletter</strong> = standalone +
        footer + book + lead magnet forms. Source: HubSpot form submissions.
      </div>
    </div>
  );
}
