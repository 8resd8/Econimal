export const API = {
  CHARACTERS: {
    // INFO: 'characters/users/', //굳이 사용하지 않아도 됨 => list로 해도 되는 부분이었음음
    LIST: 'characters/users',
    MAIN_CHAR: 'characters/users/main',
    FIRST_MAIN_CHAR: 'characters/users/initial/main',
    // FIRST_MAIN_CHAR: 'characters/users/initial/main',
  },
  CHECKLIST: {
    LIST: 'checklists',
    DONE: 'checklists/complete',
    CUSTOM: 'checklists/custom',
    CUSTOM_VALIDATE: '/checklists/custom/validate',
  },
  SHOP: {
    CHARLIST: 'product/characters',
    BACKLIST: 'product/backgrounds',
  },
};
