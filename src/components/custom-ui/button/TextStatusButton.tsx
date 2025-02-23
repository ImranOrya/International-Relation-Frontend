export interface TextStatusButtonProps {
  id: number;
  value: string;
}

export default function TextStatusButton(props: TextStatusButtonProps) {
  const { id, value } = props;
  const style = id == 1 ? "border-blue-400" : "border-yellow-400";

  return (
    <div
      className={`border-[1px] min-w-fit rtl:text-xl-rtl rtl:font-medium w-fit flex items-center gap-x-2 ltr:py-1 rtl:py-[2px] px-[8px] rounded-full ${style}`}
    >
      <div
        className={`size-[12px] min-h-[12px] min-w-[12px] rounded-full border-[3px] ${style}`}
      />
      <h1 className="text-nowrap">{value}</h1>
    </div>
  );
}
