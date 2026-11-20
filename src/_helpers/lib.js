import { history } from '../_helpers/history';
import queryString from 'query-string';
import empty from "is-empty";
// Logo imports removed — TaquillaFisica2026 ships without branding

import inh_logo from '../_images/inh_logo.png';
import { GBC_APP, isGbcGaming } from './product';

export const wagerTypeDescription = {
  WIN: "PRI",
  PLACE: "SEG",
  SHOW: "TER",
  EXACTA: "EX",
  TRIFECTA: "TRI",
  SUPERFECTA: "SUPER",
  "EXACTA BOX": "EX BOX",
  "TRIFECTA BOX": "TRI BOX",
  "SUPERFECTA BOX": "SUPER BOX",
  "DAILY DOUBLE": "DD",
  "PLACE/SHOW": "PS",
  "WIN/PLACE": "WP",
  "WIN/SHOW": "WS",
  "WIN/PLACE/SHOW": "WPS"
};

export const wagerTypeDescriptionINH = {
  WIN: "GANADOR",
  PLACE: "PLACE",
  EXACTA: "EXACTA",
  TRIFECTA: "TRIFECTA",
  SUPERFECTA: "SUPERFECTA",
  "EXACTA BOX": "EX BOX",
  "TRIFECTA BOX": "TRI BOX",
  "SUPERFECTA BOX": "SUPER BOX",
  "DAILY DOUBLE": "DD",
  "PLACE/SHOW": "PS",
  "WIN/PLACE": "WP",
  "WIN/SHOW": "WS",
  "WIN/PLACE/SHOW": "WPS"
};

const APPS = [
  GBC_APP,
  {
    appName: 'TAQUILLA FÍSICA',
    domains: ['', 'localhost'],
    logo: null,
    logoPrint: null
  },
  {
    appName: 'TAQUILLA FÍSICA',
    domains: ['', '', '', '', '', '', '', '127.0.0.1'],
    logo: inh_logo,
    logoPrint: inh_logo
  },
  {
    appName: 'TAQUILLA FÍSICA',
    domains: [],
    logo: null,
    logoPrint: null
  },
  {
    appName: 'TAQUILLA FÍSICA',
    domains: [],
    logo: null,
    logoPrint: null
  },
  {
    appName: 'TAQUILLA FÍSICA',
    domains: [],
    logo: null,
    logoPrint: null
  },
  {
    appName: 'TAQUILLA FÍSICA',
    domains: [],
    logo: null,
    logoPrint: null
  }
]

import { getDynamicConfig } from './dynamicConfig';

export const getAppConfig = () => {
  if (isGbcGaming()) {
    return GBC_APP;
  }

  let { hostname } = getDynamicConfig();
  let app = APPS.find((a) => a !== GBC_APP && RegExp(a.domains.join('|')).test(hostname));

  if (empty(app)) {
    app = APPS.find((a) => a !== GBC_APP);
  }

  return app;
}

export const isOnly5y6 = (ticketOfficeId) => {
  let arrayOfficesInmejorable = [1];
  return arrayOfficesInmejorable.includes(ticketOfficeId);
}

export const isOnlyCentersCock = (centerId) => {
  let arrayCentersInmejorable = [53];
  return arrayCentersInmejorable.includes(centerId);
}

export const isOnlyPollaElArca = (centerId) => {
  let arrayOfficesPollaElArca = [170];
  return arrayOfficesPollaElArca.includes(centerId);
}

export const redirectByCentersTicketOfficesId = (centers_id, ticket_offices_id, currency_code) => {
  if (isOnlyCentersCock(centers_id) && currency_code == 'USD') {
    history.push('/cocks');
  }
  // TAQUILLAS SOLO 5 y 6
  if (isOnly5y6(ticket_offices_id)) {
    history.push('/5y6');
  }

  if (centers_id === 177
    && currency_code == 'VES') {
    history.push('/nacional-elinmejorable');
  }

  // TAQUILLAS NACIONALES
  if (!isOnlyPollaElArca(centers_id)
    && currency_code == 'VES') {
    history.push('/nacional');
  }



  if (isOnlyPollaElArca(centers_id)) {
    history.push('/lotteries-cocks');
  }

}

