// Baked in by webpack DefinePlugin. The INH installer leaves this as "inh".
import inhLogo from '../_images/inh_logo.png';

export const TAQUILLA_PRODUCT = process.env.TAQUILLA_PRODUCT || 'inh';

export const isGbcGaming = () => TAQUILLA_PRODUCT === 'gbc';

export const GBC_HOME = '/nacional-elinmejorable';

export const GBC_APP = {
  appName: 'GBC Gaming',
  domains: [],
  logo: inhLogo,
  logoPrint: inhLogo,
};
