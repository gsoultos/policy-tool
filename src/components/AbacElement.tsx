import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

class AbacElement extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (<div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography>{this.props.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        this.props.details
                    }
                </AccordionDetails>
            </Accordion>
        </div>)
    }
}

export default AbacElement;