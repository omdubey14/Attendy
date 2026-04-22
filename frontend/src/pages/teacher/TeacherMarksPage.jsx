import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getTeacherStudents, submitMarks } from "../../services/teacherService";

export const TeacherMarksPage = () => {
  const { data } = useAsync(() => getTeacherStudents({ page: 1, limit: 50 }), []);
  const students = useMemo(() => data?.data || [], [data]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      examType: "Mid Term",
      subject: "Physics",
      maximumScore: 100,
    },
  });

  const onSubmit = async (values) => {
    await submitMarks(values);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher Panel"
        title="Upload marks"
        description="Publish results subject-wise and send an instant notification to the student."
      />

      <form className="card grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-medium">Student</label>
          <select className="input" {...register("studentId")}>
            {students.map((student) => (
              <option key={student.user._id} value={student.user._id}>
                {student.user.name} ({student.admissionNumber})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Subject</label>
          <input className="input" {...register("subject")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Exam Type</label>
          <input className="input" {...register("examType")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Score</label>
          <input type="number" className="input" {...register("score")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Maximum Score</label>
          <input type="number" className="input" {...register("maximumScore")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Remarks</label>
          <input className="input" {...register("remarks")} />
        </div>
        <div className="md:col-span-2">
          <button disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Uploading..." : "Upload marks"}
          </button>
        </div>
      </form>
    </div>
  );
};
