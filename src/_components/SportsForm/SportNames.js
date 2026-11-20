import React from "react";
import { connect } from "redux-zero/react";
import empty from "is-empty";
import actions from "../../_actions";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const MenuItem = ({
    sportName,
    sportNameES,
    props,
}) => {
    return (
        <div className={`menu-item-races-in-tracks ${(props.activeKeySport == sportName) ? 'race-selected' : ''}`} onClick={() => { props.onClickSportName(sportName); } }>
            <div>{!empty(sportNameES) ? sportNameES : sportName}</div>
        </div>
    );
};

export const Menu = (list, props) =>
    list.map((el) => {
        const { sportName } = el;
        return <MenuItem {...el} props={props} key={sportName} />;
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

class SportNames extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        const { sportsnames } = this.props;

        if (empty(sportsnames)) {
            return null;
        }

        // Create menu from items
        const menu = Menu(sportsnames, this.props);

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

const mapToProps = ({ sportsnames }) => ({
   sportsnames,
});
const connectedSportNames = connect(mapToProps, actions)(SportNames);
export { connectedSportNames as SportNames };
