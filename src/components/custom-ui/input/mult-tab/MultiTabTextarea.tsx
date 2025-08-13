import React, { ReactElement } from "react";
import { ReactNode } from "react";
import SingleTab from "./parts/SingleTab";
import OptionalTab from "./parts/OptionalTab";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface MultiTabTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children:
    | ReactElement<typeof SingleTab | typeof OptionalTab>
    | ReactElement<typeof SingleTab | typeof OptionalTab>[];
  userData: any;
  errorData?: Map<string, string>;
  onTabChanged: (key: string, data: string) => void;
  onChanged: (value: string, name: string) => void;
  highlightColor: string;
  placeholder?: string;
  tabsClassName?: string;
  parentClassName?: string;
  title?: string;
  name: string;
  optionalKey: string;
}

const MultiTabTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MultiTabTextareaProps
>((props, ref: any) => {
  const {
    className,
    name,
    optionalKey,
    tabsClassName,
    parentClassName,
    children,
    userData,
    errorData,
    onTabChanged,
    onChanged,
    highlightColor,
    placeholder,
    disabled,
    title,
    ...rest
  } = props;
  const selectionName = `${name}_selections`;
  let selectedTab: string = userData[optionalKey];

  const tabChanged = (tabName: string) => {
    onTabChanged(selectionName, tabName);
  };
  const inputOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    onChanged(value, name);
  };
  const processTabs = (children: ReactNode) => {
    let selectedTabName = "";
    const errorMessages: string[] = [];
    const elements = React.Children.map(children, (child, mainIndex) => {
      if (React.isValidElement(child)) {
        const levelOneChildren = child.props.children;
        if (child.type === SingleTab) {
          // Rename for distinct data store e.g. username_english,
          const selectItemText = generateUniqueName(name, levelOneChildren);
          if (mainIndex === 0 && !selectedTab) {
            selectedTab = levelOneChildren;
          }
          const comp: ReactElement = child;
          let classNameOne = child.props.className;
          let newColor = "";
          const err = errorData?.get(selectItemText);
          if (err) {
            errorMessages.push(err);
            newColor += " bg-red-500 ";
          } else {
            newColor =
              selectedTab === levelOneChildren
                ? ` ${highlightColor}`
                : mainIndex === 0 && !selectedTab
                ? ` ${highlightColor}`
                : "";
          }

          if (classNameOne) {
            classNameOne += newColor;
          } else {
            classNameOne = newColor;
          }

          return React.cloneElement(comp, {
            className: `${classNameOne} ${disabled && " cursor-not-allowed"}`,
            onClick: () => {
              if (!disabled) tabChanged(levelOneChildren);
            }, // Pass the tab value (children)
          });
        } else if (child.type === OptionalTab) {
          if (Array.isArray(levelOneChildren)) {
            if (mainIndex == 0 && !selectedTab) {
              selectedTab = levelOneChildren[0].props.children;
            }
            return (
              <div className="flex gap-1">
                {React.Children.map(levelOneChildren, (childInner, index) => {
                  const levelTwoChildren = childInner.props.children;
                  let classNameOne = childInner.props.className;
                  let newColor = "";
                  const err = errorData?.get(selectedTabName);

                  if (err) {
                    errorMessages.push(err);
                    newColor += " bg-red-500 ";
                  } else {
                    newColor =
                      selectedTab === levelTwoChildren
                        ? ` ${highlightColor}`
                        : mainIndex === 0 && !selectedTab
                        ? ` ${highlightColor}`
                        : "";
                  }
                  if (classNameOne) {
                    classNameOne += newColor;
                  } else {
                    classNameOne = newColor;
                  }
                  return (
                    <>
                      {React.cloneElement(childInner, {
                        className: classNameOne,
                        onClick: () => {
                          if (!disabled) tabChanged(levelTwoChildren);
                        }, // Pass the tab value (children)
                      })}
                      {index % 2 == 0 && (
                        <div className="font-semibold text-[18px] text-primary/80">
                          │
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            );
          }
        }
      }
    });
    selectedTabName = generateUniqueName(name, selectedTab);
    const selectTabValue = userData[selectedTabName];
    return { elements, selectTabValue, selectedTabName, errorMessages };
  };
  const { elements, selectTabValue, selectedTabName, errorMessages } =
    processTabs(children);
  return (
    <div className={cn(`flex flex-col select-none`, parentClassName)}>
      {/* Title */}
      <h1 className="ltr:text-2xl-ltr rtl:text-xl-rtl text-start">{title}</h1>
      {/* Header */}
      <div className={cn("flex gap-x-4", tabsClassName)}>{elements}</div>
      {/* Body */}
      <Textarea
        {...rest}
        disabled={disabled}
        className={cn(
          `mt-2 focus-visible:ring-0 bg-card dark:bg-card-secondary focus-visible:border-primary/30 focus-visible:ring-offset-0 ${
            errorMessages.length > 0 && "border-red-400 !border-b"
          }`,
          className
        )}
        ref={ref}
        name={selectedTabName}
        key={selectedTab}
        placeholder={placeholder}
        onChange={inputOnchange}
        value={selectTabValue || ""}
      />
      {errorMessages.map((error: string, index: number) => (
        <h1
          key={index}
          className="rtl:text-md-rtl ltr:text-sm-ltr px-2 capitalize text-start text-red-400"
        >
          {error}
        </h1>
      ))}
    </div>
  );
});

export default MultiTabTextarea;

const generateUniqueName = (name: string, transName: string) =>
  `${name}_${transName}`;
