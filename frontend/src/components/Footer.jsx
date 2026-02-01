export default function Footer({ lang }) {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: "20px 16px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(250,247,242,0.85)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 900 }}>TOUFAYOUR</div>
        <div style={{ opacity: 0.75 }}>
          {lang === "ar" ? "جميع الحقوق محفوظة" : "Tous droits réservés"} © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
