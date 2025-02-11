import { FileType } from "@/lib/types";

export type Role =
  | { role: 3; name: "user" }
  | { role: 2; name: "admin" }
  | { role: 1; name: "super" }
  | { role: 4; name: "debugger" }
  | { role: 5; name: "ngo" }
  | { role: 6; name: "donor" };

export type StatusType =
  | { active: 1 }
  | { blocked: 2 }
  | { unregistered: 3 }
  | { not_logged_in: 4 }
  | { in_progress: 5 }
  | { register_form_submited: 6 };

export type Permission = {
  name: string;
};
export type UserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  permission: string;
  icon: string;
  priority: number;
};
export type SelectUserPermission = UserPermission & {
  allSelected: boolean;
};
export type Contact = {
  id: string;
  value: string;
  created_at: string;
};
export type Email = {
  id: string;
  value: string;
  created_at: string;
};
export type Status = {
  id: number;
  name: string;
  created_at: string;
};
export type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  status: Status;
  grant: boolean;
  profile: any;
  role: Role;
  contact: string;
  job: string;
  destination: string;
  permissions: Map<string, UserPermission>;
  created_at: string;
};

export type Notifications = {
  id: string;
  message: string;
  type: string;
  read_status: number;
  created_at: string;
};
export type Job = {
  id: string;
  name: string;
  createdAt: string;
};
export type Gender = {
  id: string;
  name: string;
};
export type NidType = {
  id: string;
  name: string;
};
// APPLICATION

export type DestinationType = {
  id: string;
  name: string;
  created_at: string;
};
export type Destination = {
  id: string;
  name: string;
  color: string;
  type: DestinationType;
  created_at: string;
};

export type Country = {
  id: string;
  name: string;
};
export type District = {
  id: string;
  name: string;
};
export type Province = {
  id: string;
  name: string;
};
export type Address = {
  id: string;
  country: Country;
  province: Province;
  district: District;
  area: string;
};

export type Audit = {
  id: string;
  user_id: string;
  user: string;
  action: string;
  table: string;
  table_id: string;
  old_values: any;
  new_values: any;
  url: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
};

///////////////////////////////App
export type NgoStatus = {
  id: string;
  ngo_id: string;
  status_type_id: string;
  is_active: string;
  name: string;
  comment: string;
  created_at: string;
};
export type NgoType = {
  id: string;
  name: string;
  created_at: string;
};
export type Donor = {
  id: string;
  profile: string;
  name: string;
  username: string;
  status: string;
  email: string;
  contact: string;
  is_editable: boolean;
  role: Role;
  permissions: Map<string, UserPermission>;
  created_at: string;
};

export type News = {
  id: string;
  title: string;
  contents: string;
  image: string;
  news_type: string;
  news_type_id: number;
  priority: string;
  priority_id: number;
  user: string;
  visible: boolean;
  visibility_date: string;
  date: string;
  created_at: string;
};

export type About = {
  id: string;
  name: string;
  contact: string;
  profile: any;
};

export type Ngo = {
  id: string;
  profile: string;
  name: string;
  username: string;
  abbr: string;
  status: NgoStatus;
  registration_no: string;
  type: NgoType;
  email: Email;
  contact: Contact;
  is_editable: boolean;
  role: Role;
  address: Address;
  permissions: Map<string, UserPermission>;
  created_at: string;
};
export type CheckList = {
  id: string;
  name: string;
  acceptable_extensions: string;
  acceptable_mimes: string;
  description: string;
};

export type Staff = {
  picture: string;
  name: string;
  contact: string;
  email: string;
  id: string;
};
export type Agreement = {
  id: string;
  start_date: string;
  end_date: string;
};
export interface AgreementDocument extends FileType {
  document_id: string;
  checklist_id: string;
  acceptable_extensions: string;
  acceptable_mimes: string;
  description: string;
}