export const isSaleNacionalDolares = (ticketOfficeId) => {
  let arrayOfficesInmejorable = [6485,
    6487,
    6491,
    6492,
    6494,
    6496,
    6498,
    6500,
    6502,
    6504,
    6506,
    6508,
    6513,
    6515,
    6517,
    6519,
    6521,
    6523,
    6525,
    6527,
    6529,
    6531,
    6533];
  return arrayOfficesInmejorable.includes(ticketOfficeId);
}

export const isSaleNacionalElInmejorable = (ticketOfficeId) => {
  let arrayOfficesInmejorable = [6485,
    6487,
    6491,
    6492,
    6494,
    6496,
    6498,
    6500,
    6502,
    6504,
    6506,
    6508,
    6513,
    6515,
    6517,
    6519,
    6521,
    6523,
    6525,
    6527,
    6528,
    6529,
    6531,
    6533,
    6564,
    6565,
    6566,
    6567,
    6568,
    6569,
    6570,
    6571,
    6572,
    6573,
    6707,
    6708,
    6709,
    6710,
    6711,
    6712,
    6713,
    6714,
    6715,
    6716,
    6717,
    6718,
    6719,
    6720,
    6721,
    6722,
    6723,
    6724,
    6725,
    6726,
    6727,
    6728,
    6729,
    6730,
    6731,
    6732,
    6733,
    6734,
    6735,
    6736,
    6737,
    6738,
    6739,
    6740,
    6741,
    6742,
    6743,
    6744,
    6745,
    6746,
    6747,
    6748,
    6749,
    6750,
    6751,
    6752,
    6753,
    6754,
    6755,
    6756,
    6757,
    6758,
    6759,
    6760,
    6761,
    6762,
    6763,
    6764,
    6765,
    6766,
    6767,
    6768,
    6769,
    6770,
    6771,
    6772,
    6773,
    6774,
    6775,
    6776];
  return arrayOfficesInmejorable.includes(ticketOfficeId);
}

export const isSaleSports = (ticketOfficeId) => {
  let arrayOfficesInmejorable = [903, 1617];
  return arrayOfficesInmejorable.includes(ticketOfficeId);
}

export const calculateTicketValue = (sellform, valueUnits) => {
  //Create clone from Array
  const selectedHorsesAux = [...sellform.horsesRacesId];
  let ticketInfo = getTicketInfo({
    wagerTypeId: sellform.wagerTypeId,
    selectedHorses: selectedHorsesAux,
    units: !empty(sellform.units) ? sellform.units : 0,
    valueUnits: valueUnits,
  });

  return {
    ticketValue: ticketInfo.ticketValue,
    ticketCombinations: ticketInfo.ticketCombinations,
  };
};


export function buildSecureGetParams(params) {
  try {
    const result = queryString.stringify(params);
    return btoa(result);
  } catch (error) {
    console.error("Error: buildSecureGetParams :: ", error);
    return '';
  }

}

export function parseUrlParams(params, search) {
  const urlParams = queryString.parse(search);
  if (!empty(urlParams)) {
    params = { ...params, ...urlParams };
  }
  return params;
}

const calculateCombinationsFactor1 = selectedPos1 => {
  let combinations = [];
  for (let keypos in selectedPos1) {
    combinations[selectedPos1[keypos].horsesRacesId] =
      selectedPos1[keypos].horsesRacesId;
  }
  return combinations;
};

const calculateCombinationsFactor2 = (selectedPos1, selectedPos2) => {
  let combinations = [];
  let combinationKey = "";
  for (let keypos in selectedPos1) {
    let idPos1 = selectedPos1[keypos].horsesRacesId;
    for (let keypos2 in selectedPos2) {
      let idPos2 = selectedPos2[keypos2].horsesRacesId;
      if (idPos1 != idPos2) {
        combinationKey = idPos1 + "-" + idPos2;
        combinations[combinationKey] = combinationKey;
      }
    }
  }
  return combinations;
};

