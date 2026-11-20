// Baked in by webpack DefinePlugin. The INH installer leaves this as "inh".
export const TAQUILLA_PRODUCT = process.env.TAQUILLA_PRODUCT || 'inh';

export const isGbcGaming = () => TAQUILLA_PRODUCT === 'gbc';

export const GBC_HOME = '/nacional-elinmejorable';

export const GBC_APP = {
  appName: 'GBC Gaming',
  domains: [],
  logo: null,
  logoPrint: null,
};
