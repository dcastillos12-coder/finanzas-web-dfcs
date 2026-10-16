import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-foreground">
      <h1 className="text-4xl font-bold tracking-tight">Proyecto nuevo</h1>

      <div className="flex gap-3">
        <Button>Iniciar sesión</Button>
        <Button variant="outline">Registrarse</Button>
      </div>
    </main>
  );
}

export default App;