const calculateCombinationsFactor3 = (
  selectedPos1,
  selectedPos2,
  selectedPos3
) => {
  let combinations = [];
  let combinationKey = "";
  for (let keypos in selectedPos1) {
    let idPos1 = selectedPos1[keypos].horsesRacesId;
    for (let keypos2 in selectedPos2) {
      let idPos2 = selectedPos2[keypos2].horsesRacesId;

      for (let keypos3 in selectedPos3) {
        let idPos3 = selectedPos3[keypos3].horsesRacesId;

        if (idPos1 != idPos2 && idPos1 != idPos3 && idPos2 != idPos3) {
          combinationKey = idPos1 + "-" + idPos2 + "-" + idPos3;
          combinations[combinationKey] = combinationKey;
        }
      }
    }
  }
  return combinations;
};

const calculateCombinationsFactor4 = (
  selectedPos1,
  selectedPos2,
  selectedPos3,
  selectedPos4
) => {
  let combinations = [];
  let combinationKey = "";
  for (let keypos in selectedPos1) {
    let idPos1 = selectedPos1[keypos].horsesRacesId;
    for (let keypos2 in selectedPos2) {
      let idPos2 = selectedPos2[keypos2].horsesRacesId;

      for (let keypos3 in selectedPos3) {
        let idPos3 = selectedPos3[keypos3].horsesRacesId;

        for (let keypos4 in selectedPos4) {
          let idPos4 = selectedPos4[keypos4].horsesRacesId;

          if (
            idPos1 != idPos2 &&
            idPos1 != idPos3 &&
            idPos1 != idPos4 &&
            idPos2 != idPos3 &&
            idPos2 != idPos4 &&
            idPos3 != idPos4
          ) {
            combinationKey =
              idPos1 + "-" + idPos2 + "-" + idPos3 + "-" + idPos4;
            combinations[combinationKey] = combinationKey;
          }
        }
      }
    }
  }
  return combinations;
};

export const getTicketInfoPicks = ({
  wagerTypeId,
  selectedHorses,
  units,
  valueUnits
} = {}) => {
  let ticketValue = 0;
  let combinations = 0;
  let result = {
    ticketCombinations: 0,
    ticketValue: 0
  };

  //DAILY DOUBLE
  if (wagerTypeId == 10) {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2])) {
      ticketValue =
        units *
        (valueUnits *
          (Object.keys(selectedHorses[1]).length *
            Object.keys(selectedHorses[2]).length));
      combinations =
        Object.keys(selectedHorses[1]).length *
        Object.keys(selectedHorses[2]).length;
    }
  }

  //PICKS 3
  if (wagerTypeId == 11) {
    if (
      !empty(selectedHorses[1]) &&
      !empty(selectedHorses[2]) &&
      !empty(selectedHorses[3])
    ) {
      ticketValue =
        units *
        (valueUnits *
          (Object.keys(selectedHorses[1]).length *
            Object.keys(selectedHorses[2]).length *
            Object.keys(selectedHorses[3]).length));
      combinations =
        Object.keys(selectedHorses[1]).length *
        Object.keys(selectedHorses[2]).length *
        Object.keys(selectedHorses[3]).length;
    }
  }

  //PICKS 4
  if (wagerTypeId == 12) {
    if (
      !empty(selectedHorses[1]) &&
      !empty(selectedHorses[2]) &&
      !empty(selectedHorses[3]) &&
      !empty(selectedHorses[4])
    ) {
      ticketValue =
        units *
        (valueUnits *
          (Object.keys(selectedHorses[1]).length *
            Object.keys(selectedHorses[2]).length *
            Object.keys(selectedHorses[3]).length *
            Object.keys(selectedHorses[4]).length));
      combinations =
        Object.keys(selectedHorses[1]).length *
        Object.keys(selectedHorses[2]).length *
        Object.keys(selectedHorses[3]).length *
        Object.keys(selectedHorses[4]).length;
    }
  }

  //PICKS 5
  if (wagerTypeId == 13) {
    if (
      !empty(selectedHorses[1]) &&
      !empty(selectedHorses[2]) &&
      !empty(selectedHorses[3]) &&
      !empty(selectedHorses[4]) &&
      !empty(selectedHorses[5])
    ) {
      ticketValue =
        units *
        (valueUnits *
          (Object.keys(selectedHorses[1]).length *
            Object.keys(selectedHorses[2]).length *
            Object.keys(selectedHorses[3]).length *
            Object.keys(selectedHorses[4]).length *
            Object.keys(selectedHorses[5]).length));
      combinations =
        Object.keys(selectedHorses[1]).length *
        Object.keys(selectedHorses[2]).length *
        Object.keys(selectedHorses[3]).length *
        Object.keys(selectedHorses[4]).length *
        Object.keys(selectedHorses[5]).length;
    }
  }

  //PICKS 6
  if (wagerTypeId == 14) {
    //console.log('Picks 6',selectedHorses);
    if (
      !empty(selectedHorses[1]) &&
      !empty(selectedHorses[2]) &&
      !empty(selectedHorses[3]) &&
      !empty(selectedHorses[4]) &&
      !empty(selectedHorses[5]) &&
      !empty(selectedHorses[6])
    ) {
      ticketValue =
        units *
        (valueUnits *
          (Object.keys(selectedHorses[1]).length *
            Object.keys(selectedHorses[2]).length *
            Object.keys(selectedHorses[3]).length *
            Object.keys(selectedHorses[4]).length *
            Object.keys(selectedHorses[5]).length *
            Object.keys(selectedHorses[6]).length));
      combinations =
        Object.keys(selectedHorses[1]).length *
        Object.keys(selectedHorses[2]).length *
        Object.keys(selectedHorses[3]).length *
        Object.keys(selectedHorses[4]).length *
        Object.keys(selectedHorses[5]).length *
        Object.keys(selectedHorses[6].length);
    }
  }

  if (wagerTypeId == 27) {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4]) && !empty(selectedHorses[5]) && !empty(selectedHorses[6])) {
      ticketValue = units * (valueUnits * (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length));
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length);
    }
  }

  result.ticketValue = ticketValue;
  result.ticketCombinations = combinations;

  return result;
};

