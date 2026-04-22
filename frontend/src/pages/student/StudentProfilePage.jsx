import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader } from "../../components/common/Loader";
import { PageHeader } from "../../components/common/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadStudentAvatar,
} from "../../services/studentService";

export const StudentProfilePage = () => {
  const { data, loading, execute } = useAsync(getStudentProfile, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (data?.data) {
      const record = data.data;
      reset({
        name: record.name,
        phone: record.phone,
        gender: record.gender,
        guardianName: record.profile?.guardianName,
        guardianPhone: record.profile?.guardianPhone,
        address: record.profile?.address,
        bloodGroup: record.profile?.bloodGroup,
        dateOfBirth: record.profile?.dateOfBirth?.slice(0, 10),
      });
    }
  }, [data, reset]);

  const onSubmit = async (values) => {
    await updateStudentProfile({
      name: values.name,
      phone: values.phone,
      gender: values.gender,
      profile: {
        guardianName: values.guardianName,
        guardianPhone: values.guardianPhone,
        address: values.address,
        bloodGroup: values.bloodGroup,
        dateOfBirth: values.dateOfBirth,
      },
    });
    await execute();
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadStudentAvatar(file);
    await execute();
  };

  if (loading) return <Loader label="Loading profile..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Panel"
        title="Profile settings"
        description="Keep your contact details and guardian information up to date."
      />

      <form className="card grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="md:col-span-2 flex flex-col gap-4 rounded-3xl border border-dashed border-slate-300 p-5 dark:border-slate-700 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Profile photo</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload a JPG or PNG avatar for the student profile.
            </p>
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Full name</label>
          <input className="input" {...register("name")} />
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
        <div>
          <label className="mb-2 block text-sm font-medium">Blood group</label>
          <input className="input" {...register("bloodGroup")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Guardian name</label>
          <input className="input" {...register("guardianName")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Guardian phone</label>
          <input className="input" {...register("guardianPhone")} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Date of birth</label>
          <input type="date" className="input" {...register("dateOfBirth")} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Address</label>
          <textarea className="input min-h-28" {...register("address")} />
        </div>
        <div className="md:col-span-2">
          <button disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
};
