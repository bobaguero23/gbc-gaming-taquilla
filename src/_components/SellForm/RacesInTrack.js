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
    raceNumber,
    props,
}) => {
    return (
        <div className={`menu-item-races-in-tracks ${(props.activeKey == id) ? 'race-selected' : ''}`} onClick={() => { props.handleSelect(id); } }>
            <div>C{raceNumber}</div>
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

class RacesInTrack extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        const { races } = this.props;

        if (empty(races)) {
            return null;
        }

        // Create menu from items
        const menu = Menu(races, this.props);

        return (
            <div className="races-in-tracks">
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
const connectedRacesInTrack = connect(mapToProps, actions)(RacesInTrack);
export { connectedRacesInTrack as RacesInTrack };