export const getTicketInfoCock = ({ trackId, selectedHorses, units, valueUnits } = {}) => {
  let ticketValue = 0;
  let combinations = 0;
  let result = {
    ticketCombinations: 0,
    ticketValue: 0
  }

  if (trackId === '9102') {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4]) && !empty(selectedHorses[5]) && !empty(selectedHorses[6]) && !empty(selectedHorses[7]) && !empty(selectedHorses[8])) {
      ticketValue = units * (valueUnits * (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length * Object.keys(selectedHorses[7]).length * Object.keys(selectedHorses[8]).length));
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length * Object.keys(selectedHorses[7]).length * Object.keys(selectedHorses[8]).length);
    }
  } else {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4]) && !empty(selectedHorses[5]) && !empty(selectedHorses[6])) {
      ticketValue = units * (valueUnits * (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length));
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length);
    }
  }

  result.ticketValue = ticketValue;
  result.ticketCombinations = combinations;

  return result;
}

export const getTicketInfoPicksINH = ({ wagerTypeId, selectedHorses, units, valueUnits } = {}) => {
  let ticketValue = 0;
  let combinations = 0;
  let result = {
    ticketCombinations: 0,
    ticketValue: 0
  }

  //DOBLE PERFECTA

  if (wagerTypeId == 10) {

    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4])) {
      let calculateCombinations = calculateCombinationsFactor4(selectedHorses[1], selectedHorses[2], selectedHorses[3], selectedHorses[4]);
      combinations = Object.keys(calculateCombinations).length;
      ticketValue = units * (valueUnits * Object.keys(calculateCombinations).length);
    }
  }

  //PICKS 3
  if (wagerTypeId == 11) {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3])) {
      ticketValue = units * (valueUnits * (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length));
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length);
    }
  }

  //PICKS 4
  if (wagerTypeId == 12) {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4])) {
      ticketValue = units * (valueUnits * (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length));
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length);
    }
  }

  //PICKS 5
  if (wagerTypeId == 13) {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4]) && !empty(selectedHorses[5])) {
      ticketValue = units * (valueUnits * (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length));
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length);
    }
  }

  //PICKS 6
  if (wagerTypeId == 14) {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4]) && !empty(selectedHorses[5]) && !empty(selectedHorses[6])) {
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length);
      ticketValue = units * (valueUnits * combinations);

    }
  }

  if (wagerTypeId == 29) {
    if (!empty(selectedHorses[1]) && !empty(selectedHorses[2]) && !empty(selectedHorses[3]) && !empty(selectedHorses[4]) && !empty(selectedHorses[5]) && !empty(selectedHorses[6]) && !empty(selectedHorses[7])) {
      combinations = (Object.keys(selectedHorses[1]).length * Object.keys(selectedHorses[2]).length * Object.keys(selectedHorses[3]).length * Object.keys(selectedHorses[4]).length * Object.keys(selectedHorses[5]).length * Object.keys(selectedHorses[6]).length * Object.keys(selectedHorses[7]).length);
      ticketValue = units * (valueUnits * combinations);

    }
  }

  result.ticketValue = ticketValue;
  result.ticketCombinations = combinations;

  return result;
}

