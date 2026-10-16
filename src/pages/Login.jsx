import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Iniciar sesión</h1>
          <p className="text-muted-foreground">Accede a tu cuenta.</p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <input
          className="w-full rounded-md border bg-background px-3 py-2"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded-md border bg-background px-3 py-2"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        <Button className="w-full" disabled={submitting} type="submit">
          {submitting ? "Ingresando..." : "Iniciar sesión"}
        </Button>
        <p className="text-center text-sm">
          ¿No tienes cuenta? <Link className="underline" to="/register">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}
