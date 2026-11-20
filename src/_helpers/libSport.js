import empty from 'is-empty';
import { history } from './history';
import queryString  from 'query-string';


export function translateType(type,sportName = 'Soccer',lang = 'es') {
    let arrayTranslates=[]; 
    arrayTranslates['home'] = '1x2';
    arrayTranslates['draw'] = '1x2';
    arrayTranslates['away'] = '1x2';
    arrayTranslates['under'] = 'Alta/Baja';
    arrayTranslates['over'] = 'Alta/Baja';
    arrayTranslates['underover'] = 'Alta/Baja';
    arrayTranslates['underoverot-es-Soccer'] = 'Alta/Baja con extratiempo';
    arrayTranslates['underoverot-es-Baseball'] = 'Alta/Baja con extrainning';
    arrayTranslates['underoverot-es-Basketball'] = 'Alta/Baja con extratiempo';
    arrayTranslates['underoverfirstperiod'] = 'Alta/Baja Primer Período';
    arrayTranslates['underoverfirstperiod-es-Basketball'] = 'Alta/Baja Primer Cuarto';
    arrayTranslates['underoverfirstperiod-es-Soccer'] = 'Alta/Baja Primer Tiempo';
    arrayTranslates['underoverfirstperiod-es-Baseball'] = 'Alta/Baja Primer Inning';
    arrayTranslates['underoversecondperiod'] = 'Alta/Baja Segundo Período';
    arrayTranslates['underoversecondperiod-es-Basketball'] = 'Alta/Baja Segundo Período';
    arrayTranslates['underoversecondperiod-es-Soccer'] = 'Alta/Baja Segundo Tiempo';
    arrayTranslates['underoversecondperiod-es-Baseball'] = 'Alta/Baja Segundo Inning';
    arrayTranslates['underoverhometeam'] = 'Alta/Baja Equipo Casa';
    arrayTranslates['underoverhometeamot'] = 'Alta/Baja con extratiempo Equipo Casa';
    arrayTranslates['underoverawayteamot'] = 'Alta/Baja con extratiempo Equipo Visitante';
    arrayTranslates['underoverawayteam'] = 'Alta/Baja Equipo Visitante';
    arrayTranslates['asianunderover'] = 'Alta / Baja Asiáticas';
    arrayTranslates['asianunderovercorners'] = 'Alta / Baja de Corners Asiáticas';
    arrayTranslates['asianunderovercards'] = 'Alta / Baja de Tarjetas Asiáticas';
    arrayTranslates['underovercornersfirst'] = 'Alta / Baja de Corners Primera Mitad';
    arrayTranslates['asianunderoverfirstperiod'] = 'Alta / Baja Asiático Primer Período';
    arrayTranslates['asianunderoverfirstperiod-es-Soccer'] = 'Alta / Baja Asiático Primer Tiempo';
    arrayTranslates['asianunderoverfirstperiod-es-Basketball'] = 'Alta / Baja Asiático Primer Cuarto';
    arrayTranslates['asianunderoverfirstperiod-es-Baseball'] = 'Alta / Baja Asiático Primer Inning';
    arrayTranslates['both'] = 'Ambos marcan';
    arrayTranslates['bothfirst'] = 'Ambos marcan en la primera mitad';
    arrayTranslates['bothsecond'] = 'Ambos marcan en la segunda mitad';
    arrayTranslates['bothfirst-es-Soccer'] = 'Ambos marcan primer tiempo';
    arrayTranslates['bothsecond-es-Soccer'] = 'Ambos marcan segundo tiempo';
    arrayTranslates['correctscore'] = 'Marcador Exacto';
    arrayTranslates['correctscoreot'] = 'Marcador Exacto incluído extratiempo';
    arrayTranslates['correctscorefirstperiod'] = 'Marcador Exacto Primer Período';
    arrayTranslates['correctscorefirstperiod-es-Basketball'] = 'Marcador Exacto Primer Cuarto';
    arrayTranslates['correctscorefirstperiod-es-Baseball'] = 'Marcador Exacto Primer Innning';
    arrayTranslates['correctscorefirstperiod-es-Soccer'] = 'Marcador Exacto Primer Tiempo';
    arrayTranslates['totalcorners'] = 'Total de Corners';
    arrayTranslates['oddeven'] = 'Impar/Par';
    arrayTranslates['oddevenhome'] = 'Impar/Par Casa';
    arrayTranslates['oddevenaway'] = 'Impar/Par Visitante';
    arrayTranslates['oddevenot'] = 'Impar/Par incluído extratiempo';
    arrayTranslates['oddevencorners'] = 'Impar/Par Total de Corners';
    arrayTranslates['asianhandicap'] = 'Hándicap';
    arrayTranslates['asianhandicap-es-Soccer'] = 'Hándicap Tiempo Completo';
    arrayTranslates['asianhandicaphalftime'] = 'Hándicap Mitad de Tiempo';
    arrayTranslates['asianhandicapfirstperiod'] = 'Hándicap 1er. Período';
    arrayTranslates['asianhandicapfirstperiod-es-Soccer'] = 'Hándicap 1er. Tiempo';
    arrayTranslates['exactgoals'] = 'Número de Goles';
    arrayTranslates['numbergoalsfirst'] = 'Número de Goles Primera Mitad';
    arrayTranslates['numbergoalssecond'] = 'Número de Goles Segunda Mitad';
    arrayTranslates['numbergoalshome'] = 'Número de Goles Casa';
    arrayTranslates['numbergoalsaway'] = 'Número de Goles Visitante';
    arrayTranslates['drawnobet'] = 'Apuesta sin empate';
    arrayTranslates['totalfoulscommitted'] = 'Total de Faltas cometidas';
    arrayTranslates['firstteamtoscore'] = 'Primer equipo en marcar';
    arrayTranslates['lastteamtoscore'] = 'Último equipo en marcar';
    arrayTranslates['lastteamtoscoreot'] = 'Último equipo en marcar incluído extratiempo';
    arrayTranslates['12halftime'] = 'Ganador Medio Tiempo sin empate';
    arrayTranslates['1x2halftime'] = 'Ganador Medio Tiempo con empate';
    arrayTranslates['asianhandicapovertime'] = 'Hándicap Incluído extratiempo';
    arrayTranslates['asianhandicapovertime-es-Baseball'] = 'Hándicap Incluído extrainnings';
    arrayTranslates['firstperiododdeven'] = 'Impar/Par 1er. Período';
    arrayTranslates['firstperiododdeven-es-Soccer'] = 'Impar/Par 1er. Tiempo';
    arrayTranslates['firstperiododdeven-es-Basketball'] = 'Impar/Par 1er. Cuarto';
    arrayTranslates['firstperiododdeven-es-Baseball'] = 'Impar/Par 1er. Inning';
    arrayTranslates['firstperiododdeven-es-Volleyball'] = 'Impar/Par 1er. Set';
    arrayTranslates['secondperiododdeven'] = 'Impar/Par 2do. Período';
    arrayTranslates['thirdperiododdeven'] = 'Impar/Par 3er. Período';
    arrayTranslates['fourthperiododdeven'] = 'Impar/Par 4to. Período';
    arrayTranslates['htft'] = 'Ganador de Medio Tiempo y Tiempo Completo';
    arrayTranslates['htftot'] = 'Ganador de Medio Tiempo y Tiempo Completo incluído extratiempo';
    arrayTranslates['cornersuoe'] = 'Total de Corners';
    arrayTranslates['firsthalfcornersuoe'] = 'Total de Corners en la primera mitad';
    arrayTranslates['firstplayertoscore'] = 'Primer jugador en marcar';
    arrayTranslates['lastplayertoscore'] = 'Último jugador en marcar';
    arrayTranslates['playertoscoreanytime'] = 'Goleador en cualquier momento';
    arrayTranslates['playertoscore2goals'] = 'Jugador que marca 2 goles o más';
    arrayTranslates['playertoscore3goals'] = 'Jugador que marca 3 goles o más';
    arrayTranslates['teamfirstplayer'] = 'Primer jugador en marcar en el equipo';
    arrayTranslates['teamlastplayer'] = 'Último jugador en marcar en el equipo';
    arrayTranslates['winningmarginexact'] = 'Margen exacto del ganador';
    arrayTranslates['winningmarginfirst'] = 'Margen del ganador en Primera Mitad';
    arrayTranslates['winningmarginteamsfirstperiod'] = 'Margen del ganador en Primer Período por equipo';
    arrayTranslates['winningmarginteamsfirstperiod-es-Soccer'] = 'Margen del ganador en Primer Tiempo por equipo';
    arrayTranslates['winningmarginteamsfirstperiod-es-Basketball'] = 'Margen del ganador en Primer Cuarto por equipo';
    arrayTranslates['winningmarginteamsfirstperiod-es-Baseball'] = 'Margen del ganador en Primer Inning por equipo';
    arrayTranslates['winningmarginfirstperiod'] = 'Margen del ganador en Primer Período';
    arrayTranslates['winningmarginfirstperiod-es-Soccer'] = 'Margen del ganador en Primer Tiempo';
    arrayTranslates['winningmarginfirstperiod-es-Basketball'] = 'Margen del ganador en Primer Cuarto';
    arrayTranslates['winningmarginfirstperiod-es-Baseball'] = 'Margen del ganador en Primer Inning';
    arrayTranslates['winningmarginot'] = 'Margen del ganador incluído extratiempo';
    arrayTranslates['firstgoaltime'] = 'Minuto en que se marcará el primer gol';
    arrayTranslates['1x2bothteamstoscore'] = '1x2 y ambos marcan';
    arrayTranslates['first1x2bothteamstoscore'] = '1x2 y ambos marcan 1er. Período';
    arrayTranslates['racestocorners'] = 'El equipo que llega primero a la cantidad de corners';
    arrayTranslates['firsthalfraceto'] = 'El equipo que llega primero a la cantidad de puntos en la primera mitad';
    arrayTranslates['secondhalfracetoot'] = 'El equipo que llega primero a la cantidad de puntos en la segunda mitad con extratiempo';
    arrayTranslates['firstperiodraceto'] = 'El equipo que llega primero a la cantidad de puntos en el primer período';
    arrayTranslates['firstperiodraceto-es-Soccer'] = 'El equipo que llega primero a la cantidad de puntos en el primer tiempo';
    arrayTranslates['firstperiodraceto-es-Baseball'] = 'El equipo que llega primero a la cantidad de puntos en el primer inning';
    arrayTranslates['firstperiodraceto-es-Basketball'] = 'El equipo que llega primero a la cantidad de puntos en el primer cuarto';
    arrayTranslates['firstperiodwinner-es-Soccer'] = 'Ganador primer tiempo';
    arrayTranslates['firstperiodwinner-es-Ice-hockey'] = 'Ganador primer período';
    arrayTranslates['firstperiodwinner-es-Baseball'] = 'Ganador primer inning';
    arrayTranslates['doublechance'] = 'Doble Oportunidad';
    arrayTranslates['doublechanceht'] = 'Doble Oportunidad en Primera Mitad';
    arrayTranslates['doublechancefirstperiod'] = 'Doble Oportunidad en el primer período';
    arrayTranslates['doublechancefirstperiod-es-Soccer'] = 'Doble Oportunidad en el primer tiempo';
    arrayTranslates['doublechancefirstperiod-es-Baseball'] = 'Doble Oportunidad en el primer inning';
    arrayTranslates['doublechancefirstperiod-es-Basketball'] = 'Doble Oportunidad en el primer cuarto';
    arrayTranslates['playertobebooked'] = 'Jugador en ser amonestado';
    arrayTranslates['playertobesentoff'] = 'Jugador en ser expulsado';
    arrayTranslates['goalsrange'] = 'Rango de Goles';
    arrayTranslates['highestscoringhalf'] = 'Mitad con mayor puntuación';
    arrayTranslates['secondperiodwinner'] = 'Ganador del segundo período';
    arrayTranslates['secondperiodwinner-es-Soccer'] = 'Ganador segundo tiempo';
    arrayTranslates['secondperiodwinner-es-Basketball'] = 'Ganador segundo cuarto';
    arrayTranslates['secondperiodwinner-es-Baseball'] = 'Ganador segundo inning';
    arrayTranslates['halfhometeammorescore'] = 'En cual mitad tiene mayor puntuación la casa';
    arrayTranslates['halfawayteammorescore'] = 'En cual mitad tiene mayor puntuación el visitante';
    arrayTranslates['10minuteresult'] = 'Resultado a los 10Min';
    arrayTranslates['10minuteunderover'] = 'Alta/Baja a los 10 minutos';
    arrayTranslates['underoverhalftime'] = 'Alta/Baja Mitad de Tiempo';
    arrayTranslates['3waywinningmarginot'] = 'Margen del ganador de 3 vías';
    arrayTranslates['1x2corners'] = '1x2 Corners';
    arrayTranslates['firstperiodwinnerha'] = 'Ganador del primer período Casa/Visitante';
    arrayTranslates['firstperiodwinnerha-es-Tennis'] = 'Ganador del primer set';
    arrayTranslates['firstperiodwinnerha-es-Volleyball'] = 'Ganador del primer set';
    arrayTranslates['firstgoalmethod'] = 'Forma en que se hace el primer gol';
    arrayTranslates['multiplecorners'] = 'Múltiples Corners';
    arrayTranslates['cornershandicap'] = 'Hándicap Corners';
    arrayTranslates['10minuteunderovercorners'] = 'Alta/Baja de corners a los 10 minutos';
    arrayTranslates['firstmatchcorner'] = 'Primer equipo en obtener un corner';
    arrayTranslates['lastmatchcorner'] = 'Último equipo en obtener un corner';
    arrayTranslates['winningmarginranges'] = 'Rangos de margen del ganador';
    arrayTranslates['uoefirstperiod'] = 'Alta/Baja/Exactamente del Primer Período';
    arrayTranslates['uoefirstperiod-es-Soccer'] = 'Alta/Baja/Exactamente del Primer Tiempo';
    arrayTranslates['uoefirstperiod-es-Basketball'] = 'Alta/Baja/Exactamente del Primer Cuarto';
    arrayTranslates['uoefirstperiod-es-Baseball'] = 'Alta/Baja/Exactamente del Primer Inning';
    arrayTranslates['uoesecondperiod'] = 'Alta/Baja/Exactamente del Segundo Período';
    arrayTranslates['uoesecondperiod-es-Soccer'] = 'Alta/Baja/Exactamente del Segundo Tiempo';
    arrayTranslates['uoesecondperiod-es-Basketball'] = 'Alta/Baja/Exactamente del Segundo Cuarto';
    arrayTranslates['uoesecondperiod-es-Baseball'] = 'Alta/Baja/Exactamente del Segundo Inning';
    arrayTranslates['uoe'] = 'Alta/Baja/Exactamente';
    arrayTranslates['highestscoringperiod'] = 'Período con el puntaje más alto';
    arrayTranslates['willbeanowngoal'] = '¿Hay autogol en el partido?';
    arrayTranslates['bothscorefirsthalf'] = 'Ambos equipos llegan a la cantidad de puntos en la primera mitad';
    arrayTranslates['bothscorefirstperiod'] = 'Ambos equipos llegan a la cantidad de puntos en el primer período';
    arrayTranslates['raceto'] = 'El equipo que llega primero a la puntuación';
    arrayTranslates['racetoot'] = 'El equipo que llega primero a la puntuación con extratiempo';
    arrayTranslates['drawnobetot'] = 'Apuesta sin empate incluído extratiempo';
    arrayTranslates['uoplayerassists'] = 'Alta/Baja de Jugador con asistencia';
    arrayTranslates['uoplayershots'] = 'Alta/Baja de Jugador con tiros a portería';
    arrayTranslates['drawnobet'] = 'Apuesta sin empate';
    arrayTranslates['toscoreapenalty'] = '¿Cuál equipo marca un penalti?';
    arrayTranslates['winningmarginteamsany'] = 'Margen del ganador por equipo cualquier puntuación';
    arrayTranslates['asianhandicappoints'] = 'Hándicap de Puntos';
    arrayTranslates['uoplayerpowerplaypoints'] = 'Alta/Baja de Jugador marcando en Power Play'; 
    arrayTranslates['firstcard'] = 'Primer equipo al que le sacan una tarjeta';   
    arrayTranslates['raceto20points'] = 'Primer equipo en marcar 20 puntos';   
    arrayTranslates['willthegamegotoot'] = '¿El juego tendrá extratiempo?';
    arrayTranslates['willthegamegotoot-es-Baseball'] = '¿El juego tendrá extrainning?';   
    arrayTranslates['asianhandicapcards'] = 'Hándicap de Tarjetas';
    arrayTranslates['underovercards'] = 'Alta/Baja Tarjetas';
    arrayTranslates['10minuteunderovercards'] = 'A los 10 minutos Alta/Baja Tarjetas';
    arrayTranslates['teamtowinthemostperiods'] = '¿Cuál equipo gana más períodos?';  
    arrayTranslates['uoplayerpointsrebounds'] = 'Alta/Baja de Jugador con puntos y rebotes';
    arrayTranslates['uoplayerpointsassists'] = 'Alta/Baja de Jugador con puntos y asistencias';
    arrayTranslates['uoplayersassistsrebounds'] = 'Alta/Baja de Jugador de asistencias y rebotes';
    arrayTranslates['firstperiodextrapoints'] = '¿Hay puntos extra en el prímer período?';
    arrayTranslates['asianhandicapgames'] = 'Hándicap de Juegos';
    arrayTranslates['uoplayerpoints'] = 'Alta/Baja de Jugador con puntos';
    arrayTranslates['underovergames'] = 'Alta/Baja de Juegos';
    arrayTranslates['uoplayersturnovers'] = 'Alta/Baja de Pérdida de balón del jugador';
    arrayTranslates['uoplayersrebounds'] = 'Alta/Baja de rebotes del jugador';
    arrayTranslates['asianhandicapsets'] = 'Hándicap de Sets';
    arrayTranslates['uoplayerssteals'] = 'Alta/Baja de pelotas robadas por el jugador';
    arrayTranslates['uoplayersstealsblocks'] = 'Alta/Baja de pelotas robadas y bloqueos del jugador';
    arrayTranslates['uoplayersblocks'] = 'Alta/Baja de bloqueos del jugador';
    arrayTranslates['willaredcardbeshown'] = '¿Sacarán tarjeta roja?';
    arrayTranslates['willapenaltybeawarded'] = '¿Habrá penalti?';
    arrayTranslates['willfirstscoringteamwin'] = '¿Ganará el primer equipo en marcar el gol?';
    arrayTranslates['playerdoubledouble'] = 'Jugador Doble-Doble';
    arrayTranslates['uoplayersshotsontarget'] = 'Alta/Baja tiros al arco de jugador';
    arrayTranslates['willgamegotoshootout'] = '¿El juego irá a Shoot-out?';
    arrayTranslates['underoverbreakpoints'] = 'Alta/Baja de Break Points';
    arrayTranslates['toqualify'] = '¿Quién clasifica?';
    arrayTranslates['underovertiebreakmatch'] = 'Alta/Baja de Tie Break en el partido';
    arrayTranslates['numberofsets'] = 'Número de sets';
    arrayTranslates['underoverfirstinning'] = 'Alta/Baja del 1er. Inning';
    arrayTranslates['playertripledouble'] = 'Jugador Triple-Doble';
    arrayTranslates['willgamedecidedextratime'] = '¿El juego se decidirá en tiempo extra?';
    arrayTranslates['cupwinner'] = 'Ganador de la copa';
    arrayTranslates['cornersrange'] = 'Rango de Corners';
    arrayTranslates['teamwithhighestscoringinning'] = 'Equipo con el score más alto en un Inning';
    arrayTranslates['arunfirstinning'] = '¿Habrá carrera en el 1er. Inning?';
    arrayTranslates['underoverfirst5innings'] = 'Alta/Baja de los Primeros 5 Innings';
    arrayTranslates['uoplayertotalbases'] = 'Alta/Baja de total de bases del jugador';
    arrayTranslates['uoplayerhomeruns'] = 'Alta/Baja de total de jonrón del jugador';
    arrayTranslates['uoplayersingles'] = 'Alta/Baja de hits del jugador';
    arrayTranslates['uoplayerdoubles'] = 'Alta/Baja de dobles del jugador';
    arrayTranslates['uoplayer3points'] = 'Alta/Baja de triples del jugador';
    arrayTranslates['uoplayerruns'] = 'Alta/Baja de carreras del jugador';
    arrayTranslates['uoplayerstolenbases'] = 'Alta/Baja de bases robadas del jugador';
    arrayTranslates['first5inningsasianhandicap'] = 'Hándicap de los primeros 5 innings';
    arrayTranslates['uoplayertriples'] = 'Alta/Baja de triples del jugador';
    arrayTranslates['uopitcherstrikeouts'] = 'Alta/Baja de ponches del pitcher';
    arrayTranslates['uohits'] = 'Alta/Baja de hits';
    arrayTranslates['pitcherrecordwin'] = 'Victoria acreditada al pitcher';
    arrayTranslates['uopitcherrunsearned'] = 'Alta/Baja de carreras ganadas por el pitcher';
    arrayTranslates['uopitcherhitsallowed'] = 'Alta/Baja de hits permitidos por el pitcher';
    arrayTranslates['mosthitsfirstinning'] = '¿Cuál equipo realiza más hits en el 1er. Inning?';
    arrayTranslates['mosthitsot'] = '¿Cuál equipo realiza más hits en todo el juego incluído extrainnings?';
    arrayTranslates['underovertotalshots'] = 'Alta/Baja de total de tiros';
    arrayTranslates['underovershotstarget'] = 'Alta/Baja de total de tiros al arco';
    arrayTranslates['underoveroffsides'] = 'Alta/Baja de fuera de juego';
    arrayTranslates['first5inningswinner'] = 'Ganador a los 5 Innings';
    arrayTranslates['first5inningswinnerot'] = 'Ganador a los 5 Innings sin empate';
    arrayTranslates['underoversets'] = 'Alta/Baja de Sets';
    arrayTranslates['underoverrounds'] = 'Alta/Baja de Rounds';
    return !empty(arrayTranslates[`${type}-${lang}-${sportName}`]) ? arrayTranslates[`${type}-${lang}-${sportName}`] : !empty(arrayTranslates[type]) ? arrayTranslates[type] : null;
}

