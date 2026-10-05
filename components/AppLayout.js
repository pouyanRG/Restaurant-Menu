import StatusBar from "./StatusBar";

export default function AppLayout({ children }) {
  return (
    <div className="stage">
      <main className="app">
        <StatusBar />
        {children}
      </main>
    </div>
  );
}
