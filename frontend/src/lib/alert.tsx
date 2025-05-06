import { ProblemDetail } from "@/server/types/domain";
import { toast } from "sonner";

export function alert(error: ProblemDetail) {
  toast.error(
    <div className="">
      <h1 className="text-lg font-bold">{error.title}</h1>
      <p className="text-sm">{error.detail}</p>
    </div>
  );
}
