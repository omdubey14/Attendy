import { useForm } from "react-hook-form";
import { PageHeader } from "../../components/common/PageHeader";
import { sendAnnouncement } from "../../services/teacherService";

export const TeacherAnnouncementsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      audience: "students",
    },
  });

  const onSubmit = async (values) => {
    await sendAnnouncement(values);
    reset({ audience: "students", title: "", message: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher Panel"
        title="Send announcements"
        description="Broadcast reminders and updates to students or the whole faculty."
      />

      <form className="card space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input className="input" {...register("title")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Audience</label>
            <select className="input" {...register("audience")}>
              <option value="students">Students</option>
              <option value="teachers">Teachers</option>
              <option value="all">Everyone</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Message</label>
          <textarea className="input min-h-32" {...register("message")} />
        </div>
        <button disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Sending..." : "Send announcement"}
        </button>
      </form>
    </div>
  );
};
