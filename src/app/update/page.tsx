import EditUrlForm from "@/components/EditUrlForm";
import { loginIsRequiredServer } from "@/server/auth";

export default async function Update() {
  await loginIsRequiredServer();
  return (
    <>
      <title>Edit short Url - Shrimpit</title>
      <EditUrlForm method="PUT" className="flex-col" />;
    </>
  );
}