export function translateDescription(type,eventHome,eventAway,factor,marketType,factorExtra,marketTypeDetail) {
    let description = ``;
    let marketType1 = marketType;

    switch (type) {
        case 'home':
            description = eventHome;
            break;
        case 'away':
            description = eventAway;
            break;    
        case 'draw':
            description = 'Empate';
            break; 
        case 'under':
            description = `Menos de ${factor}`;
            break;            
        case 'over':
            description = `Más de ${factor}`;
            break;
        case 'doublechance':
        case 'doublechancefirstperiod':
        case 'correctscore':
        case 'correctscoreot':
        case 'correctscorefirstperiod':
        case 'exactgoals':
        case 'numbergoalsfirst':
        case 'numbergoalssecond':
        case 'htft':
        case 'htftot':
        case 'firstplayertoscore':
        case 'lastplayertoscore':
        case 'playertoscoreanytime':
        case 'playertoscore2goals':
        case 'playertoscore3goals':
        case 'teamfirstplayer':
        case 'teamlastplayer':
        case 'firstgoaltime':
        case 'playertobebooked':
        case 'playertobesentoff':
        case 'goalsrange':
        case 'winningmarginranges':
        case 'doublechanceht':
        case 'numberofsets':
        case 'cornersrange':
            description = marketType;
            break;
        case 'both':
        case 'bothfirst':
        case 'bothsecond':
        case 'willbeanowngoal':
        case 'willthegamegotoot':
        case 'firstperiodextrapoints':
        case 'willaredcardbeshown': 
        case 'willapenaltybeawarded': 
        case 'willfirstscoringteamwin': 
        case 'willgamegotoshootout':
        case 'willgamedecidedextratime':
        case 'arunfirstinning':
            description = (marketType=='Yes' ? 'Sí': marketType)
            break;
        case 'bothscorefirsthalf':
        case 'bothscorefirstperiod':
        case 'playerdoubledouble': 
        case 'playertripledouble': 
        case 'pitcherrecordwin':
            description = (marketType=='Yes' ? `${factorExtra} Sí`: `${factorExtra} ${marketType}`)
            break;
        case 'underover':    
        case 'totalcorners':    
        case 'totalfoulscommitted':
        case 'asianunderover':  
        case 'asianunderoverfirstperiod':  
        case 'underoverfirstperiod':  
        case 'underoversecondperiod':
        case 'underoverot':
        case 'underoverhalftime':
        case 'underovercornersfirst':
        case '10minuteunderover':
        case '10minuteunderovercorners':
        case 'asianunderovercorners':  
        case 'multiplecorners':
        case 'asianunderovercards':   
        case 'underovercards':
        case '10minuteunderovercards':  
        case 'underovergames': 
        case 'underoversets': 
        case 'underoverbreakpoints':
        case 'underovertiebreakmatch':
        case 'underoverfirstinning':
        case 'underoverfirst5innings':
        case 'uohits':
        case 'underovertotalshots':
        case 'underovershotstarget':
        case 'underoveroffsides':
        case 'underoverrounds':
            description = (marketType=='Under' ? `Menos de ${factorExtra}` : marketType=='Over' ?  `Más de ${factorExtra}` : null);
            break;
        case 'underoverhometeam':  
        case 'underoverhometeamot':  
            description = (marketType=='Under' ? `${eventHome} Menos de ${factorExtra}` : marketType=='Over' ?  `${eventHome} Más de ${factorExtra}` : null);
            break;
        case 'underoverawayteam':
        case 'underoverawayteamot': 
            description = (marketType=='Under' ? `${eventAway} Menos de ${factorExtra}` : marketType=='Over' ?  `${eventAway} Más de ${factorExtra}` : null);  
            break;
        case 'cornersuoe':  
        case 'firsthalfcornersuoe':    
        case 'uoefirstperiod':
        case 'uoesecondperiod': 
        case 'uoe': 
            description = (marketType=='Under' ? `Menos de ${factorExtra}` : marketType=='Over' ?  `Más de ${factorExtra}` : marketType=='Exactly' ?  `Exactamente ${factorExtra}` : null);
            break;
        case 'oddeven':
        case 'oddevenot':
        case 'oddevencorners':
        case 'firstperiododdeven':
        case 'secondperiododdeven':
        case 'thirdperiododdeven':
        case 'fourthperiododdeven':
            description = (marketType=='Odd' ? 'Impar' : marketType=='Even' ? 'Par' : null);
            break;
        case 'oddevenhome':
            description = (marketType=='Odd' ? `${eventHome} Impar` : marketType=='Even' ? `${eventHome} Par` : null);
            break;
        case 'oddevenaway':
            description = (marketType=='Odd' ? `${eventAway} Impar` : marketType=='Even' ? `${eventAway} Par` : null);
            break;
        case 'drawnobet':
        case 'drawnobetot':
        case '12halftime':
        case 'toscoreapenalty':     
        case 'raceto20points': 
        case 'toqualify':
        case 'cupwinner':             
            description = (marketType=='1' ? eventHome : marketType=='2' ? eventAway : null);
            break;
        case 'firstteamtoscore':  
        case 'lastteamtoscore': 
        case 'lastteamtoscoreot': 
        case 'firstmatchcorner': 
        case 'lastmatchcorner':          
            description = (marketType=='1' ? eventHome : marketType=='2' ? eventAway : marketType=='No Goal' ? 'Sin Goles' : null);
            break;
        case '1x2halftime': 
        case '1x2corners':
        case 'teamtowinthemostperiods':
        case 'teamwithhighestscoringinning':  
        case 'mosthitsfirstinning':
        case 'mosthitsot':
            description = (marketType=='1' ? eventHome : marketType=='2' ? eventAway : marketType=='X' ? 'Empate' : null);
            break;
        case 'asianhandicap':  
        case 'asianhandicapfirstperiod':   
        case 'asianhandicapovertime':
        case 'asianhandicaphalftime':  
        case '3waywinningmarginot':  
        case 'winningmarginfirstperiod': 
        case 'cornershandicap': 
        case 'asianhandicappoints':  
        case 'asianhandicapcards':  
        case 'asianhandicapgames':
        case 'asianhandicapsets':
        case 'first5inningsasianhandicap':
            description = (marketType=='1' ? `${eventHome} ${factorExtra}` : marketType=='2' ? `${eventAway} ${factorExtra}` : null);
            break;
        case 'winningmarginexact': 
        case 'winningmarginot': 
        case 'winningmarginfirst':  
        case 'winningmarginteamsfirstperiod':
        case 'winningmarginteamsany':
            description = (marketType.includes('Home') ? marketType1.replace('Home',eventHome)  : marketType.includes('Away') ? marketType1.replace('Away',eventAway) : marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : marketType=='X' ? 'Empate' : '')
            break;
        case '1x2bothteamstoscore':  
        case 'first1x2bothteamstoscore':
            description = (marketType == '1 And Both Teams To Score' ? `${eventHome} y ambos equipos marcan`  : marketType == '2 And Both Teams To Score' ? `${eventAway} y ambos equipos marcan` : marketType == '1 To Nil' ? `${eventHome} gana y ${eventAway} no marca` : marketType == '2 To Nil' ? `${eventAway} gana y ${eventHome} no marca` : marketType == 'Both Teams Not To Score' ? `Ambos equipos no marcan` : marketType == 'Both Teams To Score And X' ? `Ambos equipos marcan y hay empate` : '')
            break;
        case 'racestocorners':
        case 'firsthalfraceto':
        case 'raceto':
        case 'racetoot':
        case 'secondhalfracetoot':
        case 'firstperiodraceto':
                description = (marketType == '1' ? `${eventHome} ${factorExtra}`  : marketType == '2' ? `${eventAway} ${factorExtra}` : marketType == 'Neither' ? `Ningún equipo ${factorExtra}` : '')
                break;
        case 'firstperiodwinner':
        case 'secondperiodwinner':
        case '10minuteresult':
        case 'firstperiodwinnerha':
        case 'first5inningswinner':
        case 'first5inningswinnerot':
                description = (marketType == '1' ? `${eventHome}`  : marketType == '2' ? `${eventAway}` : marketType == 'X' ? `Empate` : '')
                break;
        case 'numbergoalshome':
                description = `${eventHome} ${marketType}`;
                break;
        case 'numbergoalsaway':
                description = `${eventAway} ${marketType}`;
                break;
        case 'highestscoringhalf':
        case 'halfhometeammorescore':
        case 'halfawayteammorescore':
                description = (marketType == '1st Half' ? `1era. Mitad`  : marketType == '2nd Half' ? `2da. Mitad` : marketType == 'All Periods The Same' ? `Ambos periodos iguales` : '')
                break;
        case 'firstgoalmethod': 
                description = (marketType=='Header' ? 'De cabeza' : marketType=='Shot' ? 'De Tiro' : marketType=='Free Kick' ? 'De Tiro Libre' : marketType=='No Goal' ? 'Sin Goles': marketType=='Own Goal' ? 'Autogol' : marketType=='Penalty' ? 'Penalti' : '')
                break;
        case 'highestscoringperiod': 
                description = (marketType=='1st Period' ? '1er. Período' : marketType=='2nd Period' ? '2do. Período' : marketType=='3rd Period' ? '3er. Período' : marketType=='4th Period' ? '4to. Período' : marketType=='All Periods The Same' ? 'Todos los períodos misma puntuación' : '')
                break;
        case 'uoplayerassists': 
        case 'uoplayershots': 
        case 'uoplayerpowerplaypoints':  
        case 'uoplayerpointsrebounds':
        case 'uoplayerpointsassists':
        case 'uoplayersassistsrebounds':
        case 'uoplayerpoints':
        case 'uoplayersturnovers':
        case 'uoplayersrebounds':
        case 'uoplayerssteals':
        case 'uoplayersstealsblocks':
        case 'uoplayersblocks':
        case 'uoplayersshotsontarget':
        case 'uoplayertotalbases':
        case 'uoplayerhomeruns':
        case 'uoplayersingles':
        case 'uoplayerdoubles':
        case 'uoplayer3points':
        case 'uoplayerruns':
        case 'uoplayerstolenbases':
        case 'uoplayertriples':
        case 'uopitcherstrikeouts':
        case 'uopitcherrunsearned':
        case 'uopitcherhitsallowed':
                let player = marketTypeDetail.split(' ');
                description = (marketType=='Under' ? `${player[0]} ${!empty(player[2]) ? player[1] : ''} Menos de ${factorExtra}` : marketType=='Over' ?  `${player[0]} ${!empty(player[2]) ? player[1] : ''} Más de ${factorExtra}` : null);
                break;
        case 'firstcard':  
                description = (marketType=='1' ? eventHome : marketType=='2' ? eventAway : marketType=='No Card' ? 'Sin Tarjeta' : null);
                break;
        default: 
            description = `` 
    }
         
    return description;
}

export function convertOddToAmerican (decimal) {
    let odds2 = '';
    let odds2pre = 0;
    if(parseFloat(decimal) >= 2) {
        odds2pre = (decimal*100)-100;
        odds2pre = Math.round(odds2pre);
        odds2 = "+" + odds2pre.toString(); 
    }else {
        odds2pre = 100/(parseFloat(decimal)-1);
        odds2pre = Math.round(odds2pre);
        odds2 = "-" + odds2pre.toString();
    }
    return odds2;
  }