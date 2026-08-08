import * as migration_20260706_134851_initial from './20260706_134851_initial';
import * as migration_20260708_231706_lms_initial from './20260708_231706_lms_initial';
import * as migration_20260726_150000_portfolio_trust from './20260726_150000_portfolio_trust';
import * as migration_20260730_140000_edusuite_saas from './20260730_140000_edusuite_saas';
import * as migration_20260808_170000_show_demo_accounts from './20260808_170000_show_demo_accounts';

export const migrations = [
  {
    up: migration_20260706_134851_initial.up,
    down: migration_20260706_134851_initial.down,
    name: '20260706_134851_initial',
  },
  {
    up: migration_20260708_231706_lms_initial.up,
    down: migration_20260708_231706_lms_initial.down,
    name: '20260708_231706_lms_initial',
  },
  {
    up: migration_20260726_150000_portfolio_trust.up,
    down: migration_20260726_150000_portfolio_trust.down,
    name: '20260726_150000_portfolio_trust',
  },
  {
    up: migration_20260730_140000_edusuite_saas.up,
    down: migration_20260730_140000_edusuite_saas.down,
    name: '20260730_140000_edusuite_saas',
  },
  {
    up: migration_20260808_170000_show_demo_accounts.up,
    down: migration_20260808_170000_show_demo_accounts.down,
    name: '20260808_170000_show_demo_accounts',
  },
];
