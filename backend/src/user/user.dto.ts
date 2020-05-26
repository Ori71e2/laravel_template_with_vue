export interface UserDto {
  id?: number;
  name?: string;
  account?: string;
  password?: string;
  vip?: number;
  vipExpiretime?: number;
  isActive?: boolean;
  activeCode?: number;
  activeCodeExpiretime?: number;
}