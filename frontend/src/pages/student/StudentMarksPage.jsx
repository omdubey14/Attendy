import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getStudentMarks } from "../../services/studentService";

export const StudentMarksPage = () => {
  const { data, loading } = useAsync(getStudentMarks, []);
  if (loading) return <Loader label="Loading marks..." />;

  const marks = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Panel"
        title="Marks and results"
        description="See your exam-wise subject performance and grades."
      />

      {marks.length === 0 ? (
        <EmptyState title="No marks uploaded yet" description="Your teacher will publish scores here." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {marks.map((mark) => (
            <div key={mark._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{mark.subject}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{mark.examType}</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-600 dark:bg-sky-500/15 dark:text-sky-300">
                  {mark.grade}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {mark.score}/{mark.maximumScore}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{mark.remarks || "Well done"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
