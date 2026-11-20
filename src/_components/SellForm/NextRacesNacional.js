import React from "react";
import { connect } from "redux-zero/react";
import empty from "is-empty";
import actions from "../../_actions";
import AuthActions from "../../_actions/AuthActions";
import { Button } from "react-bootstrap";
import moment from "moment-timezone";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const MenuItem = ({
    id,
    date,
    trackId,
    trackName,
    raceNumber,
    raceDate,
    selected,
    props,
}) => {
    return (
        <div className={`menu-item`} onClick={() => { props.onClickTrackNextRace(trackId) } }>
            <div>{trackName}</div>
            <div><b>C{raceNumber} ({raceDate})</b></div>
        </div>
    );
};

export const Menu = (list, props) =>
    list.map((el) => {
        const { id } = el;
        return <MenuItem {...el} props={props} key={id} />;
    });

const Arrow = ({ icon, className }) => {
    return (
        <div className={className}>
            <FontAwesomeIcon icon={icon} color="grey" />
        </div>
    );
};

const ArrowLeft = Arrow({ icon: "arrow-circle-left", className: "arrow-prev" });
const ArrowRight = Arrow({
    icon: "arrow-circle-right",
    className: "arrow-next",
});

class NextRaces extends React.Component {

    constructor(props) {
        super(props);
    }

    getRacesByCenterId = (allNextRaces, ticket_offices_id) => {
        let result = [];
        for (let race of allNextRaces) {
            if (ticket_offices_id == 193) {
                if (race.trackByTracksId.enabledTrack) {
                    result.push(race);
                }
            } else {
                if (race.trackByTracksId.enabledCustomers) {
                    result.push(race);
                }
            }
        }

        return result.slice(0, 15);
    };

    render() {
        const { allNextRaces } = this.props;
        let userData = AuthActions.meData();
        let ticket_offices_id = !empty(userData) ? userData.ticket_offices_id : "";
        let allRaces = [];
        let rowsNextRaces = [];

        if (empty(allNextRaces)) {
            return null;
        }

        allRaces = this.getRacesByCenterId(allNextRaces, ticket_offices_id);

        if (!empty(allRaces)) {
            for (let k in allRaces) {
                if (
                    allRaces[k].trackByTracksId.id == "9101" ||
                    allRaces[k].trackByTracksId.id == "9102" ||
                    allRaces[k].trackByTracksId.id == "9100"
                ) {
                    rowsNextRaces.push({
                        id: allRaces[k].id,
                        raceDate: moment(allRaces[k].raceDate).format("hh:mm A"),
                        trackId: allRaces[k].trackByTracksId.id,
                        trackName: allRaces[k].trackByTracksId.trackName,
                        raceNumber: allRaces[k].raceNumber,
                    });
                }
            }
        }

        // Create menu from items
        const menu = Menu(rowsNextRaces, this.props);

        return (
            <div className="next-races">
                <ScrollMenu
                    data={menu}
                    arrowLeft={ArrowLeft}
                    arrowRight={ArrowRight}
                    onSelect={this.onSelect}
                    alignCenter={false}
                />
            </div>
        );
    }
}

const mapToProps = ({ allNextRaces }) => ({
    allNextRaces,
});
const connectedNextRaces = connect(mapToProps, actions)(NextRaces);
export { connectedNextRaces as NextRaces };
