import React from "react";
import {
    BottomNavigation,
    BottomNavigationAction
} from "@mui/material";
import {Link} from "react-router-dom";

class SideMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: "",
            dialog: false,
        }
    }

    render() {
        return (
            <BottomNavigation
                showLabels
                value={this.state.value}
                onChange={(event, newValue) => {
                    this.setState({
                        value: newValue
                    })
                }}
            >
                <BottomNavigationAction label="Home" component={Link} to="/" value="/"/>
                <BottomNavigationAction label="Subject" component={Link} to="/subject" value="subject"/>
                <BottomNavigationAction label="Resource" component={Link} to="/resource" value="resource"/>
                <BottomNavigationAction label="Action" component={Link} to="/action" value="action"/>
                <BottomNavigationAction label="Environment" component={Link} to="/environment" value="environment"/>
                <BottomNavigationAction label="ABAC" component={Link} to="/abac" value="abac"/>
            </BottomNavigation>
        )
    }
}

export default SideMenu