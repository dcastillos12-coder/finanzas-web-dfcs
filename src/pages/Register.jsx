import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmation: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.confirmation);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {[["name", "Nombre", "text"], ["email", "Correo electrónico", "email"], ["password", "Contraseña", "password"], ["confirmation", "Confirmar contraseña", "password"]].map(([key, placeholder, type]) => (
          <input key={key} className="w-full rounded-md border bg-background px-3 py-2" type={type} placeholder={placeholder} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />
        ))}
        <Button className="w-full" disabled={submitting} type="submit">
          {submitting ? "Creando cuenta..." : "Registrarse"}
        </Button>
        <p className="text-center text-sm">¿Ya tienes cuenta? <Link className="underline" to="/login">Inicia sesión</Link></p>
      </form>
    </main>
  );
}
