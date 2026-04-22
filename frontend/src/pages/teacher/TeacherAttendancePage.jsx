import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getTeacherStudents, submitAttendance } from "../../services/teacherService";

export const TeacherAttendancePage = () => {
  const { data, loading, execute } = useAsync(() => getTeacherStudents({ page: 1, limit: 50 }), []);
  const students = useMemo(() => data?.data || [], [data]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      className: "10",
      subject: "Physics",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (values) => {
    const records = students.map((student) => ({
      studentId: student.user._id,
      className: values.className,
      subject: values.subject,
      date: values.date,
      status: values[`status_${student.user._id}`] || "present",
      remarks: values[`remarks_${student.user._id}`] || "",
    }));

    await submitAttendance({ records });
    await execute();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher Panel"
        title="Mark attendance"
        description="Update date-wise and subject-wise attendance, with real-time delivery to students."
      />

      <form className="card space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Class</label>
            <input className="input" {...register("className")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Subject</label>
            <input className="input" {...register("subject")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Date</label>
            <input type="date" className="input" {...register("date")} />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading students...</p>
          ) : (
            students.map((student) => (
              <div key={student.user._id} className="grid gap-4 rounded-3xl border border-slate-200 p-4 md:grid-cols-[1.4fr_180px_1fr] dark:border-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{student.user.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {student.admissionNumber} • Class {student.className}-{student.section}
                  </p>
                </div>
                <select className="input" {...register(`status_${student.user._id}`)}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
                <input className="input" placeholder="Remarks" {...register(`remarks_${student.user._id}`)} />
              </div>
            ))
          )}
        </div>

        <button disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Saving..." : "Save attendance"}
        </button>
      </form>
    </div>
  );
};
