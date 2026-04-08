import { api } from "./api";

export interface WorkingHours {
  startDay: number;
  endDay: number;
  startAt: string;
  endAt: string;
}

export interface CompanyContact extends WorkingHours {
  address: string;
  phoneNumber: string;
  email: string;
}

export interface CompanyMap {
  latitude: number;
  longitude: number;
}

export interface CompanyInfo extends CompanyContact, CompanyMap {}

export interface UpdateCompanyInfoDto {
  latitude: number;
  longitude: number;
  address: string;
  phoneNumber: string;
  email: string;
  startDay: number;
  endDay: number;
  startAt: string;
  endAt: string;
}

export async function getContact(): Promise<CompanyInfo> {
  const res = await api<CompanyInfo>("/company-info/contact", {
    method: "GET",
  });

  return res;
}

export async function getMap(): Promise<CompanyMap> {
  const res = await api<CompanyMap>("/company-info/map", {
    method: "GET",
  });

  return res;
}

export async function getCompanyInfo(): Promise<CompanyInfo> {
  const [contact, map] = await Promise.all([getContact(), getMap()]);
  return { ...contact, ...map };
}

export async function updateCompanyInfo(
  dto: UpdateCompanyInfoDto,
): Promise<void> {
  await api<unknown>("/company-info/update", {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}