export const getTicketInfo = ({
  wagerTypeId,
  selectedHorses,
  units,
  valueUnits
} = {}) => {
  //console.log("getTicketInfo :: ",wagerTypeId, selectedHorses, units, valueUnits)
  if (empty(selectedHorses)) {
    selectedHorses = [];
  }

  let result = {
    ticketCombinations: 0,
    ticketValue: 0
  };
  let ticketValue = 0;
  let factor = 1;
  let selections = [];
  let combinations = 0;
  let multiplier = 1;

  // WIN / PLACE / SHOW
  if (wagerTypeId == 1 || wagerTypeId == 2 || wagerTypeId == 3) {
    factor = 1;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
    }
  }

  // PLACE-SHOW / WIN - PLACE / WIN - SHOW
  if (wagerTypeId == 17 || wagerTypeId == 18 || wagerTypeId == 20) {
    factor = 1;
    multiplier = 2;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
    }
  }

  // WIN - PLACE - SHOW
  if (wagerTypeId == 19) {
    factor = 1;
    multiplier = 3;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
    }
  }

  // EXACTA
  if (wagerTypeId == 4) {
    factor = 2;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
    }
    if (!empty(selectedHorses[2])) {
      selections[1] = Object.keys(selectedHorses[2]).length;
    }
  }

  // EXACTABOX
  if (wagerTypeId == 7) {
    factor = 2;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
      selections[1] = Object.keys(selectedHorses[1]).length;
      selectedHorses[2] = selectedHorses[1];
    }
  }

  // TRIFECTA
  if (wagerTypeId == 5) {
    factor = 3;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
    }

    if (!empty(selectedHorses[2])) {
      selections[1] = Object.keys(selectedHorses[2]).length;
    }

    if (!empty(selectedHorses[3])) {
      selections[2] = Object.keys(selectedHorses[3]).length;
    }
  }

  // TRIFECTABOX
  if (wagerTypeId == 9) {
    factor = 3;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
      selections[1] = Object.keys(selectedHorses[1]).length;
      selections[2] = Object.keys(selectedHorses[1]).length;
      selectedHorses[2] = selectedHorses[1];
      selectedHorses[3] = selectedHorses[1];
    }
  }

  // SUPERFECTA
  if (wagerTypeId == 6) {
    factor = 4;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
    }

    if (!empty(selectedHorses[2])) {
      selections[1] = Object.keys(selectedHorses[2]).length;
    }

    if (!empty(selectedHorses[3])) {
      selections[2] = Object.keys(selectedHorses[3]).length;
    }

    if (!empty(selectedHorses[4])) {
      selections[3] = Object.keys(selectedHorses[4]).length;
    }
  }

  // SUPERFECTABOX
  if (wagerTypeId == 15) {
    factor = 4;
    if (!empty(selectedHorses[1])) {
      selections[0] = Object.keys(selectedHorses[1]).length;
      selections[1] = Object.keys(selectedHorses[1]).length;
      selections[2] = Object.keys(selectedHorses[1]).length;
      selections[3] = Object.keys(selectedHorses[1]).length;
      selectedHorses[2] = selectedHorses[1];
      selectedHorses[3] = selectedHorses[1];
      selectedHorses[4] = selectedHorses[1];
    }
  }

  if (factor == 1) {
    combinations = calculateCombinationsFactor1(selectedHorses[1]);
  }

  if (factor == 2) {
    combinations = calculateCombinationsFactor2(
      selectedHorses[1],
      selectedHorses[2]
    );
  }

  if (factor == 3) {
    combinations = calculateCombinationsFactor3(
      selectedHorses[1],
      selectedHorses[2],
      selectedHorses[3]
    );
  }

  if (factor == 4) {
    combinations = calculateCombinationsFactor4(
      selectedHorses[1],
      selectedHorses[2],
      selectedHorses[3],
      selectedHorses[4]
    );
  }

  //console.log("getTicketValue :: select :: combinations", combinations)
  //console.log("getTicketValue :: select :: combinations count", Object.keys(combinations).length)
  //console.log("getTicketValue :: select :: units", units)
  //console.log("getTicketValue :: select :: valueUnits", valueUnits)
  //console.log("getTicketValue :: select :: wagerTypeId", wagerTypeId)
  //console.log("getTicketValue :: select :: factor", factor)
  //console.log("getTicketValue :: select :: selections", selections)
  //console.log("getTicketValue :: select :: multiplier",multiplier)

  if (selections.length > 0) {
    ticketValue =
      units * (valueUnits * Object.keys(combinations).length * multiplier);
  }

  result.ticketValue = ticketValue;
  result.ticketCombinations = Object.keys(combinations).length * multiplier;

  return result;
};

