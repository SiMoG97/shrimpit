import EditUrlForm from "@/components/EditUrlForm";
import { loginIsRequiredServer } from "@/server/auth";

export default async function Update() {
  await loginIsRequiredServer();
  return <EditUrlForm method="PUT" />;
}
