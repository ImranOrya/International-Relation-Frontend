import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { useTranslation } from "react-i18next";

// Country data with min/max length
type CountryCode = {
  code: string; // ISO 3166-1 alpha-2
  label: string;
  dialCode: string;
  minLength: number;
  maxLength: number;
};

const countryCodes: CountryCode[] = [
  {
    code: "AF",
    label: "🇦🇫 Afghanistan",
    dialCode: "+93",
    minLength: 1,
    maxLength: 9,
  },
  {
    code: "US",
    label: "🇺🇸 United States",
    dialCode: "+1",
    minLength: 1,
    maxLength: 10,
  },
  {
    code: "IN",
    label: "🇮🇳 India",
    dialCode: "+91",
    minLength: 1,
    maxLength: 10,
  },
  { code: "GB", label: "🇬🇧 UK", dialCode: "+44", minLength: 1, maxLength: 11 },
  // Add more countries as needed
];

export default function PhoneInput() {
  const [country, setCountry] = useState<CountryCode>(countryCodes[0]);
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const validatePhone = (numericValue: string) => {
    // Afghanistan rule: no leading zero
    if (country.code === "AF" && numericValue.startsWith("0")) {
      setError("Phone number cannot start with 0 for Afghanistan");
      setIsValid(false);
      return;
    }
    if (numericValue.length > country.maxLength) {
      return;
    } else if (numericValue.length < country.maxLength) {
      setError(`Phone number must be ${country.maxLength} digits`);
      setIsValid(false);
      setPhone(numericValue);
      return;
    } else {
      setPhone(numericValue);
      setError(undefined);
      setIsValid(true);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, "");
    validatePhone(numericValue);
  };

  return (
    <div
      className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] grid-areas-[ 'select input' 'select valid' ] items-start space-x-2"
      style={{
        gridTemplateAreas: `"select input" "select valid"`,
        gridTemplateColumns: "auto 1fr",
        gridTemplateRows: "auto auto",
      }}
    >
      <Select
        value={country.code}
        onValueChange={(value) => {
          const selected = countryCodes.find((c) => c.code === value);
          if (selected) {
            setCountry(selected);
            setPhone("");
            setIsValid(null);
            setError(undefined);
          }
        }}
      >
        <SelectTrigger className="w-[150px] focus:ring-0 h-[50px] mt-2 bg-card">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.label} ({c.dialCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CustomInput
        size_="sm"
        name="full_name"
        value={phone}
        placeholder={t("phone_number")}
        type="text"
        errorMessage={error}
        onChange={(e) => handlePhoneChange(e.target.value)}
      />
      {isValid && !error && (
        <p
          className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-green-600"
          style={{ gridArea: "valid" }}
        >
          Valid number ✓
        </p>
      )}
    </div>
  );
}