export function programNumberDescription(ticketsDetails) {
  let x = 0;
  let programNumber = "";
  let place2,
    place1 = 0;
  let symbol = "";
  ticketsDetails.forEach(element => {
    if (x == 1) {
      place2 = element.place;
      if (place2 == place1) {
        symbol = "+";
      } else {
        symbol = " / ";
      }
      programNumber += symbol + element.horsesRaceByHorsesRacesId.programNumber;
      place1 = element.place;
    } else {
      programNumber += element.horsesRaceByHorsesRacesId.programNumber;
      place1 = element.place;
    }
    x = 1;
  });
  return programNumber;
}

export function programNumberDescriptionINH(ticketsDetails, wagerTypeId) {
  let programNumber = [];
  if (wagerTypeId == 14) {
    let c1 = [];
    let c2 = [];
    let c3 = [];
    let c4 = [];
    let c5 = [];
    let c6 = [];
    ticketsDetails.forEach(element => {
      if (element.place == 1) {
        c1.push(element.horsesRaceByHorseRaceId.programNumber);
      }
      if (element.place == 2) {
        c2.push(element.horsesRaceByHorseRaceId.programNumber);
      }
      if (element.place == 3) {
        c3.push(element.horsesRaceByHorseRaceId.programNumber);
      }
      if (element.place == 4) {
        c4.push(element.horsesRaceByHorseRaceId.programNumber);
      }
      if (element.place == 5) {
        c5.push(element.horsesRaceByHorseRaceId.programNumber);
      }
      if (element.place == 6) {
        c6.push(element.horsesRaceByHorseRaceId.programNumber);
      }
    });
    programNumber.push(<>V1:{c1.toString()}<br />
      V2:{c2.toString()}<br />
      V3:{c3.toString()}<br />
      V4:{c4.toString()}<br />
      V5:{c5.toString()}<br />
      V6:{c6.toString()}<br /></>
    );
  }

  return programNumber;
}

