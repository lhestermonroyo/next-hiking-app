type Role = 'admin' | 'editor';

export const sortRole = (statusA: Role, statusB: Role) => {
  return ROLE_ORDER[statusA] - ROLE_ORDER[statusB];
};

const ROLE_ORDER = <Record<string, number>>{
  admin: 0,
  editor: 1
};
