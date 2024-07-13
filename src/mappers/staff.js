const RoleMapper = {
  ADMIN: "Admin",
  STAFF: "Nhân viên phục vụ",
  BARTENDER: "Nhân viên pha chế",
};

const StatusMapper = {
  ACTIVE: "Hoạt động",
  BLOCKED: "Bị khóa",
  BLOCKED_BY_ADMIN: "Bị khóa bởi admin",
  INACTIVE: "Không hoạt động",
};

const StatusColorMapper = {
  ACTIVE: "green",
  BLOCKED: "red",
  BLOCKED_BY_ADMIN: "red",
  INACTIVE: "gold",
};

export { RoleMapper, StatusMapper, StatusColorMapper };
