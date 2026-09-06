import { FormsFieldComplete } from "@/components/examples/forms/field-complete";
import { FormsFieldControls } from "@/components/examples/forms/field-controls";
import { FormsFieldDefault } from "@/components/examples/forms/field-default";
import { FormsFieldDisabled } from "@/components/examples/forms/field-disabled";
import { FormsFieldInvalid } from "@/components/examples/forms/field-invalid";
import { FormsFieldLoading } from "@/components/examples/forms/field-loading";

export default function FormsDemo() {
  return (
    <div className="@container grid gap-4 p-2 md:p-4 md:pt-1 @3xl:grid-cols-2 @5xl:grid-cols-3">
      <FormsFieldDefault />
      <FormsFieldInvalid />
      <FormsFieldDisabled />
      <FormsFieldControls />
      <FormsFieldLoading />
      <FormsFieldComplete />
    </div>
  );
}