export function horsesNames(horsesaces, wager_type_id) {
  let horses_name = [];
  let raceArray = [];
  let raceText = [];
  if (wager_type_id == 22 || wager_type_id == 26 || wager_type_id == 25) {
    if (horsesaces.length == 2) {
      horses_name.push(<><strong> Mi selección:{horsesaces[0].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[0].horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </strong> Vs. Marca de la Casa: {horsesaces[1].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[1].horsesRaceByHorsesRacesId.horseByHorsesId.horseName}</>);
    } else {
      for (let l = 0; l < horsesaces.length; l++) {
        horses_name.push(<> {horsesaces[l].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[l].horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </>);
      }
    }
  } else {
    for (let race of horsesaces) {
      if (!empty(raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber])) {
        raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber].push(<span>{race.horsesRaceByHorsesRacesId.programNumber} - {race.horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </span>);
      } else {
        raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber] = [];
        raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber].push(<><span>{race.horsesRaceByHorsesRacesId.programNumber} - {race.horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </span></>);
      }

    }

    for (let raceNumber in raceArray) {
      let horses = raceArray[raceNumber];
      horses_name.push(<>Carrera: {raceNumber}) <b>{horses}</b> </>);
    }

  }
  return horses_name;
}

export function labelCountWager(wagerType) {
  if (
    wagerType == "PLACE/SHOW" ||
    wagerType == "WIN/PLACE" ||
    wagerType == "WIN/SHOW"
  ) {
    return "2 APTAS";
  } else if (wagerType == "WIN/PLACE/SHOW") {
    return "3 APTAS";
  } else {
    return "1 APTA";
  }
}


