import React from "react";
import { connect } from "redux-zero/react";
import empty from "is-empty";
import actions from "../_actions";
import {
    Row,
    Col,
} from "react-bootstrap";

class ScratchesByRaces extends React.Component {
    getScratches = (races) => {
        let result = [];
        for (let k in races) {
            let raceHorses = races[k];
            let scratches = [];
            scratches = raceHorses.filter((h) => h.statusId === "2");

            if (!empty(scratches)) {
                result.push({
                    raceNumber: k,
                    scratches: scratches,
                });
            }
        }

        return result;
    };

    render() {
        const { horsesRacesSelected } = this.props;

        if (empty(horsesRacesSelected)) {
            return null;
        }

        const scratches = this.getScratches(horsesRacesSelected);

        if (empty(scratches)) {
            return (
                <div className={"scratches-by-races"}>
                    <h2>Retirados</h2>
                    <Row>
                        <Col xl={12}>
                            <p>
                                No existen caballos retirados para las carreras
                                validas para el 5 y 6
                            </p>
                        </Col>
                    </Row>
                </div>
            );
        }

        return (
            <div className={"scratches-by-races"}>
                <h2>Retirados</h2>
                <Row>
                    <Col xl={12}>
                        {scratches.map((s) => {
                            return (
                                <div
                                    key={`scratch-race-${s.raceNumber}`}
                                    className={"horse-numbers-list"}
                                >
                                    <span
                                        className={"horse-numbers-list-title"}
                                    >
                                        Carrera {s.raceNumber}){" "}
                                    </span>

                                    {s.scratches.map((h) => {
                                        return (
                                            <span
                                                key={`scratch-${h.programNumber}`}
                                                className={
                                                    "horse-numbers-list-item"
                                                }
                                            >
                                                <span
                                                    className={`horse-${h.programNumber} float-l`}
                                                >
                                                    &nbsp;&nbsp;
                                                    {h.programNumber}
                                                    &nbsp;&nbsp;
                                                </span>
                                            </span>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapToProps = ({ races }) => ({
    races,
});
const connectedScratchesByRaces = connect(
    mapToProps,
    actions
)(ScratchesByRaces);
export { connectedScratchesByRaces as ScratchesByRaces };
