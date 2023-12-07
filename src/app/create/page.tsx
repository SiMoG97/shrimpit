import EditUrlForm from "@/components/EditUrlForm";
import { loginIsRequiredServer } from "@/server/auth";

export default async function Create() {
  await loginIsRequiredServer();
  return <EditUrlForm />;
}
