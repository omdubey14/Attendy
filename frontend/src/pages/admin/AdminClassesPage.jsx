import { useForm } from "react-hook-form";
import { PageHeader } from "../../components/common/PageHeader";
import { createClass } from "../../services/adminService";

export const AdminClassesPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      section: "A",
      capacity: 40,
      subjects: "Physics, Mathematics, English",
    },
  });

  const onSubmit = async (values) => {
    await createClass({
      name: values.name,
      section: values.section,
      capacity: Number(values.capacity),
      subjects: values.subjects.split(",").map((item) => item.trim()).filter(Boolean),
    });
    reset({ name: "", section: "A", capacity: 40, subjects: "Physics, Mathematics, English" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Manage classes"
        description="Create class structures and define subject offerings."
      />

      <form className="card grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-medium">Class Name</label>
          <input className="input" {...register("name")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Section</label>
          <input className="input" {...register("section")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Capacity</label>
          <input type="number" className="input" {...register("capacity")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Subjects</label>
          <input className="input" {...register("subjects")} />
        </div>
        <div className="md:col-span-2">
          <button disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Creating..." : "Create class"}
          </button>
        </div>
      </form>
    </div>
  );
};
