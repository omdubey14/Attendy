import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell } from "../shared/AuthShell";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // defaultValues: {
    //   email: "dubey161412@gmail.com",
    //   password: "799987",
    // },
  });

  const onSubmit = async (values) => {
    const response = await login(values);
    const role = response.data.user.role;
    navigate(`/${role}`);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your dashboard, reports, and real-time updates."
      footerText="Need an account?"
      footerLink="/register"
      footerAction="Register"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input className="input" {...register("email", { required: "Email is required" })} />
          {errors.email ? <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="input"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>
          ) : null}
        </div>
        <button disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        <p className="font-semibold">Quick start</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link className="text-sky-500" to="/register">
            Create a new student or teacher account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};
