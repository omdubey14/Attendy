import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "../shared/AuthShell";
import { useAuth } from "../../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "student",
    },
  });
  const role = useWatch({ control, name: "role" });

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      phone: values.phone,
      gender: values.gender,
      profile:
        values.role === "student"
          ? {
              admissionNumber: values.admissionNumber,
              className: values.className,
              section: values.section,
              guardianName: values.guardianName,
              guardianPhone: values.guardianPhone,
            }
          : {
              employeeId: values.employeeId,
              department: values.department,
              qualification: values.qualification,
              subjects: values.subjects.split(",").map((item) => item.trim()).filter(Boolean),
            },
    };

    await registerUser(payload);
    navigate("/pending");
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Student and teacher registrations are sent to the admin for approval."
      footerText="Already registered?"
      footerLink="/login"
      footerAction="Sign in"
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-medium">Full name</label>
          <input className="input" {...register("name", { required: "Name is required" })} />
          {errors.name ? <p className="mt-2 text-sm text-rose-500">{errors.name.message}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input className="input" {...register("email", { required: "Email is required" })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="input"
              {...register("password", { required: "Password is required" })}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Role</label>
            <select className="input" {...register("role")}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Phone</label>
            <input className="input" {...register("phone")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Gender</label>
            <select className="input" {...register("gender")}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {role === "student" ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">Admission No</label>
                <input className="input" {...register("admissionNumber", { required: "Required" })} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Class</label>
                <input className="input" {...register("className", { required: "Required" })} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Section</label>
                <input className="input" {...register("section")} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Guardian Name</label>
                <input className="input" {...register("guardianName")} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Guardian Phone</label>
                <input className="input" {...register("guardianPhone")} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Employee ID</label>
                <input className="input" {...register("employeeId", { required: "Required" })} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Department</label>
                <input className="input" {...register("department", { required: "Required" })} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Qualification</label>
                <input className="input" {...register("qualification")} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Subjects</label>
                <input className="input" placeholder="Physics, Mathematics" {...register("subjects")} />
              </div>
            </div>
          </>
        )}

        <button disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Submitting..." : "Submit for approval"}
        </button>
      </form>
    </AuthShell>
  );
};
