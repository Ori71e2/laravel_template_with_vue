export interface UserDto {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  vip?: number;
  roles?: string;
  vipExpiretime?: number;
  isActive?: boolean;
  activeCode?: number;
  activeCodeExpiretime?: number;
}