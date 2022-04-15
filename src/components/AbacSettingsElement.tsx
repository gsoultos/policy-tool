import {TextField} from "@mui/material";
import React, {ChangeEventHandler} from "react";

class AbacSettingsElement extends React.Component<any, any> {
    private readonly onDescriptionChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    private readonly onPolicyIdChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    private readonly onVersionChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    private readonly onRuleCombinationAlgorithmChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    private readonly onMaxDelegationDepthChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

    constructor(props: any) {
        super(props);
        this.onDescriptionChange = this.props.onDescriptionChange.bind(this);
        this.onPolicyIdChange = this.props.onPolicyIdChange.bind(this);
        this.onVersionChange = this.props.onVersionChange.bind(this);
        this.onRuleCombinationAlgorithmChange = this.props.onRuleCombinationAlgorithmChange.bind(this);
        this.onMaxDelegationDepthChange = this.props.onMaxDelegationDepthChange.bind(this);
    }

    render() {
        return (
            <div>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={this.onDescriptionChange}
                    value={this.props.description}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Policy ID"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={this.onPolicyIdChange}
                    value={this.props.policyId}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Version"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={this.onVersionChange}
                    value={this.props.version}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Rule Combining Algorithm ID"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={this.onRuleCombinationAlgorithmChange}
                    value={this.props.ruleCombiningAlgorithm}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Max Delegation Depth"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={this.onMaxDelegationDepthChange}
                    value={this.props.maxDelegationDepth}
                />
            </div>
        );
    }

}

export default AbacSettingsElement;