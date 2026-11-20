import AuthActions      from './AuthActions';
import ErrorActions     from './ErrorActions';
import LoadingActions   from './LoadingActions';
import SellActions      from './SellActions';
import PayActions       from './PayActions';
import RefundActions    from './RefundActions';
import ResultActions    from './ResultActions';
import TicketsActions   from './TicketsActions';
import WagerTypesActions   from './WagerTypesActions';
import TicketOfficesActions   from './TicketOfficesActions';
import RacesActions   from './RacesActions';
import SportsActions   from './SportsActions';
import TicketStatusActions from './TicketStatusActions';
import TracksActions from './TracksActions';
import TokensActions from './TokensActions';

const actions = store => ({
    ErrorActions            :   (state, params) => ErrorActions.handler(store, params),
    AuthActions             :   (state, params) => AuthActions.handler(store, params),
    LoadingActions          :   (state, params) => LoadingActions.handler(store, params),
    SellActions             :   (state, params) => SellActions.handler(store, params),
    PayActions              :   (state, params) => PayActions.handler(store, params),
    RefundActions           :   (state, params) => RefundActions.handler(store, params),
    ResultActions           :   (state, params) => ResultActions.handler(store, params),
    TicketsActions          :   (state, params) => TicketsActions.handler(store, params),
    WagerTypesActions       :   (state, params) => WagerTypesActions.handler(store, params),
    TicketOfficesActions    :   (state, params) => TicketOfficesActions.handler(store, params),
    RacesActions            :   (state, params) => RacesActions.handler(store, params),
    SportsActions           :   (state, params) => SportsActions.handler(store, params),
    TicketStatusActions     :   (state, params) => TicketStatusActions.handler(store, params),
    TracksActions           :   (state, params) => TracksActions.handler(store, params),
    TokensActions           :   (state, params) => TokensActions.handler(store, params),
})

export default actions;