export function formatNumber(currency, num) {
  num = parseFloat(num);
  return currency + ' ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}


export function orderUnderAndOver(oddsInput) {
  let resultOrdered = [];
  let oddsUnder = oddsInput.filter((odd) => odd.marketType === 'Under');
  let oddsOver = oddsInput.filter((odd) => odd.marketType === 'Over');
  oddsUnder = oddsUnder.sort((a, b) => a.factorExtra.split(' ')[0] - b.factorExtra.split(' ')[0]);

  oddsUnder.map((oddUnder) => {
    const findOddOver = oddsOver.find((oddOver) => oddOver.factorExtra === oddUnder.factorExtra);
    resultOrdered.push(!empty(findOddOver) ? findOddOver : {});
    resultOrdered.push(oddUnder);
  })
  return resultOrdered;
}

export function orderOddsHandicap(oddsInput) {
  let resultOrdered = [];
  let oddsMartketType1 = oddsInput.filter((odd) => odd.marketType === '1');
  let oddsMartketType2 = oddsInput.filter((odd) => odd.marketType === '2');
  let oddsOrderByType1 = oddsMartketType1.sort((a, b) => a.factorExtra.split(' ')[0] - b.factorExtra.split(' ')[0]);

  oddsOrderByType1.map((oddType1) => {
    const findMarketType2 = oddsMartketType2.find((oddType2) => oddType2.factorExtra.split(' ')[0] === oddType1.factorExtra.split(' ')[0]);
    resultOrdered.push(!empty(findMarketType2) ? findMarketType2 : {});
    resultOrdered.push(oddType1);
  })
  return resultOrdered;
}

export function getAnimals() {

  let animals = [];

  animals.push({ id: "00", name: "BALLENA", image: "/wp-content/uploads/2024/02/00-BALLENA.png" });
  animals.push({ id: "0", name: "DELFIN", image: "/wp-content/uploads/2024/02/0-DELFIN.png" });
  animals.push({ id: "01", name: "CARNERO", image: "/wp-content/uploads/2024/02/1-CARNERO.png" });
  animals.push({ id: "02", name: "TORO", image: "/wp-content/uploads/2024/02/2-TORO.png" });
  animals.push({ id: "03", name: "CIEMPIES", image: "/wp-content/uploads/2024/02/3-CIEMPIES.png" });
  animals.push({ id: "04", name: "ALACRAN", image: "/wp-content/uploads/2024/02/4-ALACRAN.png" });
  animals.push({ id: "05", name: "LEON", image: "/wp-content/uploads/2024/02/5-LEON-1.png" });
  animals.push({ id: "06", name: "RANA", image: "/wp-content/uploads/2024/02/6-RANA-1.png" });
  animals.push({ id: "07", name: "PERICO", image: "/wp-content/uploads/2024/02/7-PERICO-1.png" });
  animals.push({ id: "08", name: "RATON", image: "/wp-content/uploads/2024/02/8-RATON-1.png" });
  animals.push({ id: "09", name: "AGUILA", image: "/wp-content/uploads/2024/02/9-AGUILA-1.png" });
  animals.push({ id: "10", name: "TIGRE", image: "/wp-content/uploads/2024/02/10-TIGRE.png" });
  animals.push({ id: "11", name: "GATO", image: "/wp-content/uploads/2024/02/11-GATO.png" });
  animals.push({ id: "12", name: "CABALLO", image: "/wp-content/uploads/2024/02/12-CABALLO.png" });
  animals.push({ id: "13", name: "MONO", image: "/wp-content/uploads/2024/02/13-MONO.png" });
  animals.push({ id: "14", name: "PALOMA", image: "/wp-content/uploads/2024/02/14-PALOMA.png" });
  animals.push({ id: "15", name: "ZORRO", image: "/wp-content/uploads/2024/02/15-ZORRO.png" });
  animals.push({ id: "16", name: "OSO", image: "/wp-content/uploads/2024/02/16-OSO.png" });
  animals.push({ id: "17", name: "PAVO", image: "/wp-content/uploads/2024/02/17-PAVO.png" });
  animals.push({ id: "18", name: "BURRO", image: "/wp-content/uploads/2024/02/18-BURRO.png" });
  animals.push({ id: "19", name: "CHIVO", image: "/wp-content/uploads/2024/02/19-CHIVO.png" });
  animals.push({ id: "20", name: "COCHINO", image: "/wp-content/uploads/2024/02/20-COCHINO.png" });
  animals.push({ id: "21", name: "GALLO", image: "/wp-content/uploads/2024/02/21-GALLO.png" });
  animals.push({ id: "22", name: "CAMELLO", image: "/wp-content/uploads/2024/02/22-CAMELLO.png" });
  animals.push({ id: "23", name: "CEBRA", image: "/wp-content/uploads/2024/02/23-CEBRA.png" });
  animals.push({ id: "24", name: "IGUANA", image: "/wp-content/uploads/2024/02/24-IGUANA.png" });
  animals.push({ id: "25", name: "GALLINA", image: "/wp-content/uploads/2024/02/25-GALLINA.png" });
  animals.push({ id: "26", name: "VACA", image: "/wp-content/uploads/2024/02/26-VACA.png" });
  animals.push({ id: "27", name: "PERRO", image: "/wp-content/uploads/2024/02/27-PERRO.png" });
  animals.push({ id: "28", name: "ZAMURO", image: "/wp-content/uploads/2024/02/28-ZAMURO.png" });
  animals.push({ id: "29", name: "ELEFANTE", image: "/wp-content/uploads/2024/02/29-ELEFANTE.png" });
  animals.push({ id: "30", name: "CAIMAN", image: "/wp-content/uploads/2024/02/30-CAIMAN.png" });
  animals.push({ id: "31", name: "LAPA", image: "/wp-content/uploads/2024/02/31-LAPA.png" });
  animals.push({ id: "32", name: "ARDILLA", image: "/wp-content/uploads/2024/02/32-ARDILLA.png" });
  animals.push({ id: "33", name: "PESCADO", image: "/wp-content/uploads/2024/02/33-PESCADO.png" });
  animals.push({ id: "34", name: "VENADO", image: "/wp-content/uploads/2024/02/34-VENADO.png" });
  animals.push({ id: "35", name: "JIRAFA", image: "/wp-content/uploads/2024/02/35-JIRAFA.png" });
  animals.push({ id: "36", name: "CULEBRA", image: "/wp-content/uploads/2024/02/36-CULEBRA.png" });

  return animals;

}

export function clearLocalStorage() {
  localStorage.clear();
  location.reload();
}

export function getSecureGetParams(params) {
  try {
    const result = queryString.parse(atob(params));
    return result;
  } catch (error) {
    console.error("Error: getSecureGetParams::", error);
    return {};
  }
}