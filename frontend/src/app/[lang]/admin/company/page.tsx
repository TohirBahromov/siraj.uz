import CompanyInfoForm from "@/components/admin/CompanyInfoForm";

const page = () => {
  return (
    <CompanyInfoForm
      googleMapsApiKey={process.env.NEXT_PUBLIC_YMAPS_API_KEY!}
    />
  );
};

export default page;
