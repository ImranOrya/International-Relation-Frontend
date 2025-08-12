import {
  ActivityModel,
  AgreementDocument,
  Approval,
  Audit,
  CheckList,
  Country,
  District,
  Gender,
  News,
  NidType,
  ProjectsDTO,
  Province,
  SelectUserPermission,
  SubPermission,
  User,
} from "@/database/tables";
import { DateObject } from "react-multi-date-picker";

export interface IMenuItem {
  name: string;
  key: string;
}
export interface UserInformation {
  profile: any;
  imagePreviewUrl: any;
  full_name: string;
  username: string;
  password: string;
  email: string;
  status: boolean;
  grant: boolean;
  job: {
    id: string;
    name: string;
    selected: boolean;
  };
  role: {
    id: string;
    name: string;
    selected: boolean;
  };
  contact: string;
  destination: {
    id: string;
    name: string;
    selected: boolean;
  };
  permission: Map<string, SelectUserPermission>;
  allSelected: boolean;
  created_at: string;
}

export interface UserPassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
export interface UserPaginationData {
  data: User[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export interface Configuration {
  token?: string;
  type?: string;
  language?: string;
}
// Filter
export interface UserData {
  name: string;
  data: any;
}
export type Order = "desc" | "asc";
export type UserSort =
  | "created_at"
  | "username"
  | "destination"
  | "status"
  | "job";
export type UserSearch = "username" | "contact" | "email";
export interface UserFilter {
  sort: UserSort;
  order: Order;
  search: {
    column: UserSearch;
    value: string;
  };
  date: DateObject[];
}

export interface UserRecordCount {
  activeUserCount: number | null;
  inActiveUserCount: number | null;
  todayCount: number | null;
  userCount: number | null;
}
export interface AuditPaginationData {
  data: Audit[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
// Multiselector
export interface Option {
  name: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

export type IUserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  visible: boolean;
  permission: string;
  icon: string;
  priority: number;
  sub: SubPermission[];
  allSelected: boolean;
};
export type UserAction = "add" | "delete" | "edit" | "view" | "singleRow";

// Application
export type NgoSort = "id" | "name" | "type" | "contact" | "status";
export type NgoSearch =
  | "id"
  | "abbr"
  | "registration_no"
  | "name"
  | "type"
  | "contact";

export interface NgoPaginationData {
  data: NgoInformation[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type NewsSort =
  | "id"
  | "type"
  | "priority"
  | "visible"
  | "visibility_date"
  | "date";
export type NewsSearch = "title";
export interface NewsFilter {
  sort: NewsSort;
  order: Order;
  search: {
    column: NewsSearch;
    value: string;
  };
  date: DateObject[];
}
export interface NewsPaginationData {
  data: News[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type ApprovalSearch = "requester" | "id";
export interface ApprovalPaginationData {
  data: Approval[];
  last_page: number;
  per_page: number;
  current_page: number;
  total_items: number;
}
export type ActivitySearch = "user" | "type";

export interface ActivityFilter {
  order: Order;
  search: {
    column: ActivitySearch;
    value: string;
  };
  date: DateObject[];
}
export interface ActivityPaginationData {
  data: ActivityModel[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type NgoInformation = {
  id: string;
  profile: string | undefined;
  name: string;
  abbr: string;
  status_id: number;
  status: string;
  registration_no: string;
  type_id: string;
  type: string;
  email: string;
  contact: string;
  username: string;
  created_at: string;
};
export type ProjectHeaderType = {
  profile: string | undefined;
  name: string;
  status_id: number;
  status: string;
  registration_no: string;
  email: string;
  contact: string;
};
export type ProjectDetailType = {
  project_name_english: string;
  project_name_farsi: string;
  project_name_pashto: string;
  preamble_english: string;
  preamble_farsi: string;
  preamble_pashto: string;
  abbreviat_english: string;
  abbreviat_farsi: string;
  abbreviat_pashto: string;
  organization_sen_man_english: string;
  organization_sen_man_farsi: string;
  organization_sen_man_pashto: string;
  exper_in_health_english: string;
  exper_in_health_farsi: string;
  exper_in_health_pashto: string;
  project_intro_english: string;
  project_intro_farsi: string;
  project_intro_pashto: string;
  goals_english: string;
  goals_farsi: string;
  goals_pashto: string;
  objective_english: string;
  objective_farsi: string;
  objective_pashto: string;
  expected_outcome_english: string;
  expected_outcome_farsi: string;
  expected_outcome_pashto: string;
  expected_impact_english: string;
  expected_impact_farsi: string;
  expected_impact_pashto: string;
  main_activities_english: string;
  main_activities_farsi: string;
  main_activities_pashto: string;
  action_plan_english: string;
  action_plan_farsi: string;
  action_plan_pashto: string;
};
export type ProjectOrganizationStructureType = {
  pro_manager_name_english: string;
  pro_manager_name_farsi: string;
  pro_manager_name_pashto: string;
  pro_manager_contact: string;
  pro_manager_email: string;
  previous_manager: boolean;
  manager: { id: string; name: string } | undefined;
};
export type IStaff = {
  picture: string;
  name_english: string;
  name_farsi: string;
  name_pashto: string;
  contact: string;
  email: string;
  id: string;
};
export interface IStaffSingle {
  name_english: string;
  name_farsi: string;
  name_pashto: string;
  contact: string;
  email: string;
  id: string;
  picture: File | undefined | string;
  optional_lang: string;
  imageUrl: string;
  editable: boolean;
}

//add by Imran orya for Ngo list
//start
export type PublicNgo = {
  id: string;
  registration_no: string;
  name: string;
  type: string;
  status: string;
  status_id: number;
  abbr: string;
  establishment_date: string;
  director: string;
  province: string;
};
export interface NgoListFilter {
  sort: NgoSort;
  order: Order;
  search: {
    column: NgoSearch;
    value: string;
  };
}
export interface NgoListPaginationData {
  data: PublicNgo[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export interface BasicModel {
  id: string;
  name: string;
  created_at: string;
}
export interface FileType {
  id: string;
  path: string;
  name: string;
  extension: string;
  size: number;
}
export interface IDirector {
  id: string;
  is_active: number;
  name: string;
  surname: string;
  contact: string;
  email: string;
}
export interface INgoDirector {
  name_english: string;
  name_pashto: string;
  name_farsi: string;
  surname_english: string;
  surname_pashto: string;
  surname_farsi: string;
  contact: string;
  email: string;
  gender: Gender | undefined;
  moe_registration_no: string;
  nationality: Country | undefined;
  nid: string;
  identity_type: NidType | undefined;
  province: Province | undefined;
  district: District | undefined;
  establishment_date: DateObject | undefined;
  is_active: boolean;
  optional_lang: string;
}

export interface INgoRepresentor {
  repre_name_english: string;
  repre_name_farsi: string;
  repre_name_pashto: string;
  letter_of_intro: any;
  is_active: boolean;
  optional_lang: string;
  checklist: CheckList;
}
//end
export type ICheckList = {
  id: string;
  type: string;
  type_id: string;
  name: string;
  acceptable_extensions: string[];
  active: number;
  file_size: string;
  acceptable_mimes: string[];
  description: string;
  created_at: string;
};

export interface IApproval {
  id: string;
  requester_id: string;
  requester_name: string;
  request_date: string;
  start_date: string;
  end_date: string;
  request_comment: string;
  responder_id?: string;
  responder?: string;
  respond_date?: string;
  respond_comment?: string;
  notifier_type_id: number;
  notifier_type: string;
  approval_documents: AgreementDocument[];
  completed: number;
}

// donor
export type DonorInformation = {
  id: string;
  name: string;
  abbr: string;
  profile: string | undefined;
  username: string;
  email: string;
  contact: string;
  created_at: string;
};

export type EditDonorInformation = {
  id: string;
  profile: string | undefined;
  name_english: string | undefined;
  name_pashto: string;
  name_farsi: string;
  username: string;
  area_english: string;
  area_pashto: string;
  area_farsi: string;
  abbr: string;
  contact: string;
  email: string;
  province: Province;
  district: District;
  created_at: string;
  optional_lang: string;
};

export interface DonorPaginationData {
  data: DonorInformation[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type DonorSearch = "id" | "abbr" | "name" | "username" | "contact";
export type DonorSort = "id" | "name" | "contact" | "status";

export type ProjectSort =
  | "registration_no"
  | "project_name"
  | "donor"
  | "status"
  | "currency";
export type ProjectSearch =
  | "registration_no"
  | "project_name"
  | "donor"
  | "budget";

export interface ProjectPaginationData {
  data: ProjectsDTO[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
