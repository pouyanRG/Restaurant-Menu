import LiquidGlassDefs from "./LiquidGlassDefs";

export default function AppLayout({ children }) {
  return (
    <div className="stage">
      <LiquidGlassDefs />
      <main className="app">
        {children}
      </main>
    </div>
  );
}